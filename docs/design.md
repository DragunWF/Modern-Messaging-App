# Design Documentation

## 1. Wireframes and UI Mockups

_To be added._

## 2. Component Architecture

The **Modern Messaging App** strictly adheres to **Robert C. Martin's Clean Architecture** principles. This ensures a separation of concerns, making the system more maintainable, testable, and independent of external frameworks or UI libraries.

![Clean Architecture Diagram](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)

### 2.1 Architectural Layers

The codebase is organized into four concentric layers, moving from the inner core (Domain) to the outer edge (Presentation & Infrastructure):

1.  **Domain Layer (`src/domain/`)**:

    - **Role**: The core of the application containing enterprise-wide business rules. It has **no dependencies** on other layers.
    - **Components**:
      - **Entities**: Plain TypeScript objects/interfaces representing business concepts (e.g., `User`, `Message`, `GroupChat`).
      - **Interfaces**: Abstract definitions for repositories and services (e.g., `IMessageRepository`).

2.  **Application Layer (`src/application/`)**:

    - **Role**: Contains application-specific business rules. It orchestrates the flow of data to and from the Domain entities.
    - **Components**:
      - **Use Cases**: Classes that encapsulate specific business actions. They interact with the Domain interfaces.
      - **Interfaces**: Additional interfaces required for application logic.

3.  **Infrastructure Layer (`src/infrastructure/`)**:

    - **Role**: Implements the interfaces defined in the Domain and Application layers. It handles details like databases, network requests, and device storage.
    - **Components**:
      - **Repositories**: Concrete implementations of Domain repositories (e.g., `MessageRepository` using Firebase Realtime Database).
      - **Services**: Implementations of external services (e.g., `AuthService` using Firebase Auth, `StorageService` using Cloudinary).
      - **Config**: Configuration files (e.g., Firebase initialization).

4.  **Presentation Layer (`src/presentation/`)**:
    - **Role**: Responsible for the User Interface and User Experience. It depends on the Application layer to execute actions.
    - **Components**:
      - **Screens**: React Native components representing full views (e.g., `ChatScreen`, `LoginScreen`).
      - **Components**: Reusable UI elements (e.g., `MessageBubble`, `Button`).
      - **Navigation**: configuration for app routing (e.g., `HomeNavigator`).
      - **State Management**: Contexts or stores (e.g., `AuthContext`) that hold UI state and call Use Cases.

### 2.2 Dependency Rule

Dependencies always point **inwards**.

- **Presentation** depends on **Application**.
- **Infrastructure** depends on **Application** and **Domain** (implementation).
- **Application** depends on **Domain**.
- **Domain** depends on **Nothing**.

This structure allows us to swap out the UI (React Native) or the Database (Firebase) with minimal impact on the core business logic.

## 3. State Management Strategy

The application utilizes a combination of **React Context API** for global state and dependency injection, and **React Local State** (`useState`, `useReducer`) for component-specific logic. This approach avoids the complexity of external state management libraries (like Redux) while keeping the architecture clean.

### 3.1 Global State (Context API)

- **`ServiceContext` (`src/presentation/context/ServiceContext.tsx`)**:

  - **Role**: Acts as a **Dependency Injection Container**. It instantiates all Infrastructure services (Repositories, Auth, Storage) and injects them into Application Use Cases.
  - **Usage**: UI components consume this context to access Use Cases (e.g., `chatUseCases.sendMessage()`), ensuring they never interact directly with Repositories.

- **`AuthContext` (`src/presentation/context/AuthContext.tsx`)**:

  - **Role**: Manages the global authentication state (`user` object, `isAuthenticated` flag, `isLoading` status).
  - **Logic**: Listens to Firebase Auth state changes via `onAuthStateChanged`, fetches the full user profile from the database using `UserUseCases`, and persists the session using `AsyncStorage`.

- **`ThemeContext` (`src/presentation/context/ThemeContext.tsx`)**:
  - **Role**: Manages the visual theme (Light/Dark mode) and provides a color palette to all UI components.

### 3.2 Local UI State

Ephemeral state that does not need to be shared across the application is managed locally within components.

- **Examples**: Form inputs (email/password), loading indicators for specific actions, toggle states (modals visible/hidden), and local data fetching (e.g., list of messages in `ChatScreen`).

## 4. Real-Time Data Flow

The application leverages the real-time capabilities of Firebase Realtime Database (RTDB) using an **Observer Pattern** that spans across the architectural layers. This ensures the UI updates instantly when data changes on the server.

### 4.1 Subscription Flow

1.  **UI Component Subscribes**:

    - A component (e.g., `ChatScreen`) initiates a subscription by calling a method on a Use Case (e.g., `chatUseCases.subscribeToMessages()`).
    - It passes a callback function `(messages) => void` to handle the data updates.

2.  **Use Case Delegates**:

    - The Use Case validates the request and delegates the subscription to the appropriate Repository (e.g., `messageRepository.subscribeToMessages()`).

3.  **Repository Listeners**:

    - The Repository sets up an active listener using the Firebase SDK (`onValue` or `onChildAdded`).
    - **Example**: `onValue(ref(rtdb, 'messages'), snapshot => ...)`
    - This listener remains active as long as the component is mounted.

4.  **Data Propagation**:
    - When data changes in Firebase (e.g., a new message arrives), the `onValue` callback fires in the Repository.
    - The Repository transforms the raw Firebase snapshot into a clean Domain Entity (e.g., `Message`).
    - The Entity is passed up to the Use Case, which may perform additional logic (sorting, filtering).
    - Finally, the Use Case executes the UI callback, updating the component's local state (`setMessages(...)`).

### 4.2 Key Real-Time Features

- **Chat Messages**: `ChatScreen` subscribes to message lists for real-time conversation updates.
- **Typing Indicators**: `ChatScreen` subscribes to the `typingStatus` node to show "User is typing..." animations.
- **Friend Status**: `AuthContext` or Home screens subscribe to user status updates (Online/Offline).
- **Group Updates**: Group metadata (name changes, member additions) is synced in real-time via `GroupChatRepository`.
