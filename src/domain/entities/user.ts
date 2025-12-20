export default interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  isOnline: boolean;
  friends: number[]; // IDs of friends
}
