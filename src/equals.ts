export function equals(l: any, r: any): boolean {
  if (l === r) return true;
  if (l === null || r === null) return l === r;
  if (l === undefined || r === undefined) return l === r;

  if (typeof r === "function") {
    return r(l);
  }

  if (Array.isArray(l) && Array.isArray(r)) {
    if (l.length !== r.length) return false;
    return l.every((lv, i) => equals(lv, r[i]));
  }

  if (typeof l === "object" && typeof r === "object") {
    const lKeys = Object.keys(l);
    const rKeys = Object.keys(r);
    if (lKeys.length !== rKeys.length) return false;
    return lKeys.every((key) => equals(l[key], r[key]));
  }

  return false;
}
