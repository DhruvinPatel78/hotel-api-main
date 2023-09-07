const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Hotel = require("../models/hotel");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return;
  }
  const parsedJWT = jwt.verify(authHeader, process.env.JWT_SECRET);
  req.user = {
    email: parsedJWT.email,
    role: parsedJWT.role,
  };
  next();
};

router.use(verifyToken);

router.get("/", async (req, res) => {
  const hotels = await Hotel.find();
  console.log({ hotels });
  res.json(hotels);
});

router.get("/:id", async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  res.send(hotel);
});

router.post("/", async (req, res) => {
  const hotel = req.body;
  const user = req.user;
  if (user.role === "ADMIN") {
    const dbHotel = await Hotel.create(hotel);
    res.send(dbHotel);
  } else {
    res.status(403).send({ message: "Unauthorized" });
  }
});

// router.put("/:id", (req, res) => {
//   const newHotelInfo = req.body;
//   hotels[parseInt(req.params.id, 10) - 1] = newHotelInfo;
//   res.send(newHotelInfo);
// });

// router.delete("/:id", (req, res) => {
//   hotels.splice(parseInt(req.params.id, 10) - 1, 1);
//   res.send({ success: true });
// });

module.exports = router;
