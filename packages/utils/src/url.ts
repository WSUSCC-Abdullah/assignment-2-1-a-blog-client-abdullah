export function toUrlPath(path: string) {
  return path
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumerics with hyphen
    .replace(/-+/g, "-")         // replace multiple hyphens with single
    .replace(/^-+|-+$/g, "");    // trim leading/trailing hyphens
}