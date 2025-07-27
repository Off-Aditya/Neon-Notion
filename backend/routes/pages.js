const express = require("express");
const router = express.Router();
const Page = require("../database/schema");

router.get("/", async (req, res) => {
    const pages = await Page.find().sort({ updatedAt: -1 });
    res.json(pages);
});


router.get("/:id", async (req, res) => {
    const page = await Page.findById(req.params.id);
    res.json(page);
});

router.post("/", async (req, res) => {
    const page = new Page({ title: req.body.title, content: req.body.content });
    await page.save();
    res.json(page);
});

// UPDATE page
router.put("/:id", async (req, res) => {
    const page = await Page.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags,
            tasks: req.body.tasks,
        },
        { new: true }
    );
    res.json(page);
});


router.delete("/:id", async (req, res) => {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: "Page deleted" });
});

module.exports = router;
