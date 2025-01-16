import mongoose, { model, Schema } from "mongoose";
mongoose.connect(
  "mongodb+srv://ishwarreddy95460:ishwar@cluster0.osizg.mongodb.net/"
);
const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
});
const TagsSchema = new Schema({
  id: { type: Number, unique: true },
});

const LinkSchema = new Schema({
  hash: { type: String, required: true },
  userId: {type: mongoose.Types.ObjectId, required: true}
})

const ContentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String,required: true },
  title: { type: String, required: true },
  // tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});
export const LinkModel = model("Link", LinkSchema);

export const UserModel = model("User", UserSchema);
export const TagsModel = model("Tag", TagsSchema);
export const ContentModel = model("Content", ContentSchema);
