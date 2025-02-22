const express = require("express");
const service = require("../service/service");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World Route");
});

router.post("/transform", async (req, res) => {
    const response = await service.converter(req.body.converterType);
    res.status(200).json(response);
});

module.exports = router;