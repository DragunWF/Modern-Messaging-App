export default interface GroupChat {
  id: string;
  name: string;
  // Belongs to the ID of the user entity
  memberIds: string[];
}
