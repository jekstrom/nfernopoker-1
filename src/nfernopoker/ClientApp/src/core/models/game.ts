import { Chat, Team, Story } from "./index"

export interface Game {
  title: string;
  description: string;
  owner: string;
  team: Team;
  cards: { name: string, value: Array<string> };
  stories: Array<Story>;
  chat: Chat;
}
