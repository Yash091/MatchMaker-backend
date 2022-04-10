import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  mothertongue: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  likedby: [{
    type: Object
  }],
  liked: [{
    type: Object
  }],
  notifications: [{
    type: Object
  }],
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }, ],

});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.cpassword, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({
        _id: this._id
      },
      "mynameisyashchaurasiahereismysecretkey"
    );
    this.tokens[0] = {
      token: token
    };
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const User = new mongoose.model("User", userSchema);

export default User;