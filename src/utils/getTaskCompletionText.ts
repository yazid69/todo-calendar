/**
 * Returns a task completion message based on the completion percentage.
 * @param {number} completionPercentage - The completion percentage of tasks.
 * @returns {string} A task completion message.
 */
export const getTaskCompletionText = (completionPercentage: number): string => {
  switch (true) {
    case completionPercentage === 0:
      return "Aucune tâche n'a encore été complétée. Continuez !";
    case completionPercentage === 100:
      return "Félicitations ! Toutes les tâches sont complétées !";
    case completionPercentage >= 75:
      return "Vous y êtes presque !";
    case completionPercentage >= 50:
      return "Vous êtes à mi-chemin ! Continuez ainsi !";
    case completionPercentage >= 25:
      return "Vous progressez bien.";
    default:
      return "Vous venez tout juste de commencer.";
  }
};
