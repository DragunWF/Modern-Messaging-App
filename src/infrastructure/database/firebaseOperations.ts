import { ref, set, get, update, remove, push, child } from "firebase/database";
import { rtdb } from "./firebaseConfig";

// Generic CRUD Operations

/**
 * Writes data to a specific path. Replaces any existing data at that path.
 * @param path The path in the database.
 * @param data The data to write.
 */
export const writeData = async <T>(path: string, data: T): Promise<void> => {
  const dbRef = ref(rtdb, path);
  await set(dbRef, data);
};

/**
 * Pushes a new item to a list at the specified path.
 * @param path The path to the list.
 * @param data The data to push.
 * @returns The unique key of the new item.
 */
export const pushData = async <T>(
  path: string,
  data: T
): Promise<string | null> => {
  const listRef = ref(rtdb, path);
  const newRef = push(listRef);
  await set(newRef, data);
  return newRef.key;
};

/**
 * Reads data from a specific path once.
 * @param path The path to read from.
 * @returns The data at the path, or null if not found.
 */
export const readData = async <T>(path: string): Promise<T | null> => {
  const dbRef = ref(rtdb);
  const snapshot = await get(child(dbRef, path));
  if (snapshot.exists()) {
    return snapshot.val() as T;
  } else {
    return null;
  }
};

/**
 * Updates specific fields at a path without overwriting the entire node.
 * @param path The path to update.
 * @param updates An object containing the fields to update.
 */
export const updateData = async (
  path: string,
  updates: object
): Promise<void> => {
  const dbRef = ref(rtdb, path);
  await update(dbRef, updates);
};

/**
 * Deletes data at a specific path.
 * @param path The path to delete.
 */
export const deleteData = async (path: string): Promise<void> => {
  const dbRef = ref(rtdb, path);
  await remove(dbRef);
};
