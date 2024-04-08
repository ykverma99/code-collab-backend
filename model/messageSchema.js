import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: { type: String },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
