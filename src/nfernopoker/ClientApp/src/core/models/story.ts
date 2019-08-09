
export interface Story {
  id: string,
  title: string;
  type: string;
  url: string;
  description: string;
  acceptanceCriteria: string;
  storyPoints: string;
  playerPoints: Array<{ player: string, point: string }>
}
