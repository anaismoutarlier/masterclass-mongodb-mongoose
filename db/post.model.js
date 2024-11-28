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

PostSchema.pre("find", function (next) {
  // this = query
  this.populate("user", "username");
  console.log("in middleware");
  next();
});

module.exports = model("posts", PostSchema);
