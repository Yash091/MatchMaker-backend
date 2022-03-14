import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

const storage = new GridFsStorage({
  url: "mongodb+srv://yash091:8542955586@cluster0.sedvy.mongodb.net/Matrimony?retryWrites=true&w=majority",

  options: { useUnifiedTopology: true, useNewUrlParser: true },
  file: (request, file) => {
    const match = ["image/png", "image/jpg", "image/jpeg"];

    if (match.indexOf(file.mimeType) === -1)
      return `${Date.now()}-blog-${file.originalname}`;

    return {
      bucketName: "photos",
      filename: `${Date.now()}-blog-${file.originalname}`,
    };
  },
});

export default multer({ storage });
