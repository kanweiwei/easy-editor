function getStyleFromString(str: string) {
  const style: any = {};
  if (str) {
    const temp = str
      .split(";")
      .filter((item: any) => item)
      .map((item: string) => {
        const a = item.split(":");
        // vertical-align   -> verticalAlign
        if (a[0].indexOf("-")) {
          const t = a[0].split("-");
          for (let i = 1; i < t.length; i++) {
            t[i] = t[i][0].toLocaleUpperCase() + t[i].substring(1);
          }
          a[0] = t.join("");
        }
        return {
          key: a[0],
          value: a[1],
        };
      });
    temp.forEach((item: any) => {
      style[item.key] = item.value;
    });
  }
  return style;
}
export default getStyleFromString;
