export function formatAmount(kr) {
  if (kr === undefined) {
    return "–";
  }

  return (
    kr.toLocaleString("sv-SE", {
      minimumFractionDigits: kr % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: 2,
    }) + " kr"
  );
}
