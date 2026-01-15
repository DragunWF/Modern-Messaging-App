# Requirements

- [1. Project Overview](#1-project-overview)
- [2. User Stories and Acceptance Criteria](#2-user-stories-and-acceptance-criteria)
  - [2.1 Authentication](#21-authentication)
  - [2.2 User Management & Social Graph](#22-user-management--social-graph)
  - [2.3 Messaging (1-on-1 & Group)](#23-messaging-1-on-1--group)
  - [2.4 Settings & UX](#24-settings--ux)
- [3. Functional Requirements](#3-functional-requirements)
  - [3.1 Authentication & Onboarding](#31-authentication--onboarding)
  - [3.2 User Management & Social Graph](#32-user-management--social-graph)
  - [3.3 Real-Time Messaging (1-on-1)](#33-real-time-messaging-1-on-1)
  - [3.4 Advanced Messaging Features](#34-advanced-messaging-features)
  - [3.5 Group Chat](#35-group-chat)
  - [3.6 Settings & Preferences](#36-settings--preferences)
- [4. Non-Functional Requirements](#4-non-functional-requirements)
  - [4.1 Operational Requirements](#41-operational-requirements)
  - [4.2 Performance Requirements](#42-performance-requirements)
  - [4.3 Security Requirements](#43-security-requirements)
  - [4.4 Cultural and Political Requirements](#44-cultural-and-political-requirements)
- [5. API Specifications](#5-api-specifications)
  - [5.1 Authentication API (Firebase Authentication)](#51-authentication-api-firebase-authentication)
  - [5.2 User Management & Data API (Firebase Firestore)](#52-user-management--data-api-firebase-firestore)
  - [5.3 Messaging API (Firebase Firestore)](#53-messaging-api-firebase-firestore)
  - [5.4 Storage API (Cloudinary)](#54-storage-api-cloudinary)
- [6. Database Scheme](#6-database-scheme)
  - [6.1 Root Nodes Overview](#61-root-nodes-overview)
  - [6.2 Detailed Node Schemas](#62-detailed-node-schemas)
    - [6.2.1 `users` Node](#621-users-node)
    - [6.2.2 `messages` Node](#622-messages-node)
    - [6.2.3 `groupChats` Node](#623-groupchats-node)
    - [6.2.4 `notifications` Node](#624-notifications-node)
    - [6.2.5 `typingStatus` Node](#625-typingstatus-node)
- [7. Technical Constraints](#7-technical-constraints)
- [8. Environment Variable List](#8-environment-variable-list)

## 1. Project Overview

The **Modern Messaging App** is a cross-platform mobile application designed to provide a seamless, real-time communication experience similar to industry leaders like Meta Messenger. Built with **React Native** and **Expo**, it leverages **Firebase** for backend services including authentication, real-time database, and storage. The application prioritizes a modern user interface, secure data handling, and a robust set of messaging features.

## 2. User Stories and Acceptance Criteria

### 2.1 Authentication

| ID         | User Story                                                                               | Acceptance Criteria                                                                                                                                                                                                                                                | Related REQ            |
| :--------- | :--------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------- |
| **US-001** | As a **new user**, I want to **register for an account** so that I can access the app.   | 1. User enters valid email, username, and matching passwords.<br>2. **Password Policy**: Minimum 8 characters, at least 1 number.<br>3. Successful registration redirects to the Home screen.<br>4. Error displayed if email already exists or inputs are invalid. | REQ001, REQ035         |
| **US-002** | As a **registered user**, I want to **log in** so that I can access my chats.            | 1. User enters registered email and password.<br>2. Successful login redirects to Home screen.<br>3. Error displayed for incorrect credentials.<br>4. Session persists after app restart.                                                                          | REQ002, REQ004, REQ035 |
| **US-003** | As a **user**, I want to **log out** so that I can secure my account on a shared device. | 1. "Logout" button is available in Settings.<br>2. Clicking logout returns user to Login screen.<br>3. Local session data is cleared.                                                                                                                              | REQ003                 |

### 2.2 User Management & Social Graph

| ID         | User Story                                                                               | Acceptance Criteria                                                                                                                                                                                                                     | Related REQ            |
| :--------- | :--------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------- |
| **US-004** | As a **user**, I want to **search for friends** so that I can connect with them.         | 1. Search bar on "Discover" screen accepts text input.<br>2. Results display users matching username or email.<br>3. Empty state shown if no users found.                                                                               | REQ006                 |
| **US-005** | As a **user**, I want to **send/manage friend requests** so that I can build my network. | 1. "Add Friend" button sends a request to target user.<br>2. Recipient receives notification of request.<br>3. Recipient can "Accept" or "Reject" via Notifications screen.<br>4. "Accept" adds both users to each other's Friend List. | REQ007, REQ008, REQ009 |
| **US-006** | As a **user**, I want to **manage my friend list** so that I can control who I talk to.  | 1. Friend List displays all connected users.<br>2. Online/Offline status indicator is visible for each friend.<br>3. Option to "Remove Friend" deletes the connection.                                                                  | REQ010, REQ011         |
| **US-007** | As a **user**, I want to **update my profile** so that friends can recognize me.         | 1. User can upload a new profile picture (Max 5MB).<br>2. User can edit display name.<br>3. Changes are reflected immediately to friends.                                                                                               | REQ005                 |

### 2.3 Messaging (1-on-1 & Group)

| ID         | User Story                                                                                        | Acceptance Criteria                                                                                                                                                                        | Related REQ    |
| :--------- | :------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- |
| **US-008** | As a **user**, I want to **send text messages** so that I can communicate instantly.              | 1. Message appears immediately in sender's chat view.<br>2. Message appears in recipient's chat view in real-time.<br>3. Conversation moves to top of Home screen list.                    | REQ012, REQ032 |
| **US-009** | As a **user**, I want to **send media (images/files)** so that I can share content.               | 1. User can select image/file from device gallery.<br>2. **Limits**: Images max 5MB, Videos max 50MB.<br>3. Loading indicator shows during upload.<br>4. Media is viewable in chat bubble. | REQ013         |
| **US-010** | As a **user**, I want to **see message status** so that I know if my message was received.        | 1. Visual indicator for "Sent" (tick) and "Delivered" (double tick).<br>2. "Typing..." indicator appears when other user is typing.                                                        | REQ014, REQ015 |
| **US-011** | As a **user**, I want to **react and reply** to messages so that I can express specific feedback. | 1. Long-press on message opens reaction menu.<br>2. Selected emoji appears attached to message.<br>3. "Reply" option quotes original message in new input.                                 | REQ017, REQ018 |
| **US-012** | As a **user**, I want to **create a group chat** so that I can talk to multiple friends.          | 1. User selects "Create Group" and picks multiple friends.<br>2. Group created with default or user-set name.<br>3. All selected members added immediately.                                | REQ021         |
| **US-013** | As a **group member**, I want to **manage the group** so that we can keep it updated.             | 1. Any member can rename the group.<br>2. Any member can add new friends to the group.<br>3. Any member can remove other members.<br>4. System message posted in chat for these events.    | REQ022         |

### 2.4 Settings & UX

| ID         | User Story                                                                                 | Acceptance Criteria                                                                                                                          | Related REQ    |
| :--------- | :----------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------------- |
| **US-014** | As a **user**, I want to **switch themes** so that I can use the app comfortably at night. | 1. Toggle switch in Settings changes app UI to Dark Mode.<br>2. Preference is saved locally.                                                 | REQ024, REQ037 |
| **US-015** | As a **user**, I want to **handle network loss** so that I don't lose data.                | 1. "No Connection" banner appears when offline.<br>2. Message sending disabled/queued until reconnected.<br>3. Cached chats remain readable. | REQ026, REQ027 |

## 3. Functional Requirements

### 3.1 Authentication & Onboarding

- **REQ001 User Registration**: Users must be able to create a new account using an email address and password.
- **REQ002 User Login**: Users must be able to authenticate into the application using their registered credentials.
- **REQ003 Logout**: Users must be able to securely sign out of their account, clearing local session data.
- **REQ004 Persistent Session**: The application should maintain the user's login state across app restarts until they explicitly log out.

### 3.2 User Management & Social Graph

- **REQ005 Profile Management**: Users must be able to view and edit their profile details (e.g., display name, profile picture).
- **REQ006 User Search**: Users must be able to search for other users by username or email on the "Discover" screen.
- **REQ007 Friend Requests**: Users must be able to send friend requests to other users.
- **REQ008 Friend Request Management**: Users must be able to accept or reject incoming friend requests via the "Notifications" screen.
- **REQ009 Friend List**: Users must be able to view a list of their connected friends.
- **REQ010 Remove Friend**: Users must be able to remove a user from their friend list.
- **REQ011 User Presence**: The system should display the online/offline status of friends.

### 3.3 Real-Time Messaging (1-on-1)

- **REQ012 Send Text Messages**: Users must be able to send and receive text messages in real-time.
- **REQ013 Rich Media Support**: Users must be able to send images, files, and voice messages.
- **REQ014 Message Status**: The system should indicate when messages are sent and delivered.
- **REQ015 Typing Indicators**: Users should see a visual indicator when the other participant is typing.
- **REQ016 Unread Counts**: The application must display the number of unread messages for each chat conversation.

### 3.4 Advanced Messaging Features

- **REQ017 Message Reactions**: Users must be able to react to specific messages with emojis.
- **REQ018 Message Replies**: Users must be able to reply to specific messages, creating a context link.
- **REQ019 Message Forwarding**: Users must be able to forward messages to other chats or groups.
- **REQ020 Copy Text**: Users must be able to copy the content of text messages to the clipboard.

### 3.5 Group Chat

- **REQ021 Create Group**: Users must be able to create a new group chat and select initial members from their friend list.
- **REQ022 Group Management**:
  - **Rename Group**: Users must be able to change the name of the group chat.
  - **Add Members**: Users must be able to add new members to an existing group.
  - **Remove Members**: Any member can add new friends to the group.
- **REQ023 Group Messaging**: All messaging features (text, media, reactions, etc.) must function within a group context for all members.

### 3.6 Settings & Preferences

- **REQ024 Theme Toggling**: Users must be able to switch between Light and Dark visual themes.
- **REQ025 Notifications**: Users should receive in-app notifications for new messages and friend requests.

## 4. Non-Functional Requirements

### 4.1 Operational Requirements

- **REQ026 Offline Grace**: The application should handle network loss gracefully, alerting the user and preventing actions that require connectivity, while allowing navigation of cached content.
- **REQ027 Data Consistency**: Chat history and user data must remain consistent across different logins and devices.
- **REQ028 Platform Fidelity**: The UI should feel native to both iOS and Android platforms using Expo/React Native best practices.
- **REQ029 Feedback**: The system must provide immediate visual feedback for user actions (e.g., button presses, message sending states, loading spinners).
- **REQ030 Clean Architecture**: The codebase must adhere to Clean Architecture principles, separating Domain, Data, and Presentation layers.
- **REQ031 Type Safety**: The code must be written in TypeScript with strict typing to minimize runtime errors.

### 4.2 Performance Requirements

- **REQ032 Real-Time Latency**: Message delivery should occur with minimal latency (< 500ms) under normal network conditions.
- **REQ033 App Launch Time**: The application should load the main interface within 3 seconds on standard mobile devices.
- **REQ034 Smooth Scrolling**: Chat lists and message histories should scroll smoothly (60fps) without stuttering.

### 4.3 Security Requirements

- **REQ035 Authentication Security**: User passwords must be handled securely via Firebase Authentication.
- **REQ036 Data Privacy**: User messages and personal information should be protected and only accessible to authorized participants.

### 4.4 Cultural and Political Requirements

- **REQ037 Accessibility**: The interface should utilize standard font sizes and high-contrast colors (especially in Dark Mode) to ensure readability for users with visual impairments.
- **REQ038 Inclusive Design**: The application should use neutral and inclusive language in all user-facing text and error messages.

## 5. API Specifications

### 5.1 Authentication API (Firebase Authentication)

- **Purpose**: Handles user registration, login, logout, and session management.
- **Services Used**: Firebase Authentication.
- **Key Operations**:
  - `createUserWithEmailAndPassword(email, password)`: Registers a new user.
  - `signInWithEmailAndPassword(email, password)`: Logs in an existing user.
  - `signOut()`: Logs out the current user.
  - `onAuthStateChanged(callback)`: Observes user authentication state changes.

### 5.2 User Management & Data API (Firebase Realtime Database)

- **Purpose**: Manages user profiles, friend lists, friend requests, and presence status.
- **Services Used**: Firebase Realtime Database.
- **Key Nodes/Operations**:
  - **`users` Node**: Stores user profiles (e.g., `id`, `username`, `email`, `profilePictureUrl`, `isOnline`).
    - `set(users/{uid}, userProfile)`: Create/Update user profile.
    - `get(users/{uid})`: Retrieve user profile.
    - `query(users, orderByChild('username'), equalTo('searchterm'))`: Search for users.
  - **`friends` Child Path**: Stored as an array within `users/{uid}/friends`.
  - **`friendRequests` Child Path**: Stored as an array within `users/{uid}/friendRequests` (incoming).
  - **`outgoingFriendRequests` Child Path**: Stored as an array within `users/{uid}/outgoingFriendRequests`.

### 5.3 Messaging API (Firebase Realtime Database)

- **Purpose**: Handles real-time 1-on-1 and group messaging, message status, reactions, and typing indicators.
- **Services Used**: Firebase Realtime Database with real-time listeners.
- **Key Nodes/Operations**:
  - **`messages` Node**: Stores a flat list of all messages.
    - `set(messages/{messageId}, message)`: Send new message.
    - `query(messages, orderByChild('senderId'), equalTo(userId))`: Fetch messages by sender (less efficient for chats).
    - `query(messages, orderByChild('receiverId'), equalTo(chatId/userId))`: Fetch messages by receiver (less efficient for chats).
  - **`groupChats` Node**: Stores metadata for group chat conversations.
    - `set(groupChats/{groupId}, groupChatData)`: Create/Update group chat.
    - `query(groupChats, orderByChild('memberIds'), arrayContains(userId))`: Find group chats a user is in.
  - **`typingStatus` Node**: Stores temporary typing status.
    - `set(typingStatus/{chatId}/{userId}, true)`: Set typing status.
    - `remove(typingStatus/{chatId}/{userId})`: Clear typing status.
    - `onValue(typingStatus/{chatId})`: Observe typing status updates.

### 5.4 Storage API (Cloudinary)

- **Purpose**: Stores and serves rich media files (images, videos, raw files) sent in chats.
- **Services Used**: Cloudinary (third-party cloud media management service).
- **Key Operations**:
  - `upload(file, upload_preset)`: Uploads a file (image, video) to Cloudinary.
  - Returns a secure URL for the uploaded asset, which is then stored in Realtime Database as part of the message content.
  - Uses environment variables for configuration (`EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`, `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET`).

## 6. Database Scheme

The application uses **Firebase Realtime Database (RTDB)** exclusively. Data is structured as a JSON tree with the following root nodes.

### 6.1 Root Nodes Overview

- **`users`**: Stores user profiles, including friend lists and friend requests.
- **`messages`**: Stores a flat list of all messages (both 1-on-1 and group).
- **`groupChats`**: Stores metadata for group chat conversations.
- **`notifications`**: Stores user-specific notifications.
- **`typingStatus`**: Stores ephemeral typing indicators.

_Note: The codebase does not currently utilize a `userChatData` node, although it may be visible in the database console if created manually or by previous versions._

### 6.2 Detailed Node Schemas

#### 6.2.1 `users` Node

- **Path**: `users/{userId}`
- **Fields**:
  - `id`: `string` (User ID)
  - `username`: `string`
  - `email`: `string`
  - `isOnline`: `boolean`
  - `friends`: `string[]` (Array of friend User IDs)
  - `friendRequests`: `string[]` (Array of incoming friend request User IDs)
  - `outgoingFriendRequests`: `string[]` (Array of outgoing friend request User IDs)
  - `lastReadTimestamps`: `Record<string, number>` (Map of chatId to timestamp)

#### 6.2.2 `messages` Node

- **Path**: `messages/{messageId}`
- **Description**: A flat list of all messages.
- **Fields**:
  - `id`: `string`
  - `senderId`: `string`
  - `receiverId`: `string` (User ID for 1-on-1, Group ID for groups)
  - `content`: `string`
  - `timestamp`: `number`
  - `reactions`: `Record<string, string[]>`
  - `replyTo`: `object` (Optional reply context)
  - `imageUrl`, `fileUrl`, `voiceMessageUrl`: `string` (Optional)

#### 6.2.3 `groupChats` Node

- **Path**: `groupChats/{groupChatId}`
- **Fields**:
  - `id`: `string`
  - `name`: `string`
  - `memberIds`: `string[]` (Array of User IDs in the group)

#### 6.2.4 `notifications` Node

- **Path**: `notifications/{recipientUserId}/{notificationId}`
- **Fields**:
  - `id`: `string`
  - `recipientId`: `string`
  - `senderId`: `string`
  - `type`: `string` (`'FRIEND_REQUEST'`, `'FRIEND_REQUEST_ACCEPTED'`)
  - `isRead`: `boolean`
  - `createdAt`: `number`
  - `data`: `object`

#### 6.2.5 `typingStatus` Node

- **Path**: `typingStatus/{chatId}/{userId}`
- **Value**: `boolean` (true if typing)

## 7. Technical Constraints

- **TC-001 Framework**: Must be built using React Native with Expo Managed Workflow.
- **TC-002 Backend**: Must use Firebase for Authentication, Realtime Database, and Storage.
- **TC-003 Language**: Primary development language is TypeScript.

## 8. Environment Variable List

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_DATABASE_URL=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```
