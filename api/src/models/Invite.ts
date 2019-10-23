import mongoose from "mongoose";

let schemaOptions = {
  versionKey: false
};

let inviteSchema = new mongoose.Schema(
  {
    cre_account: { type: mongoose.Schema.Types.ObjectId, required: true },
    inv_account: { type: mongoose.Schema.Types.ObjectId, required: true },
    event: { type: mongoose.Schema.Types.ObjectId, required: true },
    cre_date: { type: String, required: true }
  },
  schemaOptions
);

export default mongoose.model("Invite", inviteSchema);