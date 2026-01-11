import { IStorageService } from "../../application/interfaces/iStorageService";

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export class StorageService implements IStorageService {
  /**
   * Uploads a file to Cloudinary and returns the secure URL.
   * @param uri The local URI of the file.
   * @param path Not used for Cloudinary unsigned uploads (Cloudinary assigns ID, or uses folder in preset).
   * @param resourceType 'image' | 'video' | 'raw' | 'auto' - Defaults to 'image'.
   */
  async uploadImage(
    uri: string,
    path: string,
    resourceType: "image" | "video" | "raw" | "auto" = "image"
  ): Promise<string> {
    try {
      const data = new FormData();

      // Extract extension from URI
      const uriParts = uri.split(".");
      const extension =
        uriParts.length > 1 ? uriParts[uriParts.length - 1] : "";

      // Determine mime type based on resourceType (basic fallback)
      let type = "image/jpeg";
      let name = extension ? `upload.${extension}` : "upload.jpg";

      if (resourceType === "video") {
        type = "video/mp4";
        name = extension ? `upload.${extension}` : "upload.mp4";
      } else if (resourceType === "raw" || resourceType === "auto") {
        type = "application/octet-stream"; // Generic binary
        name = extension ? `upload.${extension}` : "upload.bin";
      }

      // Append the file
      // @ts-ignore - React Native's FormData expects this specific shape for files
      data.append("file", {
        uri: uri,
        type: type,
        name: name,
      });

      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
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
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  }
}
