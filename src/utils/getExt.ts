export default function getExt(str: string) {
  if (str.indexOf(".") > -1) {
    const a = str.split(".").filter((n) => n);
    return a[a.length - 1];
  }
  return null;
}
