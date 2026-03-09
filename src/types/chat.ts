export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface Chat {
  id: number;
  name: string;
  messages: Message[];
}

export interface Conversation {
  id: string;
  userId: string;
  title: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
