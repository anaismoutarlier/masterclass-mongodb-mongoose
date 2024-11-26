const { Router } = require("express");
const { User } = require("../db");

const router = Router();

// NE PAS FAIRE EN PRODUCTION
router.get("/", async (_, res) => {
  const users = await User.find();

  res.json({ users });
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  // await User.create(req.body);
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    res.json({ docId: user._id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
