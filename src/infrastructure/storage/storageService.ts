import { IStorageService } from "../../application/interfaces/iStorageService";

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export class StorageService implements IStorageService {
  /**
   * Uploads an image to Cloudinary and returns the secure URL.
   * @param uri The local URI of the image (e.g., from ImagePicker).
   * @param path Not used for Cloudinary unsigned uploads (Cloudinary assigns ID, or uses folder in preset).
   */
  async uploadImage(uri: string, path: string): Promise<string> {
    try {
      const data = new FormData();

      // Append the file
      // @ts-ignore - React Native's FormData expects this specific shape for files
      data.append("file", {
        uri: uri,
        type: "image/jpeg", // or "image/png", usually inferred or generic works
        name: "upload.jpg",
      });

      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

      // Optional: Add folder parameter if you want to organize in Cloudinary
      // data.append("folder", "chat_images");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await response.json();

      if (result.secure_url) {
        return result.secure_url;
      } else {
        console.error("Cloudinary Error:", result);
        throw new Error(
          result.error?.message || "Failed to upload to Cloudinary"
        );
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  }
}
