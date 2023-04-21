export type role = "sender" | "receiver";

export interface IChatData {
    text: string;
    type: role;
    avatar: string;
  }