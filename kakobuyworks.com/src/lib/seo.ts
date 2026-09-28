export function clampMeta(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  const slice = normalized.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const ending = lastSpace >= Math.floor(maxLength * 0.7) ? slice.slice(0, lastSpace) : slice;
  return `${ending.trimEnd()}…`;
}
