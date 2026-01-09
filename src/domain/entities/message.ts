export default interface Message {
  // Core attributes
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;

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
