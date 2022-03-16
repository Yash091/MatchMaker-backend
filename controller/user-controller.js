import User from "../schema/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      cpassword,
      dob,
      picture,
      address,
      profession,
      description,
      mothertongue,
      religion,
      gender,
      mobile,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !cpassword ||
      !dob ||
      !address ||
      !profession ||
      !picture ||
      !description ||
      !mothertongue ||
      !religion ||
      !gender ||
      !mobile
    )
      return res.status(200).json("Please fill the fields properly");
    const exist = await User.findOne({ email: email });
    if (exist) return res.status(200).json("Email already exists!");
    if (password !== cpassword)
      return res
        .status(200)
        .json("password and confirm password doesn't match!");
    const userdoc = await new User({
      name,
      email,
      password,
      cpassword,
      dob,
      picture,
      address,
      profession,
      description,
      mothertongue,
      religion,
      gender,
      mobile,
    });
   
    await userdoc.save();
    return res.status(200).json("Registration successfull");
  } catch (err) {
    return res.status(500).json("Server error", err);
  }
};

export const logUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(password);
    if (!email || !password) return res.status(422).json("Invalid credentials");
    const user = await User.findOne({ email: email });
    if (!user) return res.status(422).json("Invalid credentials");
    const token = await user.generateAuthToken();

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      // httpOnly: true,
      // secure: true,
      // sameSite: "none",
    });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(422).json("Invalid credentials");
    return res.status(200).json({ message: "User logged in successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getUser = async (req, res) => {
  try {
    return res.status(200).json(req.rootUser);
  } catch (error) {
    return res.status(500).json("Server error");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.userId;
    const data = await User.deleteOne({ _id: id });
    res.clearCookie("jwtoken");
    return res.status(200).json("User deleted Successfully...");
  } catch (err) {
    return res.status(500).json("server error");
  }
};

export const editUser = async (req , res) => {
  try {
    const id = req.body._id;
    const updatedUser = await User.findByIdAndUpdate({_id: id} , {$set: req.body});
    return res.status(200).json("User Updated");
  } catch (error) {
    return res.status(500).json("server error");
  }
}

export const getAllUser = async (req , res) => {
  try {
    const data = await User.find();
    // console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("server error");
  }
}

export const getDetail=async(req,res)=>{
  try {
   
    const data = await User.findById(req.params.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Server error");
  }
}