/**
 * Returns a greeting based on the current time.
 * @returns {string} The appropriate greeting.
 */
export const displayGreetings = () => {
  const date = new Date();
  const hours = date.getHours();
  let greeting: string;
  if (hours < 12 && hours >= 5) {
    greeting = 'Bonjour';
  } else if (hours < 18 && hours > 12) {
    greeting = 'Bon après-midi';
  } else {
    greeting = 'Bonsoir';
  }
    return greeting;
};