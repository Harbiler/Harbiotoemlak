/** Sentinel for “any / don’t care” filter values — never show raw English “all”. */
export const HEPSI = "hepsi";

export function isHepsi(value: string | null | undefined): boolean {
  return !value || value === HEPSI || value === "all";
}
