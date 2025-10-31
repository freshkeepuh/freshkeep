export default function slugify(title: string) {
  return (title || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '') // drop quotes
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumerics -> dashes
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
}
