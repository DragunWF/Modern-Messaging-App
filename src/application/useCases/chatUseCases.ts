import IMessageRepository from "../interfaces/iMessageRepository";
import IGroupChatRepository from "../interfaces/iGroupChatRepository";
import IUserRepository from "../interfaces/iUserRepository";
import { IStorageService } from "../interfaces/iStorageService";
import Message from "../../domain/entities/message";
import GroupChat from "../../domain/entities/groupChat";

export class ChatUseCases {
  constructor(
    private messageRepository: IMessageRepository,
    private groupChatRepository: IGroupChatRepository,
    private userRepository: IUserRepository,
    private storageService: IStorageService
  ) {}

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
    replyTo?: {
      content: string;
      senderId: string;
      senderName?: string;
    },
    imageUrl?: string,
    fileUrl?: string,
    voiceMessageUrl?: string
  ): Promise<Message> {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      content,
      timestamp: Date.now(),
      isRead: false,
      isDeleted: false,
      isForwarded: false,
      reactions: {},
    };

    if (replyTo) {
      newMessage.replyTo = replyTo;
    }

    if (imageUrl) {
      newMessage.imageUrl = imageUrl;
    }

    if (fileUrl) {
      newMessage.fileUrl = fileUrl;
    }

    if (voiceMessageUrl) {
      newMessage.voiceMessageUrl = voiceMessageUrl;
    }

    return await this.messageRepository.createMessage(newMessage);
  }

  async uploadImage(uri: string): Promise<string> {
    const path = `chat_images/${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    return await this.storageService.uploadImage(uri, path, "image");
  }

  async uploadFile(uri: string): Promise<string> {
    const path = `chat_files/${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    // Use 'auto' to let Cloudinary detect the file type.
    // This often treats PDFs as page-able images which avoids strict 'raw' access controls.
    return await this.storageService.uploadImage(uri, path, "auto");
  }

  async uploadVoiceMessage(uri: string): Promise<string> {
    const path = `chat_voice/${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    // Cloudinary treats audio as 'video' resource type
    return await this.storageService.uploadImage(uri, path, "video");
  }

  async getMessagesBetweenUsers(
    currentUserId: string,
    otherUserId: string
  ): Promise<Message[]> {
    const allMessages = await this.messageRepository.getMessagesByUserId(
      currentUserId
    );
    return allMessages.filter(
      (m) =>
        (m.senderId === currentUserId && m.receiverId === otherUserId) ||
        (m.senderId === otherUserId && m.receiverId === currentUserId)
    );
  }

  async createGroupChat(name: string, memberIds: string[]): Promise<GroupChat> {
    const newGroupChat: GroupChat = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      memberIds,
    };
    return await this.groupChatRepository.createGroupChat(newGroupChat);
  }

  async getUserGroupChats(userId: string): Promise<GroupChat[]> {
    return await this.groupChatRepository.getGroupChatsByMemberId(userId);
  }

  subscribeToMessages(
    currentUserId: string,
    otherId: string, // Can be userId or groupId
    isGroup: boolean,
    callback: (messages: Message[]) => void
  ): () => void {
    return this.messageRepository.subscribeToMessages((allMessages) => {
      const filteredMessages = allMessages
        .filter((m) => {
          if (isGroup) {
            // In group chat, receiverId is the groupId
            return m.receiverId === otherId;
          } else {
            // In 1-on-1 chat, match sender/receiver pair
            return (
              (m.senderId === currentUserId && m.receiverId === otherId) ||
              (m.senderId === otherId && m.receiverId === currentUserId)
            );
          }
        })
        .sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeB - timeA;
        }); // Sort newest first for inverted list

      callback(filteredMessages);
    });
  }

  // New method to subscribe to ALL messages relevant to the user (for unread counts)
  subscribeToAllMessages(callback: (messages: Message[]) => void): () => void {
    return this.messageRepository.subscribeToMessages((allMessages) => {
      // We pass all messages to the UI, allowing it to filter efficiently based on its state (friends/groups)
      // This avoids complex filtering logic here that depends on changing user groups
      callback(allMessages);
    });
  }

  private getChatId(
    currentUserId: string,
    otherId: string,
    isGroup: boolean
  ): string {
    if (isGroup) {
      return otherId;
    } else {
      // Create a consistent ID for 1-on-1 chats regardless of who is sender/receiver
      return currentUserId < otherId
        ? `${currentUserId}_${otherId}`
        : `${otherId}_${currentUserId}`;
    }
  }

  async markChatAsRead(
    currentUserId: string,
    otherId: string,
    isGroup: boolean
  ): Promise<void> {
    const chatId = this.getChatId(currentUserId, otherId, isGroup);
    await this.userRepository.updateLastRead(
      currentUserId,
      chatId,
      new Date().getTime()
    );
  }

  async sendTypingStatus(
    currentUserId: string,
    otherId: string,
    isGroup: boolean,
    isTyping: boolean
  ): Promise<void> {
    const chatId = this.getChatId(currentUserId, otherId, isGroup);
    console.log(
      `[Typing] Sending status for chat ${chatId}: User ${currentUserId} is ${
        isTyping ? "typing" : "stopped"
      }`
    );
    await this.messageRepository.setTypingStatus(
      chatId,
      currentUserId,
      isTyping
    );
  }

  subscribeToTypingStatus(
    currentUserId: string,
    otherId: string,
    isGroup: boolean,
    callback: (typingUserIds: string[]) => void
  ): () => void {
    const chatId = this.getChatId(currentUserId, otherId, isGroup);
    console.log(
      `[Typing] Subscribing to chat ${chatId} for user ${currentUserId}`
    );
    return this.messageRepository.subscribeToTypingStatus(
      chatId,
      (typingUserIds) => {
        console.log(`[Typing] Update for chat ${chatId}:`, typingUserIds);
        // Filter out self
        const othersTyping = typingUserIds.filter((id) => id !== currentUserId);
        callback(othersTyping);
      }
    );
  }

  async toggleReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void> {
    const message = await this.messageRepository.getMessageById(messageId);
    if (!message) return;

    const reactions = message.reactions || {};
    const userIds = reactions[emoji] || [];

    if (userIds.includes(userId)) {
      // Remove reaction
      reactions[emoji] = userIds.filter((id) => id !== userId);
      if (reactions[emoji].length === 0) {
        delete reactions[emoji];
      }
    } else {
      // Add reaction
      // Optional: Remove user from other reactions if you want single-reaction logic
      // For now, we'll allow multiple reactions per user (like Slack/Discord)
      // or implement Messenger style (one reaction per user).
      // Messenger style: Remove user from ALL other emojis first.
      Object.keys(reactions).forEach((key) => {
        if (reactions[key].includes(userId)) {
          reactions[key] = reactions[key].filter((id) => id !== userId);
          if (reactions[key].length === 0) {
            delete reactions[key];
          }
        }
      });

      reactions[emoji] = [...(reactions[emoji] || []), userId];
    }

    const updatedMessage = { ...message, reactions };
    await this.messageRepository.updateMessage(updatedMessage);
  }

  async forwardMessage(
    senderId: string,
    targetIds: string[],
    messageToForward: Message
  ): Promise<void> {
    if (messageToForward.voiceMessageUrl) {
      throw new Error("Voice messages cannot be forwarded.");
    }

    const promises = targetIds.map(async (targetId) => {
      const newMessage: Message = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        senderId,
        receiverId: targetId,
        content: messageToForward.content,
        timestamp: Date.now(),
        isRead: false,
        isDeleted: false,
        isForwarded: true,
        reactions: {},
      };

      if (messageToForward.imageUrl) {
        newMessage.imageUrl = messageToForward.imageUrl;
      }

      if (messageToForward.fileUrl) {
        newMessage.fileUrl = messageToForward.fileUrl;
      }

      await this.messageRepository.createMessage(newMessage);
    });

    await Promise.all(promises);
  }
}
