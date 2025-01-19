const formatDateForInput = (dateInput) => {
  if (dateInput === null || dateInput === undefined) {
    return "";
  }
  const dateObj = new Date(dateInput);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeDate = (date) => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

const compareDatesIgnoringTime = (date1, date2) => {
  const normalizedDate1 = normalizeDate(date1);
  const normalizedDate2 = normalizeDate(date2);
  return normalizedDate1.getTime() === normalizedDate2.getTime();
};

const formatDateReadable = (dateInput) => {
  if (dateInput === null || dateInput === undefined) {
    return "";
  }
  const dateObj = new Date(dateInput);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return dateObj.toLocaleDateString(undefined, options);
};

export { formatDateForInput, compareDatesIgnoringTime, normalizeDate, formatDateReadable };
