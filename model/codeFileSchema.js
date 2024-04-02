import mongoose from "mongoose";

const codeFileSchema = new mongoose.Schema(
  {
    filename: { type: String },
    fileType: { type: String },
    content: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const CodeFile = mongoose.model("CodeFile", codeFileSchema);
export default CodeFile;
