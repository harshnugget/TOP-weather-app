export default function dateFormatting(date) {
  let dateObj = new Date(date);

  // Validate
  if (isNaN(dateObj.getTime())) {
    throw new Error(`Incorrect date format: ${date}`);
  }

  // Convert the date to UTC
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();
  dateObj = new Date(Date.UTC(year, monthIndex, day));

  // Get today's date in UTC
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  // Check if the input date is equal to today's date
  if (dateObj.getTime() === todayUTC.getTime()) {
    return 'Today';
  }

  // Define the formatting options
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  // Format the dateObj using the options defined
  const formattedDate = new Intl.DateTimeFormat('en-UK', options).format(dateObj);

  return formattedDate;
}
