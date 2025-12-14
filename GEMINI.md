# Gemini Agent Instructions

This document provides instructions for the Gemini agent to follow when working on this project.

## 1. Project Overview

This project is a modern, cross-platform messaging application built with React Native, Expo, and Firebase. The goal is to create an application similar to Meta Messenger, with real-time communication and a modern user interface.

## 2. Architecture

The project follows the **Clean Architecture** principles as described by Robert C. Martin. The source code is organized into four main layers within the `src/` directory:

- `domain`: This is the core of the application. It contains the business logic and entities. It has no dependencies on any other layer.
  - `entities`: Application-agnostic business objects.
  - `interfaces`: Abstract repositories or services.
- `application`: This layer contains application-specific business rules and use cases. It orchestrates the flow of data from the `domain` to the `presentation` layer.
- `infrastructure`: This layer handles external concerns like databases, network requests, and other I/O. It implements the interfaces defined in the `domain`.
- `presentation`: This layer is responsible for the UI. It includes screens, components, and navigation.

**Important:** When adding new code or modifying existing code, you must adhere to this architecture. Do not create dependencies that violate the Clean Architecture principles (e.g., the `domain` layer must not depend on the `presentation` layer).

## 3. Tech Stack & Conventions

- **Framework:** React Native with Expo.
- **Language:** TypeScript. All new code should be written in TypeScript and be strongly typed.
- **Styling:** UI styling should be consistent with the existing application style. Use the predefined colors from `src/shared/constants/colors.ts`. Create reusable style objects using `StyleSheet.create`.
- **Navigation:** The app uses `@react-navigation`. When adding new screens, integrate them into the existing navigation structure in `src/presentation/components/navigation/`.
- **Dependencies:** Do not add new dependencies using `npm install` without asking for permission first. This project uses `npm`, not `yarn`.

## 4. Development Workflow

- **Build and Run:** Do not attempt to execute build or run commands like `expo start`, `npm run ios`, or `npm run android`. The user will handle running the application and verifying changes on a simulator or device.
- **Testing:** If you are asked to write tests, use Jest and React Native Testing Library. Test files should be located alongside the files they are testing, using a `.test.ts` or `.test.tsx` extension.

## 5. Git Operations

- **Git Commands:** Do not execute any git commands (e.g., `git status`, `git add`, `git commit`). The user will handle all git operations.
