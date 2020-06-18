export default function getExt(str: string) {
  let a = str.split(".");
  return a[a.length - 1];
}
