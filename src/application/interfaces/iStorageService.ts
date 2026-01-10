export interface IStorageService {
  /**
   * Uploads a file to storage.
   * @param uri Local URI of the file.
   * @param path Path or filename (used for organizing, optional depending on provider).
   * @param resourceType Cloudinary resource type: 'image' | 'video' | 'raw' | 'auto'. Defaults to 'image'.
   */
  uploadImage(
    uri: string,
    path: string,
    resourceType?: "image" | "video" | "raw" | "auto"
  ): Promise<string>;
}
