/**
 * Returns a greeting based on the current time.
 * @returns {string} The appropriate greeting.
 */
export const displayGreetings = () => {
  const date = new Date();
  const hours = date.getHours();
  let greeting: string;
  if (hours < 12 && hours >= 5) {
    greeting = 'Good morning';
  } else if (hours < 18 && hours > 12) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
    return greeting;
};