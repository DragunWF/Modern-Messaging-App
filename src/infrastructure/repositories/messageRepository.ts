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
  onValue,
  off,
  onDisconnect,
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
      return uniqueMessages.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeA - timeB;
      });
    } catch (error) {
      console.error("Error getting messages by user ID:", error);
      throw error;
    }
  }

  subscribeToMessages(callback: (messages: Message[]) => void): () => void {
    const messagesRef = ref(rtdb, MessageRepository.collectionName);

    const onValueChange = (snapshot: any) => {
      const messages: Message[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot: any) => {
          messages.push(childSnapshot.val());
        });
      }
      callback(messages);
    };

    onValue(messagesRef, onValueChange);

    return () => {
      off(messagesRef, "value", onValueChange);
    };
  }

  async setTypingStatus(
    chatId: string,
    userId: string,
    isTyping: boolean
  ): Promise<void> {
    const typingRef = ref(rtdb, `typingStatus/${chatId}/${userId}`);
    if (isTyping) {
      await set(typingRef, true);
      // Optional: Auto-remove on disconnect so it doesn't get stuck if app crashes
      onDisconnect(typingRef).remove();
    } else {
      await remove(typingRef);
      onDisconnect(typingRef).cancel();
    }
  }

  subscribeToTypingStatus(
    chatId: string,
    callback: (typingUserIds: string[]) => void
  ): () => void {
    const typingRef = ref(rtdb, `typingStatus/${chatId}`);

    const onValueChange = (snapshot: any) => {
      if (snapshot.exists()) {
        const typingData = snapshot.val();
        // Returns an array of userIds who are currently typing (keys where value is true)
        const typingUserIds = Object.keys(typingData);
        callback(typingUserIds);
      } else {
        callback([]);
      }
    };

    onValue(typingRef, onValueChange);

    return () => {
      off(typingRef, "value", onValueChange);
    };
  }
}
