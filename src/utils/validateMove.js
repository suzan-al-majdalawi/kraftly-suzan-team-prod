export function validateMove(form, today = new Date()) {
  const errors = {};

  // Alla fält måste vara ifyllda
  if (!form.address?.trim()) {
    errors.address = "Adress måste fyllas i";
  }

  if (!form.zip?.trim()) {
    errors.zip = "Postnummer måste fyllas i";
  } else if (!/^\d{5}$/.test(form.zip)) {
    errors.zip = "Postnummer ska vara fem siffror";
  }

  if (!form.city?.trim()) {
    errors.city = "Ort måste fyllas i";
  }

  if (!form.date?.trim()) {
    errors.date = "Datum måste fyllas i";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) {
    errors.date = "Datum ska vara i formatet ÅÅÅÅ-MM-DD";
  } else {
    const moveDate = new Date(`${form.date}T00:00:00`);
    const todayDate = new Date(today);

    // Jämför kalenderdagar, inte klockslag
    todayDate.setHours(0, 0, 0, 0);

    const diffDays = (moveDate - todayDate) / (1000 * 60 * 60 * 24);

    if (diffDays < 14) {
      errors.date = "Anmälan måste göras senast 14 dagar före flytt";
    }
  }

  if (!form.contract?.trim()) {
    errors.contract = "Avtal måste väljas";
  }

  return errors;
}
