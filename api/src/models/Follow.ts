import mongoose from "mongoose";

let schemaOptions = {
  versionKey: false
};

let followSchema = new mongoose.Schema(
  {
    cre_date: { type: String, required: true },
    follow_account: { type: mongoose.Schema.Types.ObjectId, required: true },
    follower_account: { type: mongoose.Schema.Types.ObjectId, required: true }
  },
  schemaOptions
);

export default mongoose.model("Follow", followSchema);