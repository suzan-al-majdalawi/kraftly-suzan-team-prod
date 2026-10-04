/** 1.42 -> "1,42 kr/kWh" */
export const formatPrice = (price) => {
  /* return `${price.toFixed(2)} kr/kWh`*/
  return `${price.toFixed(2).replace(".", ",")} kr/kWh`; /*lös */
};
