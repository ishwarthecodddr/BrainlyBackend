import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
const app = express();
import z, { string } from "zod";
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://brainly123.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
import { UserModel, ContentModel, LinkModel } from "./db";
import { Usermiddleware } from "./middleware";
import { Hashfuntion } from "./util";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
const signupSchema = z.object({
  username: z.string().min(3, { message: "min 3 to 10 letters" }),
  password: z.string().min(8, {
    message:
      "min 8 to 20 letters should have upparcase , lowercase, special character , number",
  }),
});

// const ContentSchema = z.object{
//   link: z.string();
// }

app.post("/signup", async (req:Request, res:Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const result = signupSchema.safeParse({ username, password });
    if (!result.success) {
      res.status(411).json({ msg: "Check username and password" });
    } else {
      await UserModel.create({ username: username, password: password });
      res.json({ msg: "SignedUp" });
    }
  } catch (e) {
    res.status(411).json({ msg: "User already exits" });
    console.log(e);
  }
});
app.post("/signin", async (req:Request, res:Response) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const userexist = await UserModel.findOne({
      username,
      password,
    });
    if (userexist) {
      const token = jwt.sign({ id: userexist._id.toString() }, "secret");
      res.json({ token: token });
    } else {
      res.status(401).json({ msg: "Invalid username or password" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Error during signin" });
  }
});
app.post("/content", Usermiddleware, async (req: Request, res: Response) => {
  const link = req.body.link;
  const title = req.body.title;
  const type = req.body.type;
  try {
    //todo: zod validation
    await ContentModel.create({
      link,
      title,
      type,
      // @ts-ignore
      userId: req.userId,
      tags: [],
    });
    res.json({ msg: "content added" });
  } catch (e) {
    res.json({ msg: "Some error while creating content" });
    console.log(e);
  }
});

app.get("/content", Usermiddleware, async (req:Request, res:Response) => {
  const content = await ContentModel.find({
    // @ts-ignore
    userId: req.userId,
  }).populate("userId", "username");
  res.json({ content });
});
app.delete("/content", Usermiddleware, async (req:Request, res:Response) => {
  const contentId = req.body.contentId;
  await ContentModel.deleteOne({
    contentId,
    userId: req.userId,
  });
  res.json({ msg: "deleted successfully" });
});

app.post("/brain/share", Usermiddleware, async (req:Request, res:Response) => {
  const share = req.body.share;
  try {
    if (share) {
      const hash = Hashfuntion(20);
      await LinkModel.create({
        hash,
        userId: req.userId,
      });
      res.json({ msg: "shared successfully" + "\n link: " + hash });
    } else {
      await LinkModel.deleteOne({
        userId: req.userId,
      });
      res.json({ msg: "unshared successfully" });
    }
  } catch (e) {
    res.json(e);
  }
});
app.get("/brain/:shareLink", async (req:Request, res:Response) => {
  const hash = req.params.shareLink;
  const link = await LinkModel.findOne({
    hash,
  });
  if (!link) {
    res.status(411).json({ msg: "Sent incorrect inputs" });
    return; // early return
  }
  const user = await UserModel.findOne({
    _id: link.userId,
  });
  if (!user) {
    res.json("user doesn't exit!!! , control shouldn't reach here");
    return;
  }
  const content = await ContentModel.find({
    userId: link.userId,
  });
  res.json({ username: user.username, content: content });
});
app.listen(3000);
