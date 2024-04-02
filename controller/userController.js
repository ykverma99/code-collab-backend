import User from "../model/userSChema.js";
import bcrypt from "bcrypt";

const findAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length) {
      return res
        .status(200)
        .json({ success: true, msg: "all users", body: users });
    } else {
      return res.status(400).json({ success: false, msg: "No users Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

const findOneUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user) {
      return res
        .status(200)
        .json({ success: true, msg: "User found", body: user });
    } else {
      return res.status(400).json({ success: false, msg: "No User found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

const updateOne = async (req, res) => {
  const { userId } = req.params;
  const body = req.body;
  try {
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    const userUpdate = await User.findByIdAndUpdate(userId, body, {
      new: true,
    });
    if (!userUpdate) {
      return res
        .status(400)
        .json({ success: false, msg: "User is not update" });
    }
    return res
      .status(201)
      .json({ success: true, msg: "User updated", body: userUpdate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

const deleteOne = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, msg: "User Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export { findAllUsers, findOneUser, updateOne, deleteOne };
