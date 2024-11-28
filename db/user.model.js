const mongoose = require("mongoose");
const moment = require("moment");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      validate: {
        validator: val => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
        message: ({ value }) => `${value} is not a valid email address.`,
      },
    },
    password: {
      type: String,
      // this = document
      required: () => this.status !== "pending",
      validate: {
        validator: val => val.length >= 10,
      },
      select: false,
    },
    type: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary"],
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
    birthdate: Date,
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

UserSchema.virtual("age").get(function () {
  // this = document
  if (!this.birthdate) return;
  return moment().diff(this.birthdate, "years");
});

UserSchema.post("deleteOne", async function () {
  // this = query
  console.log(this);
  const filter = this.getFilter();
  await mongoose.model("posts").deleteMany({ user: filter._id });
  await mongoose.model("comments").deleteMany({ user: filter._id });
});

module.exports = mongoose.model("users", UserSchema);
