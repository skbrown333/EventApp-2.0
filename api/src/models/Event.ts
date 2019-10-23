import mongoose from "mongoose";

let schemaOptions = {
  versionKey: false
};

let eventSchema = new mongoose.Schema(
  {
    cre_account: { type: mongoose.Schema.Types.ObjectId, required: true },
    cre_date: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    is_public: { type: Boolean, default: true },
    is_premium: { type: Boolean, default: false },
    type: { type: String, required: true },
    price: { type: Number, default: 0 },
    ticket_qty: { type: Number, required: false },
    title: { type: String, required: true },
    address: { type: String, required: false },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    votes: { type: Number, default: 0 }
  },
  schemaOptions
);

export default mongoose.model("Event", eventSchema);