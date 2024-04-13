import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import user from "./routes/user.js";
import file from "./routes/codeFile.js";
import CodeFile from "./model/codeFileSchema.js";
import Message from "./model/messageSchema.js";
const clientPort = process.env.CLIENT;

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: clientPort,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DBPort = process.env.MONGO;

const connetctDB = async () => {
  try {
    await mongoose.connect(DBPort);
    console.log("DB Connect");
  } catch (error) {
    console.log("Mongoose error", error);
  }
};

connetctDB();

app.use("/user/api", user);
app.use("/file/api", file);

// socket io code

io.on("connection", (socket) => {
  console.log("A user connected");

  // join file room
  socket.on("joinFile", async (data) => {
    const { fileId, userId } = data;
    try {
      const codeFile = await CodeFile.findById(fileId);
      if (!codeFile) {
        return socket.emit("fileError", { error: "File not found" });
      }
      if (
        !codeFile.ownerId.equals(userId) &&
        !codeFile.collaborators.includes(userId)
      ) {
        codeFile.collaborators.push(userId);
        await codeFile.save();
        socket.join(fileId.toString());
        socket.emit("fileJoined", { fileId });
      }
    } catch (error) {
      console.log("Error joining file");
      socket.emit("fileError", { error: "Internal Server Error" });
    }
  });

  // message code

  socket.on("sendMessage", async (data) => {
    try {
      const { fileId, userId, message } = data;
      const newMessage = new Message({
        sender: userId,
        content: messageContent,
      });

      // Save the message to the database
      const savedMessage = await newMessage.save();

      const updateFile = await CodeFile.findByIdAndUpdate(
        fileId,
        {
          $push: { messages: savedMessage },
        },
        { new: true }
      );
      io.to(fileId).emit("reciveMessage", {
        userId,
        message: savedMessage,
      });
    } catch (error) {
      console.log("Error sending message", error);
    }
  });

  // update content
  socket.on("updateContent", async (data) => {
    try {
      const { fileId, content } = data;
      const updateFile = await CodeFile.findByIdAndUpdate(
        fileId,
        { content },
        { new: true }
      );
      socket.broadcast
        // .to(fileId.toString())
        .emit("updateContentt", updateFile.content);
    } catch (error) {
      console.log("error sending message", error);
    }
  });

  socket.on("cursorPosition", async (data) => {
    try {
      const { fileId, userId, position } = data;

      // Validate that fileId, userId, and position are provided
      if (!fileId || !userId || !position) {
        throw new Error("Invalid cursor position data");
      }

      // Optionally, you can validate the format of position (e.g., position should be an object with 'x' and 'y' properties)

      // Emit the cursor position to all other clients in the same file room
      socket.to(fileId.toString()).emit("cursorPosition", userId, position);

      // Log successful emission of cursor position
      console.log(
        `Cursor position updated for user ${userId} in file ${fileId}`
      );
    } catch (error) {
      // Log any errors that occur during cursor position update
      console.log("Error updating cursor position", error.message);
      // Optionally, you can emit an error event back to the client who emitted the cursorPosition event
      socket.emit("cursorPositionError", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnect");
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () =>
  console.log(`Server is running http://localhost:${port}`)
);
