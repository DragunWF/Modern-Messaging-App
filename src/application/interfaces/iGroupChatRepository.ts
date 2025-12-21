import type GroupChat from "../../domain/entities/groupChat";

export default interface IGroupChatRepository {
  getGroupChatById(id: string): Promise<GroupChat | null>;
  createGroupChat(groupChat: GroupChat): Promise<GroupChat>;
  updateGroupChat(groupChat: GroupChat): Promise<GroupChat>;
  deleteGroupChat(id: string): Promise<void>;
  getGroupChatsByMemberId(memberId: string): Promise<GroupChat[]>;
}
