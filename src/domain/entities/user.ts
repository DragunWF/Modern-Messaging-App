export default interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  isOnline: boolean;
  friends: string[]; // IDs of friends
  friendRequests: string[]; // IDs of users who sent a friend request
}
