import IGroupChatRepository from "../interfaces/iGroupChatRepository";
import GroupChat from "../../domain/entities/groupChat";

export class GroupChatUseCases {
  constructor(private groupChatRepository: IGroupChatRepository) {}

  async createGroupChat(
    name: string,
    creatorId: string,
    memberIds: string[]
  ): Promise<GroupChat> {
    try {
      // Ensure creator is in the member list
      const uniqueMemberIds = Array.from(new Set([...memberIds, creatorId]));

      const newGroupChat: GroupChat = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        name: name,
        memberIds: uniqueMemberIds,
      };

      return await this.groupChatRepository.createGroupChat(newGroupChat);
    } catch (error) {
      console.error("Error creating group chat:", error);
      throw error;
    }
  }

  async getGroupChatsForUser(userId: string): Promise<GroupChat[]> {
    try {
      return await this.groupChatRepository.getGroupChatsByMemberId(userId);
    } catch (error) {
      console.error("Error getting group chats for user:", error);
      return [];
    }
  }

  subscribeToGroupChats(
    userId: string,
    callback: (groupChats: GroupChat[]) => void
  ): () => void {
    try {
      return this.groupChatRepository.subscribeToGroupChats(userId, callback);
    } catch (error) {
      console.error("Error subscribing to group chats:", error);
      return () => {};
    }
  }
}
