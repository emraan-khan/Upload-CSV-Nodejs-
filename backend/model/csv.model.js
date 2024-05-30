import mongoose from "mongoose";

//model for the csv-file object
const uploadSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  }
});

export const Upload = mongoose.model("Upload", uploadSchema);
