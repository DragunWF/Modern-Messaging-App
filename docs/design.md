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
      - **Use Cases**: Classes that encapsulate specific business actions (e.g., `SendMessageUseCase`, `LoginUserUseCase`). They interact with the Domain interfaces.
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
      - **Navigation**: configuration for app routing (e.g., `AppNavigator`).
      - **State Management**: Contexts or stores (e.g., `AuthContext`) that hold UI state and call Use Cases.

### 2.2 Dependency Rule

Dependencies always point **inwards**.

- **Presentation** depends on **Application**.
- **Infrastructure** depends on **Application** and **Domain** (implementation).
- **Application** depends on **Domain**.
- **Domain** depends on **Nothing**.

This structure allows us to swap out the UI (React Native) or the Database (Firebase) with minimal impact on the core business logic.
