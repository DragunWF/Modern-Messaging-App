export default interface Message {
  // Core attributes
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;

  // Additional attributes
  reactions: {
    [emoji: string]: string[]; // Key is Emoji, Value is array of UserIDs
  };
  replyTo?: {
    content: string;
    senderId: string;
    senderName?: string;
  };
  isRead: boolean;
  isDeleted: boolean;
  isForwarded: boolean;

  // Metadata
  imageUrl?: string;
  fileUrl?: string;
  voiceMessageUrl?: string;
}
