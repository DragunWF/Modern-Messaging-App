import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  getAuth, // Import getAuth to get the current user
} from "firebase/auth";
import { auth } from "../database/firebaseConfig"; // Corrected import path
import { IAuthService } from "../../application/interfaces/iAuthService";

export class FirebaseAuthService implements IAuthService {
  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async register(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  async logout(): Promise<void> {
    return await firebaseSignOut(auth);
  }

  getCurrentUserId(): string | null {
    // getAuth() might be needed if 'auth' is not always live updated
    // but typically the 'auth' object exported from firebase.ts is reactive
    return auth.currentUser ? auth.currentUser.uid : null;
  }
}
