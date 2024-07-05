const newDateWithParam = (date) => new Date(date);
const newDateWithOutParam = () => new Date();

export const currentDate = () => {
  const d = newDateWithOutParam();
  return dateFormatter(d)
}
export const formatDate = (date) => {
    const d = newDateWithParam(date)
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

export const dateOnlyFormatter = (date) => {
  const newDateTime = newDateWithParam(date);
  const year = newDateTime.getFullYear();
  const month = String(newDateTime.getMonth() + 1).padStart(2, '0');
  const day = String(newDateTime.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export const dateFormatter = (date) => {
    const newDateTime = new Date(date);

    const formattedDate = newDateTime.toLocaleString("en-PH", {
      month: "long", // Full month name
      day: "numeric", // Day of the month
      year: "numeric", // Full year
    });
    return formattedDate;
};
