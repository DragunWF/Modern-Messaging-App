export type NotificationType = "FRIEND_REQUEST" | "FRIEND_REQUEST_ACCEPTED";

export default interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: number;
  data?: {
    [key: string]: any;
  };
}
