export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b(\w)/g, (s) => s.toUpperCase())
    .replace(/_/g, '-')
}
