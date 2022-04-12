import User from "../schema/userSchema.js";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    
    let token = req.cookies.jwtoken;
   
    if (!token) {
      return res.status(200).json("No token found");
    }
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: verify._id,
    });

    if (!rootUser) {
      return res.status(200).json("No user");
    }

    req.rootUser = rootUser;
    req.userId = rootUser._id;
    // console.log(rootUser);
    next();
  } catch (error) {
    return res.status(500).json("Server Error");
  }
};
