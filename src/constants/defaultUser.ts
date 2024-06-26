import { EmojiStyle } from "emoji-picker-react";
import { User } from "../types/user";
import { iOS } from "../utils/iOS";

/**
 * Represents a default user object.
 */
export const defaultUser: User = {
  name: null,
  createdAt: new Date(),
  profilePicture: null,
  emojisStyle: iOS ? EmojiStyle.NATIVE : EmojiStyle.APPLE,
  tasks: [],
  settings: [
    {
      enableCategories: true,
      doneToBottom: false,
      enableGlow: true,
      enableReadAloud: true,
      voice: "Google FR Français Homme",
      voiceVolume: 0.6,
    },
  ],
  categories: [
    { id: 1, name: "Maison", emoji: "1f3e0", color: "#1fff44" },
    { id: 2, name: "Travail", emoji: "1f3e2", color: "#248eff" },
    { id: 3, name: "Personnelle", emoji: "1f464", color: "#e843fe" },
    { id: 4, name: "Gym/Fitness", emoji: "1f4aa", color: "#ffdf3d" },
    { id: 5, name: "Education", emoji: "1f4da", color: "#ff8e24" },
  ],
};
