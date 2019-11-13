import mongoose from "mongoose";

let schemaOptions = {
  versionKey: false
};

let accountSchema = new mongoose.Schema(
  {
    cre_date: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, required: false },
    hash: { type: String, required: true }
  },
  schemaOptions
);

export default mongoose.model("Account", accountSchema);