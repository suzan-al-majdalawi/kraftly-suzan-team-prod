export function invoiceStatus(invoice, today) {
  if (invoice.status === "Betald") {
    return "Betald";
  }

  const [year, month, day] = invoice.due.split("-");
  const dueDate = new Date(Number(year), Number(month) - 1, Number(day));

  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  if (invoice.status === "Obetald" && dueDate < todayDate) {
    return "Förfallen";
  }

  return "Obetald";
}
