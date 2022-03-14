import mongoose from "mongoose";

const DB =
  "mongodb+srv://yash091:8542955586@cluster0.sedvy.mongodb.net/Matrimony?retryWrites=true&w=majority";
export const Connection = () => {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log("Connection to database is successfully made..."))
    .catch((err) => {
      console.log(err);
    });
};
