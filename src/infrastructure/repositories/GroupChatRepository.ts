import {
  ref,
  get,
  set,
  child,
  update,
  remove,
  onValue,
  off,
} from "firebase/database";
import { rtdb } from "../database/firebaseConfig";
import type IGroupChatRepository from "../../application/interfaces/iGroupChatRepository";
import type GroupChat from "../../domain/entities/groupChat";

export default class GroupChatRepository implements IGroupChatRepository {
  private static collectionName = "groupChats";

  async getGroupChatById(id: string): Promise<GroupChat | null> {
    try {
      const dbRef = ref(rtdb);
      const snapshot = await get(
        child(dbRef, `${GroupChatRepository.collectionName}/${id}`)
      );
      if (snapshot.exists()) {
        return snapshot.val() as GroupChat;
      }
      return null;
    } catch (error) {
      console.error("Error getting group chat by ID:", error);
      throw error;
    }
  }

  async createGroupChat(groupChat: GroupChat): Promise<GroupChat> {
    try {
      await set(
        ref(rtdb, `${GroupChatRepository.collectionName}/` + groupChat.id),
        groupChat
      );
      return groupChat;
    } catch (error) {
      console.error("Error creating group chat:", error);
      throw error;
    }
  }

  async updateGroupChat(groupChat: GroupChat): Promise<GroupChat> {
    try {
      const updates: any = {};
      updates[`/${GroupChatRepository.collectionName}/` + groupChat.id] =
        groupChat;
      await update(ref(rtdb), updates);
      return groupChat;
    } catch (error) {
      console.error("Error updating group chat:", error);
      throw error;
    }
  }

  async deleteGroupChat(id: string): Promise<void> {
    try {
      await remove(ref(rtdb, `${GroupChatRepository.collectionName}/` + id));
    } catch (error) {
      console.error("Error deleting group chat:", error);
      throw error;
    }
  }

  async getGroupChatsByMemberId(memberId: string): Promise<GroupChat[]> {
    try {
      const dbRef = ref(rtdb);
      const snapshot = await get(
        child(dbRef, GroupChatRepository.collectionName)
      );
      if (snapshot.exists()) {
        const allGroups = Object.values(
          snapshot.val() as Record<string, GroupChat>
        );
        return allGroups.filter(
          (group) => group.memberIds && group.memberIds.includes(memberId)
        );
      }
      return [];
    } catch (error) {
      console.error("Error getting group chats by member ID:", error);
      throw error;
    }
  }

  subscribeToGroupChats(
    memberId: string,
    callback: (groupChats: GroupChat[]) => void
  ): () => void {
    const dbRef = ref(rtdb, GroupChatRepository.collectionName);

    const onValueChange = (snapshot: any) => {
      if (snapshot.exists()) {
        const allGroups = Object.values(
          snapshot.val() as Record<string, GroupChat>
        );
        const userGroups = allGroups.filter(
          (group) => group.memberIds && group.memberIds.includes(memberId)
        );
        callback(userGroups);
      } else {
        callback([]);
      }
    };

    onValue(dbRef, onValueChange);

    return () => {
      off(dbRef, "value", onValueChange);
    };
  }
}
