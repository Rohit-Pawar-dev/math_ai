const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true }, 
    response: { type: String, default: null },    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
