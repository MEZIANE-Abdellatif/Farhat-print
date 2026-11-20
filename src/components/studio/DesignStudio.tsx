"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import type { Canvas, FabricObject, IText } from "fabric";
import { useCart } from "@/components/cart/CartProvider";
import { ProductMockup } from "@/components/ui/ProductMockup";
import { CLIPART, TEMPLATES } from "@/lib/clipart";
import { saveDesign } from "@/lib/design-db";
import { downloadDataUrl, loadImage, validateImageFile } from "@/lib/files";
import type { Messages } from "@/lib/i18n";
import { createTranslator } from "@/lib/translate";
import type { Locale } from "@/lib/locales";
import {
  formatMad,
  type PrintSide,
  type Product,
} from "@/lib/products";
import { buildOrderMessage, whatsappUrl } from "@/lib/whatsapp";
import type { CartItem } from "@/lib/cart-types";

type Props = {
  locale: Locale;
  messages: Messages;
  product: Product;
};

type SelectionState = {
  text?: string;
  fill: string;
  fontSize: number;
};

export function DesignStudio({ locale, messages, product }: Props) {
  const t = createTranslator(messages);
  const { addItem } = useCart();
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const fabricLib = useRef<typeof import("fabric") | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const skipHistory = useRef(false);
  const fileId = useId();

  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "white");
  const [size, setSize] = useState(product.sizes[0] ?? null);
  const [side, setSide] = useState<PrintSide>(product.sides[0] ?? "front");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"product" | "design" | "order">("design");
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 220, height: 240 });
  const sideCache = useRef<Partial<Record<PrintSide, string>>>({});

  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];
  const area = product.printAreas[side];

  const pushHistory = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || skipHistory.current) return;
    const json = JSON.stringify(canvas.toJSON());
    const next = historyRef.current.slice(0, historyIndex.current + 1);
    next.push(json);
    historyRef.current = next.slice(-20);
    historyIndex.current = historyRef.current.length - 1;
  }, []);

  useEffect(() => {
    const el = canvasElRef.current;
    if (!el) return;
    let disposed = false;
    let canvas: Canvas | null = null;

    void import("fabric").then((mod) => {
      if (disposed || !canvasElRef.current) return;
      fabricLib.current = mod;
      canvas = new mod.Canvas(canvasElRef.current, {
        preserveObjectStacking: true,
        selection: true,
        backgroundColor: "rgba(255,255,255,0)",
        width: canvasSize.width,
        height: canvasSize.height,
      });
      fabricRef.current = canvas;

      const onSelect = () => {
        const obj = canvas?.getActiveObject();
        if (!obj) {
          setSelection(null);
          return;
        }
        const isText = obj.type === "i-text" || obj.type === "text";
        setSelection({
          text: isText ? String((obj as IText).text ?? "") : undefined,
          fill: String(obj.get("fill") ?? "#111827"),
          fontSize: Number(obj.get("fontSize") ?? 28),
        });
      };

      canvas.on("selection:created", onSelect);
      canvas.on("selection:updated", onSelect);
      canvas.on("selection:cleared", () => setSelection(null));
      canvas.on("object:modified", pushHistory);
      canvas.on("object:added", pushHistory);
      setReady(true);
    });

    return () => {
      disposed = true;
      fabricRef.current?.dispose();
      fabricRef.current = null;
      setReady(false);
    };
    // Canvas is created once; size updates use setDimensions below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushHistory]);

  useEffect(() => {
    fabricRef.current?.setDimensions({
      width: canvasSize.width,
      height: canvasSize.height,
    });
  }, [canvasSize.height, canvasSize.width]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const frame = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      setCanvasSize({
        width: Math.max(120, Math.round(width * area.width)),
        height: Math.max(120, Math.round(height * area.height)),
      });
    };
    frame();
    const observer = new ResizeObserver(frame);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [area.height, area.width]);

  async function addImageFromUrl(url: string) {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const FabricImage = fabricLib.current?.FabricImage;
    if (!FabricImage) return;
    const image = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
    image.scaleToWidth(Math.min(canvas.getWidth() * 0.72, 160));
    image.set({ left: 16, top: 16 });
    canvas.add(image);
    canvas.setActiveObject(image);
    canvas.requestRenderAll();
  }

  function addText(value: string, fill = "#111827") {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const ITextCtor = fabricLib.current?.IText;
    if (!ITextCtor) return;
    const text = new ITextCtor(value, {
      left: 20,
      top: 24,
      fill,
      fontSize: 28,
      fontFamily: "Outfit, Arial, sans-serif",
      textAlign: "center",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
  }

  async function onUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const problem = validateImageFile(file, {
      type: t("errors.fileType"),
      size: t("errors.fileSize"),
    });
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    try {
      await addImageFromUrl(url);
    } catch {
      setError(t("errors.generic"));
    }
  }

  function updateActive(patch: Partial<SelectionState>) {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    if (patch.text !== undefined && "text" in obj) {
      (obj as IText).set("text", patch.text);
    }
    if (patch.fill) obj.set("fill", patch.fill);
    if (patch.fontSize) obj.set("fontSize", patch.fontSize);
    canvas.requestRenderAll();
    setSelection((current) => (current ? { ...current, ...patch } : current));
    pushHistory();
  }

  function duplicateActive() {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    void obj.clone().then((cloned: FabricObject) => {
      cloned.set({ left: (obj.left ?? 0) + 16, top: (obj.top ?? 0) + 16 });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  }

  function deleteActive() {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  async function applyHistory(index: number) {
    const canvas = fabricRef.current;
    const json = historyRef.current[index];
    if (!canvas || json === undefined) return;
    skipHistory.current = true;
    await canvas.loadFromJSON(json);
    canvas.requestRenderAll();
    skipHistory.current = false;
    historyIndex.current = index;
  }

  async function switchSide(next: PrintSide) {
    const canvas = fabricRef.current;
    if (!canvas || next === side) return;
    sideCache.current[side] = JSON.stringify(canvas.toJSON());
    setSide(next);
    const cached = sideCache.current[next];
    skipHistory.current = true;
    canvas.clear();
    if (cached) await canvas.loadFromJSON(cached);
    canvas.requestRenderAll();
    skipHistory.current = false;
  }

  async function composePreview(): Promise<string> {
    const canvas = fabricRef.current;
    if (!canvas || !color) return "";
    const mockup = await loadImage(color.mockup);
    const out = document.createElement("canvas");
    out.width = 900;
    out.height = 1200;
    const ctx = out.getContext("2d");
    if (!ctx) return "";
    ctx.fillStyle = "#121722";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(mockup, 0, 0, out.width, out.height);
    const design = canvas.toDataURL({ format: "png", multiplier: 2 });
    const designImg = await loadImage(design);
    if (color.blend === "multiply") ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(
      designImg,
      area.x * out.width,
      area.y * out.height,
      area.width * out.width,
      area.height * out.height,
    );
    ctx.globalCompositeOperation = "source-over";
    return out.toDataURL("image/jpeg", 0.9);
  }

  async function exportPrint(): Promise<string> {
    const canvas = fabricRef.current;
    if (!canvas) return "";
    return canvas.toDataURL({ format: "png", multiplier: 3 });
  }

  async function addToCart() {
    const canvas = fabricRef.current;
    if (!canvas || !color) return;
    setBusy(true);
    setError(null);
    try {
      const preview = await composePreview();
      const id = crypto.randomUUID();
      await saveDesign(id, JSON.stringify(canvas.toJSON()));
      const item: CartItem = {
        id,
        productSlug: product.slug,
        productName: t(`productNames.${product.slug}`),
        colorId: color.id,
        colorName: t(`colors.${color.id}`),
        colorHex: color.hex,
        size,
        quantity,
        side,
        priceMad: product.priceMad,
        previewDataUrl: preview,
      };
      addItem(item);
      setAdded(true);
    } catch {
      setError(t("errors.generic"));
    } finally {
      setBusy(false);
    }
  }

  async function orderNow() {
    setBusy(true);
    try {
      const preview = await composePreview();
      downloadDataUrl(preview, `farhat-${product.slug}.jpg`);
      const item: CartItem = {
        id: "direct",
        productSlug: product.slug,
        productName: t(`productNames.${product.slug}`),
        colorId: color?.id ?? "",
        colorName: color ? t(`colors.${color.id}`) : "",
        colorHex: color?.hex ?? "#fff",
        size,
        quantity,
        side,
        priceMad: product.priceMad,
        previewDataUrl: preview,
      };
      window.open(
        whatsappUrl(
          buildOrderMessage(
            [item],
            formatMad(product.priceMad * quantity, locale),
            locale,
          ),
        ),
        "_blank",
        "noopener,noreferrer",
      );
    } catch {
      setError(t("errors.generic"));
    } finally {
      setBusy(false);
    }
  }

  const field =
    "mt-1 min-h-11 w-full rounded-xl border border-white/15 bg-black/40 px-3 font-normal text-white";
  const pill =
    "min-h-11 rounded-full bg-white/10 text-sm font-semibold text-white hover:bg-white/15";

  return (
    <div className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">
      <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
        {t("studio.title")}
      </p>
      <h1 className="mt-2 font-display text-5xl text-white sm:text-6xl">
        {t(`productNames.${product.slug}`)}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-white/55">{t("studio.uploadHint")}</p>
      {!ready ? <p className="mt-2 text-sm text-cyan-200">{t("studio.loading")}</p> : null}

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="lg:sticky lg:top-24">
          <div
            ref={stageRef}
            className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-[#121722] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          >
            <ProductMockup
              product={product}
              colorId={colorId}
              title={t(`productNames.${product.slug}`)}
              priority
              className="absolute inset-0"
            />
            <div
              className="absolute overflow-hidden rounded-sm"
              style={{
                left: `${area.x * 100}%`,
                top: `${area.y * 100}%`,
                width: `${area.width * 100}%`,
                height: `${area.height * 100}%`,
                mixBlendMode: color?.blend === "multiply" ? "multiply" : "normal",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
              }}
            >
              <canvas ref={canvasElRef} className="h-full w-full" aria-label={t("studio.printArea")} />
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-[#0e131c] p-4">
          <div className="grid grid-cols-3 gap-1 rounded-full bg-white/5 p-1">
            {(["product", "design", "order"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`min-h-11 rounded-full text-xs font-semibold ${
                  tab === id ? "bg-cyan-300 text-ink" : "text-white/70"
                }`}
              >
                {id === "product"
                  ? t("products.details")
                  : id === "design"
                    ? t("products.customize")
                    : t("cart.order")}
              </button>
            ))}
          </div>
          {tab === "product" ? (
            <>
              <fieldset>
                <legend className="text-sm font-semibold text-white">{t("products.color")}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setColorId(item.id)}
                      aria-pressed={item.id === colorId}
                      aria-label={t(`colors.${item.id}`)}
                      className={`h-11 w-11 rounded-full border-2 ${
                        item.id === colorId ? "border-cyan-300" : "border-white/20"
                      }`}
                      style={{ backgroundColor: item.hex }}
                    />
                  ))}
                </div>
              </fieldset>
              {product.sizes.length > 0 ? (
                <label className="text-sm font-semibold text-white">
                  {t("products.size")}
                  <select
                    className={field}
                    value={size ?? ""}
                    onChange={(event) => setSize(event.target.value)}
                  >
                    {product.sizes.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              {product.sides.length > 1 ? (
                <div className="flex gap-2">
                  {product.sides.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`min-h-11 flex-1 rounded-full text-sm font-semibold ${
                        side === value ? "bg-cyan-300 text-ink" : "bg-white/10 text-white"
                      }`}
                      onClick={() => void switchSide(value)}
                    >
                      {t(`products.${value}`)}
                    </button>
                  ))}
                </div>
              ) : null}
              <label className="text-sm font-semibold text-white">
                {t("studio.quantity")}
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
                  className={field}
                />
              </label>
            </>
          ) : null}

          {tab === "design" ? (
            <>
              <div className="flex flex-col gap-2">
                <button type="button" className={pill} onClick={() => addText(t("studio.defaultText"))}>
                  {t("studio.addText")}
                </button>
                <label className={`flex cursor-pointer items-center justify-center ${pill}`}>
                  {t("studio.upload")}
                  <input
                    id={fileId}
                    type="file"
                    accept={["image/png", "image/jpeg", "image/webp", "image/svg+xml"].join(",")}
                    className="sr-only"
                    onChange={(event) => void onUpload(event)}
                  />
                </label>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t("studio.clipart")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CLIPART.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white"
                      aria-label={t(`clipart.${item.id}`)}
                      onClick={() => void addImageFromUrl(item.src)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.src} alt="" width={28} height={28} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t("studio.templates")}</p>
                <p className="text-xs text-white/45">{t("studio.templatesHint")}</p>
                <div className="mt-2 flex flex-col gap-2">
                  {TEMPLATES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={pill}
                      onClick={() => addText(item.text, item.fill)}
                    >
                      {t(`templates.${item.id}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-sm font-semibold text-white">{t("studio.layers")}</p>
                {selection ? (
                  <div className="mt-2 space-y-2">
                    {selection.text !== undefined ? (
                      <label className="block text-xs font-semibold text-white/80">
                        {t("studio.textContent")}
                        <input
                          value={selection.text}
                          onChange={(event) => updateActive({ text: event.target.value })}
                          className={field}
                        />
                      </label>
                    ) : null}
                    <label className="flex min-h-11 items-center gap-2 text-xs font-semibold text-white/80">
                      {t("studio.fill")}
                      <input
                        type="color"
                        value={toHex(selection.fill)}
                        onChange={(event) => updateActive({ fill: event.target.value })}
                        className="h-11 w-14 rounded"
                      />
                    </label>
                    <label className="block text-xs font-semibold text-white/80">
                      {t("studio.fontSize")}
                      <input
                        type="range"
                        min={12}
                        max={72}
                        value={selection.fontSize}
                        onChange={(event) =>
                          updateActive({ fontSize: Number(event.target.value) })
                        }
                        className="w-full"
                      />
                    </label>
                    <div className="flex gap-2">
                      <button type="button" className={`${pill} flex-1`} onClick={duplicateActive}>
                        {t("studio.duplicate")}
                      </button>
                      <button
                        type="button"
                        className={`${pill} flex-1 text-rose-300`}
                        onClick={deleteActive}
                      >
                        {t("studio.delete")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-white/45">{t("studio.noSelection")}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`${pill} flex-1`}
                  onClick={() => void applyHistory(historyIndex.current - 1)}
                >
                  {t("studio.undo")}
                </button>
                <button
                  type="button"
                  className={`${pill} flex-1`}
                  onClick={() => void applyHistory(historyIndex.current + 1)}
                >
                  {t("studio.redo")}
                </button>
              </div>
            </>
          ) : null}

          {tab === "order" ? (
            <>
              {error ? (
                <p role="alert" className="text-sm font-semibold text-rose-300">
                  {error}
                </p>
              ) : null}
              {busy ? <p className="text-sm text-white/50">{t("studio.busyExport")}</p> : null}
              {added ? (
                <p className="text-sm font-semibold text-emerald-300">
                  {t("studio.added")}{" "}
                  <Link className="underline" href={`/${locale}/cart`}>
                    {t("studio.viewCart")}
                  </Link>
                </p>
              ) : null}
              <button
                type="button"
                disabled={busy}
                onClick={() => void addToCart()}
                className="min-h-11 rounded-full bg-cyan-300 text-sm font-bold text-ink"
              >
                {t("studio.addToCart")}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void orderNow()}
                className="min-h-11 rounded-full bg-emerald-500 text-sm font-bold text-white"
              >
                {t("studio.orderNow")}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void composePreview().then((url) =>
                    downloadDataUrl(url, `farhat-preview-${product.slug}.jpg`),
                  )
                }
                className={pill}
              >
                {t("studio.exportPreview")}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void exportPrint().then((url) =>
                    downloadDataUrl(url, `farhat-print-${product.slug}.png`),
                  )
                }
                className={pill}
              >
                {t("studio.exportPrint")}
              </button>
            </>
          ) : null}

          {tab !== "order" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void addToCart()}
              className="min-h-11 rounded-full bg-cyan-300 text-sm font-bold text-ink"
            >
              {t("studio.addToCart")}
            </button>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function toHex(color: string): string {
  if (color.startsWith("#") && color.length === 7) return color;
  return "#111827";
}
