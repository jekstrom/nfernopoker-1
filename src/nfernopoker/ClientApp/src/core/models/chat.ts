export interface Chat {
  thread: Array<ChatMessage>;
}

export interface ChatMessage {
  user: string;
  message: string;
  time: string;
}
