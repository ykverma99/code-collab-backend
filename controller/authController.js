import bcrypt from "bcrypt";
import User from "../model/userSChema.js";
import jwt from "jsonwebtoken";

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ success: false, msg: "Please fill all the fields" });
    return;
  }
  if (password.length < 6) {
    res
      .status(400)
      .json({ success: false, msg: "password must be greator then 6" });
    return;
  }
  try {
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      res.status(401).json({ success: false, msg: "Email is Alerady exist" });
      return;
    }
    const encodePassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: encodePassword,
    });

    const saveUser = await newUser.save();
    const jwtToken = jwt.sign({ email: newUser.email }, process.env.JWT, {
      expiresIn: "1d",
    });

    if (saveUser._doc && saveUser._doc.password) {
      // Destructure the saveUser object, excluding the password field
      const { password, ...savedUserWithoutPassword } = saveUser._doc;

      res.status(201).json({
        success: true,
        msg: "User Created",
        body: { ...savedUserWithoutPassword, token: jwtToken },
      });
    } else {
      res
        .status(500)
        .json({ success: false, msg: "Password field not found in user data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, msg: "Invalid Credentials" });
    return;
  }
  try {
    const existingUser = await User.findOne({ email: email });
    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      res.status(400).json({ success: false, msg: "Invalid Credentials" });
      return;
    }
    const token = jwt.sign({ email: existingUser.email }, process.env.JWT, {
      expiresIn: "1d",
    });
    if (existingUser._doc && existingUser._doc.password) {
      const { password, ...user } = existingUser._doc;
      res
        .status(200)
        .json({ success: true, msg: "User Login", body: { ...user, token } });
    } else {
      res.status(400).json({
        success: false,
        msg: "Password field not found in user data",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export { signupUser, loginUser };
