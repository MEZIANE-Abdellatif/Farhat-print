export function translate(
  messages: unknown,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);

  if (typeof value !== "string") return key;
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (_, name: string) =>
    String(vars[name] ?? `{${name}}`),
  );
}

export function createTranslator(messages: unknown) {
  return (key: string, vars?: Record<string, string | number>) =>
    translate(messages, key, vars);
}
