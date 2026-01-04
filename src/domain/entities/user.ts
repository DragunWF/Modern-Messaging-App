export default interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  isOnline: boolean;
  friends: string[]; // IDs of friends
  friendRequests: string[]; // IDs of users who sent a friend request TO this user (incoming)
  outgoingFriendRequests: string[]; // IDs of users this user HAS SENT a friend request TO (outgoing)
}
