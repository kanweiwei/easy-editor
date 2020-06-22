export default function getExt(str) {
  var a = str.split(".");
  return a[a.length - 1];
}