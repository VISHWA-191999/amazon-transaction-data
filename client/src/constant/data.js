export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export const getMonthNumber = (month) => {
  return months.indexOf(month) + 1;
}