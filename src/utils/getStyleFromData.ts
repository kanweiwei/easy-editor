function getStyleFromData(node: any) {
  const style: any = {};
  if (!node.get("data")) {
    return style;
  }
  const tempStyle: any = node.get("data").get("style");
  if (tempStyle) {
    const keys: string[] = Object.keys(tempStyle);
    keys.forEach((key: string) => {
      let tempKey: string = key;
      if (tempKey.indexOf("-")) {
        const t = tempKey.split("-").filter((n) => n.length);
        let i = 1;
        if (tempKey.startsWith("-")) {
          i = 0;
        }
        for (; i < t.length; i++) {
          t[i] = t[i][0].toLocaleUpperCase() + t[i].substring(1);
        }
        tempKey = t.join("");
      }
      style[tempKey] = tempStyle[key];
    });
  }
  return style;
}

export default getStyleFromData;
