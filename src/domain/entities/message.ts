export default interface Message {
  // Core attributes
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: Date;

  // Additional attributes
  reactions: Record<string, number>; // e.g., { "like": 3, "love": 1 }
  isRead: boolean;
  isDeleted: boolean;
  isForwarded: boolean;

  // Metadata
  imageUrl?: string;
  fileUrl?: string;
  voiceMessageUrl?: string;
}
