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

  async getGroupChatById(id: string): Promise<GroupChat | null> {
    try {
      return await this.groupChatRepository.getGroupChatById(id);
    } catch (error) {
      console.error("Error getting group chat by id:", error);
      return null;
    }
  }

  async renameGroupChat(groupId: string, newName: string): Promise<void> {
    try {
      const groupChat = await this.groupChatRepository.getGroupChatById(groupId);
      if (!groupChat) throw new Error("Group chat not found");

      const updatedGroupChat: GroupChat = {
        ...groupChat,
        name: newName,
      };

      await this.groupChatRepository.updateGroupChat(updatedGroupChat);
    } catch (error) {
      console.error("Error renaming group chat:", error);
      throw error;
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
