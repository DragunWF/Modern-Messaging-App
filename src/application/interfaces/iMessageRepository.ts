import type Message from "../../domain/entities/message";

export default interface IMessageRepository {
  getMessageById(id: number): Promise<Message | null>;
  createMessage(message: Message): Promise<Message>;
  updateMessage(message: Message): Promise<Message>;
  deleteMessage(id: number): Promise<void>;
  getMessagesByUserId(userId: number): Promise<Message[]>;
}
