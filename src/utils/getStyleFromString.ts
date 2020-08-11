function getStyleFromString(str: string) {
  const style: any = {};
  if (str) {
    const keyValues = str
      .split(";")
      .filter((item: any) => item)
      .map((item: string) => {
        const [key, value] = item.split(":");
        let tmpKey = key;
        // vertical-align   -> verticalAlign
        // -webkit-overflow-scrolling -> WebkitOverflowScrolling
        if (tmpKey.indexOf("-") > -1) {
          const t = tmpKey.split("-").filter((n) => n.length);
          let i = 1;
          if (tmpKey.startsWith("-")) {
            i = 0;
          }
          for (; i < t.length; i++) {
            t[i] = t[i][0].toLocaleUpperCase() + t[i].substring(1);
          }
          tmpKey = t.join("");
        }
        return {
          key: tmpKey,
          value,
        };
      });
    keyValues.forEach((item: any) => {
      style[item.key] = item.value;
    });
  }
  return style;
}
export default getStyleFromString;
