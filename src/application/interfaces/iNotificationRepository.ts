import Notification from "../../domain/entities/notification";

export default interface INotificationRepository {
  createNotification(notification: Notification): Promise<void>;
  getNotificationsForUser(userId: string): Promise<Notification[]>;
  markAsRead(userId: string, notificationId: string): Promise<void>;
  deleteNotification(userId: string, notificationId: string): Promise<void>;
}
