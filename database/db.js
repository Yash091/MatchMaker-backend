import mongoose from "mongoose";

const DB = process.env.MONGO_URI;

export const Connection = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log("Connection to database is made successfully..."))
    .catch((err) => {
      console.log(err);
    });
};
