export default function omit(obj: any, keys: string[]) {
  if (keys && keys.length) {
    const res: any = {};
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        if (keys.indexOf(k) === -1) {
          res[k] = obj[k];
        }
      }
    }
    return res;
  }
  return { ...obj };
}
