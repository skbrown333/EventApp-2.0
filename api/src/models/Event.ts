import mongoose from "mongoose";

let schemaOptions = {
  versionKey: false
};

let eventSchema = new mongoose.Schema(
  {
    cre_account: { type: mongoose.Schema.Types.ObjectId, required: true },
    cre_date: { type: String, required: true },
    date: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: false },
    description: { type: String, required: false },
    title: { type: String, required: true },
    address: { type: String, required: false },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  schemaOptions
);

export default mongoose.model("Event", eventSchema);
