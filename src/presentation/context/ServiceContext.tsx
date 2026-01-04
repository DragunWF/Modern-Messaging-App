import React, { createContext, useContext, ReactNode } from "react";
import { UserUseCases } from "../../application/useCases/userUseCases";
import { ChatUseCases } from "../../application/useCases/chatUseCases";
import { FirebaseAuthService } from "../../infrastructure/auth/authService";
import UserRepository from "../../infrastructure/repositories/userRepository";
import NotificationRepository from "../../infrastructure/repositories/notificationRepository";
import MessageRepository from "../../infrastructure/repositories/messageRepository";
import GroupChatRepository from "../../infrastructure/repositories/groupChatRepository";

interface ServiceContextType {
  userUseCases: UserUseCases;
  chatUseCases: ChatUseCases;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  // Instantiate Infrastructure
  const authService = new FirebaseAuthService();
  const userRepository = new UserRepository();
  const notificationRepository = new NotificationRepository();
  const messageRepository = new MessageRepository();
  const groupChatRepository = new GroupChatRepository();

  // Instantiate Application Use Cases
  const userUseCases = new UserUseCases(
    authService,
    userRepository,
    notificationRepository
  );
  
  const chatUseCases = new ChatUseCases(
    messageRepository,
    groupChatRepository
  );

  return (
    <ServiceContext.Provider value={{ userUseCases, chatUseCases }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useService must be used within a ServiceProvider");
  }
  return context;
};
