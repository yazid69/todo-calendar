/**
 * Returns a random greeting message to inspire productivity.
 * @returns {string} A random greeting message with optional emoji code.
 */
export const getRandomGreetings = (): string => {
  const hours = 24 - new Date().getHours();

  const textGreetings: string[] = [
    "Faisons en sorte que chaque jour compte ! **1f680**",
    "Accomplis des choses et conquiers la journée !",
    "Adopte le pouvoir de la productivité !",
    "Fixe tes objectifs, écrase-les, répète.",
    "Aujourd'hui est une nouvelle opportunité d'être productif !",
    "Fais de chaque moment un moment qui compte.",
    "Reste organisé, reste en avance.",
    "Prends le contrôle de ta journée !",
    "Une tâche à la fois, tu peux le faire !",
    "La productivité est la clé du succès. **1f511**",
    "Transformons les plans en réalisations !",
    "Commence petit, accomplis grand.",
    "Sois efficace, sois productif.",
    "Exploite le pouvoir de la productivité !",
    "Prépare-toi à faire bouger les choses !",
    "Il est temps de cocher ces tâches ! **2705**",
    "Commence ta journée avec un plan ! **1f5d3-fe0f**",
    "Reste concentré, reste productif.",
    "Libère ton potentiel de productivité. **1f513**",
    "Transforme ta liste de choses à faire en liste de choses faites ! **1f4dd**",

    `Passe une merveilleuse ${new Date().toLocaleDateString("fr", {
      weekday: "long",
    })} !`,
    `Joyeux mois de ${new Date().toLocaleDateString("fr", {
      month: "long",
    })} ! Un excellent mois pour la productivité !`,
    hours > 4
      ? `${hours} heures restantes dans la journée. Utilise-les judicieusement !`
      : `Il ne reste que ${hours} heures dans la journée`,
  ];

  const randomIndex = Math.floor(Math.random() * textGreetings.length);
  return textGreetings[randomIndex];
};
