/**
 * Format any valid date string or object to DD/MM/YYYY.
 *
 * @param {string|Date} dateInput
 * @returns {string} Formatted date (e.g. 08/06/2026) or original string if invalid
 */
function formatIndianDate(dateInput) {
  if (!dateInput) return '';
  
  try {
    const dateObj = new Date(dateInput);
    
    // Check if valid date
    if (!isNaN(dateObj.getTime())) {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (error) {
    // If formatting fails, fallback to input
    return String(dateInput);
  }
  
  return String(dateInput);
}

module.exports = { formatIndianDate };
