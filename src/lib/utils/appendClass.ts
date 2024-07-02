export function appendClass(base: string, extra?: string) {
  if (!extra) return base;

  return `${base} ${extra}`;
}
