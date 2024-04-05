import CodeFile from "../model/codeFileSchema.js";
import User from "../model/userSChema.js";

const createFile = async (req, res) => {
  const { filename, content, ownerId, fileType } = req.body;
  if (!filename || !fileType || !ownerId) {
    res.status(400).json({ success: false, msg: "Invalid Credentials" });
    return;
  }

  try {
    // i want to check that if file name is not exists in one user files
    const ownerUserFiles = await CodeFile.find({ ownerId });
    if (ownerUserFiles.filter((elm) => elm.filename == filename).length) {
      res.status(400).json({ success: false, msg: "File Name Already Exits" });
      return;
    }
    const newFile = new CodeFile({
      filename,
      fileType,
      content,
      ownerId,
    });
    const saveFile = await newFile.save();

    res
      .status(201)
      .json({ success: true, msg: "File Created", body: saveFile });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const allFiles = await CodeFile.find().populate("ownerId collaborators");
    if (!allFiles.length) {
      return res.status(400).json({ success: false, msg: "No Files Found" });
    }
    res.status(200).json({ success: true, msg: "files", body: allFiles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

const userFiles = async (req, res) => {
  const { userId } = req.params;
  try {
    const ownerUserFiles = await CodeFile.find({ ownerId: userId }).populate(
      "ownerId collaborators"
    );
    if (!ownerUserFiles.length) {
      res.status(400).json({ success: false, msg: "No files" });
      return;
    }
    res.status(200).json({ success: true, msg: "files", body: ownerUserFiles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

const oneFile = async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await CodeFile.findById(fileId).populate(
      "ownerId collaborators"
    );
    if (!file) {
      res.status(400).json({ success: false, msg: "No file Found" });
      return;
    }
    res.status(200).json({ success: true, msg: "files", body: file });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

const updateFile = async (req, res) => {
  const { fileId } = req.params;
  const body = req.body;
  try {
    const fileUpdate = await CodeFile.findByIdAndUpdate(fileId, body, {
      new: true,
      runValidators: true,
    }).populate("ownerId collaborators");
    if (!fileUpdate) {
      return res
        .status(400)
        .json({ success: false, msg: "File is not update" });
    }
    return res
      .status(201)
      .json({ success: true, msg: "File updated", body: fileUpdate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

const deleteFile = async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await CodeFile.findByIdAndDelete(fileId);
    res.status(200).json({ success: true, msg: "file Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export { createFile, getAllFiles, userFiles, oneFile, updateFile, deleteFile };
