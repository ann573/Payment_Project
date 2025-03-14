interface IMessage {
  receiverId: string;
  senderId: string;
  text: string;
  image: string | null;
  createdAt: string;
  _id: string;
}
export default IMessage;
