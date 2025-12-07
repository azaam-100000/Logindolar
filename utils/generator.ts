/**
 * Generates a random string of alphanumeric characters.
 */
const generateRandomString = (length: number): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates a random Gmail address.
 * Format: [random8-12chars][random2digits]@gmail.com
 * Ensures non-sequential, random output.
 */
export const generateRandomEmail = (): string => {
  const nameLength = Math.floor(Math.random() * 5) + 8; // 8 to 12 chars
  const name = generateRandomString(nameLength);
  // Add some random digits to ensure uniqueness and realistic look
  const digits = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${name}${digits}@gmail.com`;
};

/**
 * Generates a strong random password.
 */
export const generateRandomPassword = (): string => {
  const length = 12;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Formats a date object to a readable time string.
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-GB', { hour12: false }) + '.' + date.getMilliseconds().toString().padStart(3, '0');
};