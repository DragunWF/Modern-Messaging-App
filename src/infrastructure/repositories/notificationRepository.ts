import { ref, set, push, get, update, remove, child } from "firebase/database";
import { rtdb } from "../database/firebaseConfig";
import Notification from "../../domain/entities/notification";
import INotificationRepository from "../../application/interfaces/iNotificationRepository";

export default class NotificationRepository implements INotificationRepository {
  private static collectionName = "notifications";

  async createNotification(notification: Notification): Promise<void> {
    try {
      // Structure: notifications/{recipientId}/{notificationId}
      const dbRef = ref(
        rtdb,
        `${NotificationRepository.collectionName}/${notification.recipientId}`
      );
      const newNotificationRef = push(dbRef);
      const notificationWithId = {
        ...notification,
        id: newNotificationRef.key as string,
      };
      await set(newNotificationRef, notificationWithId);
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  async getNotificationsForUser(userId: string): Promise<Notification[]> {
    try {
      const dbRef = ref(
        rtdb,
        `${NotificationRepository.collectionName}/${userId}`
      );
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data) as Notification[];
      }
      return [];
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw error;
    }
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      const dbRef = ref(
        rtdb,
        `${NotificationRepository.collectionName}/${userId}/${notificationId}`
      );
      await update(dbRef, { isRead: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  async deleteNotification(
    userId: string,
    notificationId: string
  ): Promise<void> {
    try {
      const dbRef = ref(
        rtdb,
        `${NotificationRepository.collectionName}/${userId}/${notificationId}`
      );
      await remove(dbRef);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}
