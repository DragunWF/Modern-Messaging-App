import IMessageRepository from "../interfaces/iMessageRepository";
import IGroupChatRepository from "../interfaces/iGroupChatRepository";
import Message from "../../domain/entities/message";
import GroupChat from "../../domain/entities/groupChat";

export class ChatUseCases {
  constructor(
    private messageRepository: IMessageRepository,
    private groupChatRepository: IGroupChatRepository
  ) {}

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<Message> {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
      isRead: false,
      isDeleted: false,
      isForwarded: false,
      reactions: {},
    };
    return await this.messageRepository.createMessage(newMessage);
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
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ); // Sort newest first for inverted list

      callback(filteredMessages);
    });
  }
}
