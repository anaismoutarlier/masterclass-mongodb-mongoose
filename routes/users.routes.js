const { Router } = require("express");
const { User } = require("../db");

const router = Router();

// NE PAS FAIRE EN PRODUCTION
router.get("/", async (_, res) => {
  const users = await User.find();

  console.log(users[0].age);
  console.log({ ...users[0] });
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

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const data = await User.deleteOne({ _id: id });
  res.json(data);
});

router.get("/signup-stats", async (_, res) => {
  const query = [
    {
      $addFields: {
        month: {
          $month: "$createdAt",
        },
        year: {
          $year: "$createdAt",
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
          year: "$year",
        },
        users: {
          $push: {
            _id: "$_id",
            username: "$username",
          },
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        users: 1,
        count: {
          $size: "$users",
        },
      },
    },
  ];

  const data = await User.aggregate(query);
  res.json(data);
});
module.exports = router;
