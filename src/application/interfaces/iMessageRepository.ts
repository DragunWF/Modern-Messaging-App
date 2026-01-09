import type Message from "../../domain/entities/message";

export default interface IMessageRepository {
  getMessageById(id: string): Promise<Message | null>;
  createMessage(message: Message): Promise<Message>;
  updateMessage(message: Message): Promise<Message>;
  deleteMessage(id: string): Promise<void>;
  getMessagesByUserId(userId: string): Promise<Message[]>;
  subscribeToMessages(
    callback: (messages: Message[]) => void
  ): () => void;
}
