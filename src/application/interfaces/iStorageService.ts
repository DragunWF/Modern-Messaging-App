export interface IStorageService {
  uploadImage(uri: string, path: string): Promise<string>;
}
