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
      return res.status(200).json({message:"Please fill the fields properly"});
    const exist = await User.findOne({
      email: email
    });
    if (exist) return res.status(200).json({message:"Email already exists!"});
    if (password !== cpassword)
      return res
        .status(200)
        .json({message:"password and confirm password doesn't match!"});
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
    return res.status(200).json({message:"Registration successfull"});
  } catch (err) {
    return res.status(500).json({message:"Server error", err});
  }
};

export const logUser = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    // console.log(password);
    if (!email || !password) return res.status(422).json({mesage:"Invalid credentials"});
    const user = await User.findOne({
      email: email
    });
    if (!user) return res.status(422).json({mesage:"Invalid credentials"});
    const token = await user.generateAuthToken();

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
      // secure: true,
      // sameSite: "none",
    });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(422).json({mesage:"Invalid credentials"});
    return res.status(200).json({
      message: "User logged in successfully",
      user
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const data = await User.findById(req.userId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({message: "Server error"});
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.userId;
    const data = await User.deleteOne({
      _id: id
    });
    res.clearCookie("jwtoken");
    return res.status(200).json({message : "User deleted Successfully..."});
  } catch (err) {
    return res.status(500).json({message: "server error"});
  }
};

export const editUser = async (req, res) => {
  try {
    const id = req.body._id;
    const updatedUser = await User.findByIdAndUpdate({
      _id: id
    }, {
      $set: req.body
    }, {
      new: true
    });

    return res.status(200).json({
      message: "User Updated",
      updatedUser
    });
  } catch (error) {
    return res.status(500).json({message: "server error"});
  }
}

export const getAllUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.find({
      _id: {
        $ne: id
      }
    });
    // console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({message : "server error"});
  }
}

export const allUsers = async (req, res) => {
  try {
    const data = await User.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({message: "server error"});
  }
}

export const getDetail = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({message: "Server error"});
  }
}

export const updateLike = async (req, res) => {
  try {
    const likedby = req.body.likedby; // currUser
    const liked = req.body.liked; // Whom currUser has liked
    let user1 = await User.findById({
      _id: likedby
    });
    let user2 = await User.findById({
      _id: liked
    });
    // console.log(user1 , user2);
    const obj1 = {
      _id: likedby,
      name: user1.name,
      picture: user1.picture,
      profession: user1.profession
    };
    const obj2 = {
      _id: liked,
      name: user2.name,
      picture: user2.picture,
      profession: user2.profession
    }
    // data.liked.push({id:liked});
    // await User.save();
    const data = await User.findByIdAndUpdate({
      _id: likedby
    }, {
      $push: {
        liked: {
          _id: liked,
          name: user2.name,
          picture: user2.picture,
          profession: user2.profession
        },
      }
    }, {
      new: true
    });
    const data1 = await User.findByIdAndUpdate(
      {
        _id: liked,
      },
      {
        $push: {
          likedby: {
            _id: likedby,
            name: user1.name,
            picture: user1.picture,
            profession: user1.profession,
          },
        },
        $addToSet: {
          notifications: {
            _id: likedby,
            type: 1,
            message: `${user1.name} has liked your profile`,
            picture: user1.picture,
          },
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({message: "Server error"});
  }
}

export const updateDislike = async (req, res) => {
  try {
    // console.log("before");
    const dislikedby = req.body.dislikedby; // currUser
    const disliked = req.body.disliked; // Whim currUser has liked
    let user1 = await User.findById({
      _id: dislikedby
    });
    let user2 = await User.findById({
      _id: disliked
    });
    // console.log(user1 , user2);
    const obj1 = {
      _id: dislikedby,
      name: user1.name,
      picture: user1.picture,
      profession: user1.profession
    };
    const obj2 = {
      _id: disliked,
      name: user2.name,
      picture: user2.picture,
      profession: user2.profession
    }
    // data.liked.push({id:liked});
    // await User.save();
    const data = await User.findByIdAndUpdate({
      _id: dislikedby
    }, {
      $pull: {
        liked: {
          _id: disliked,
          name: user2.name,
          picture: user2.picture,
          profession: user2.profession
        }
      }
    }, {
      new: true
    });
    const data1 = await User.findByIdAndUpdate({
      _id: disliked
    }, {
      $pull: {
        likedby: {
          _id: dislikedby,
          name: user1.name,
          picture: user1.picture,
          profession: user1.profession
        },
        notifications: {
          _id: dislikedby,
          type: 1,
          message: `${user1.name} has liked your profile`,
          picture: user1.picture,
        },
      }
    }, {
      new: true
    });
    // console.log(data);
    // console.log(data1);
    // console.log("after");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({message: "Server error"});
  }
}


export const removeNotification=async(req,res)=>{
  try {
    const id = req.body.id;
    const obj = req.body.obj;
    const data = await User.findByIdAndUpdate({_id:id},{
      $pull:{
        notifications: {
          _id:obj._id,
          type:obj.type,
          message:obj.message,
          picture:obj.picture,
        }
      }
    },
    {new:true});
    // console.log(id , obj);
    // const data = req.body;
    return res.status(200).json(data);
  } catch (error) {
      res.status(500).json({message:"Server error",error})
  }
}

export const clearNotification=async(req,res)=>{
  try {
    const id = req.body.id;
    // console.log(id);
    const data = await User.findByIdAndUpdate({_id:id},{
      $set:{
        'notifications':[]
      }
    })
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message:"Server error",error})
  }
}

export const logoutUser = async(req,res)=>{
  try {
    req.rootUser.tokens = [];
    res.clearCookie("jwtoken");
    await req.rootUser.save();
    res.status(200).json(req.rootUser)
  } catch (error) {
    res.status(500).json({message:"server error",error});
  }
}

export const saveNotification = async (req , res) => {
  try {
    // console.log(req.body);
    const id1 = req.body.receiverId;
    const id2 = req.body.senderId;
    const pic = req.body.picture;
    
    const name = req.body.name;
    const data = await User.findByIdAndUpdate({_id:id1} , {
      $addToSet: {
        notifications: {
          _id: id2,
          type: 2,
          message: `${name} has liked your profile`,
          picture: pic,
        },
      },
    }, {new: true});
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({message:"server error",error});
  }
}