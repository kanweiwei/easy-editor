const getAttr = (attrs: any, attrName: any) => {
  if (!attrs) {
    return null;
  }
  const a = attrs.find((attr: any) => {
    return attr.name === attrName;
  });
  if (a) {
    if (a.value === Number(a.value)) {
      return Number(a.value);
    }
    return a.value;
  }
  return null;
};

export default getAttr;
