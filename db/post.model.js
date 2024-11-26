const { Schema, model } = require("mongoose");

const PostSchema = Schema(
  {
    title: String,
    content: String,
    user: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("posts", PostSchema);
