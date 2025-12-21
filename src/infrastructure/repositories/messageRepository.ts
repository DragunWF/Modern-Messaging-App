import {
  ref,
  get,
  set,
  child,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { rtdb } from "../database/firebaseConfig";
import type IMessageRepository from "../../application/interfaces/iMessageRepository";
import type Message from "../../domain/entities/message";

export default class MessageRepository implements IMessageRepository {
  private static collectionName = "messages";

  async getMessageById(id: string): Promise<Message | null> {
    try {
      const dbRef = ref(rtdb);
      const snapshot = await get(
        child(dbRef, `${MessageRepository.collectionName}/${id}`)
      );
      if (snapshot.exists()) {
        return snapshot.val() as Message;
      }
      return null;
    } catch (error) {
      console.error("Error getting message by ID:", error);
      throw error;
    }
  }

  async createMessage(message: Message): Promise<Message> {
    try {
      await set(
        ref(rtdb, `${MessageRepository.collectionName}/` + message.id),
        message
      );
      return message;
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  async updateMessage(message: Message): Promise<Message> {
    try {
      const updates: any = {};
      updates[`/${MessageRepository.collectionName}/` + message.id] = message;
      await update(ref(rtdb), updates);
      return message;
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      await remove(ref(rtdb, `${MessageRepository.collectionName}/` + id));
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  }

  async getMessagesByUserId(userId: string): Promise<Message[]> {
    try {
      const messagesRef = ref(rtdb, MessageRepository.collectionName);

      // Query sent messages
      const sentQuery = query(
        messagesRef,
        orderByChild("senderId"),
        equalTo(userId)
      );
      const sentSnapshot = await get(sentQuery);

      // Query received messages
      const receivedQuery = query(
        messagesRef,
        orderByChild("receiverId"),
        equalTo(userId)
      );
      const receivedSnapshot = await get(receivedQuery);

      let messages: Message[] = [];

      if (sentSnapshot.exists()) {
        const sentVal = sentSnapshot.val();
        if (sentVal) {
          messages = [...messages, ...(Object.values(sentVal) as Message[])];
        }
      }
      if (receivedSnapshot.exists()) {
        const recVal = receivedSnapshot.val();
        if (recVal) {
          messages = [...messages, ...(Object.values(recVal) as Message[])];
        }
      }

      // Remove potential duplicates if any (unlikely with this logic but good practice)
      const uniqueMessages = Array.from(
        new Map(messages.map((m) => [m.id, m])).values()
      );

      // Sort by timestamp
      return uniqueMessages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    } catch (error) {
      console.error("Error getting messages by user ID:", error);
      throw error;
    }
  }
}
