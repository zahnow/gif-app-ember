import { Router } from "express";
import { requireSession } from "../middleware/requireSession";

const gifRouter: Router = Router();

gifRouter.get("/", async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.SERVER_SECRET}`) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const gifQuery = await fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=40&offset=0&rating=g&bundle=messaging_non_clips`,
    );
    const gifs = await gifQuery.json();
    res.send(gifs);
  } catch (error) {
    console.error("Error fetching trending GIFs:", error);
    return res.status(500).send("Internal Server Error");
  }
});

gifRouter.get("/search", requireSession, async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send("Query parameter 'q' is required.");
  }
  try {
    const searchQuery = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${query}&limit=40&offset=0&rating=g&bundle=messaging_non_clips`,
    );
    const searchResults = await searchQuery.json();
    res.send(searchResults);
  } catch (error) {
    console.error("Error fetching search results:", error);
    return res.status(500).send("Internal Server Error");
  }
});

gifRouter.get("/:id", async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.SERVER_SECRET}`) {
    return res.sendStatus(401);
  }

  const gifId = req.params.id;
  if (!gifId) {
    return res.status(400).send("GIF ID is required.");
  }

  try {
    const gifQuery = await fetch(
      `https://api.giphy.com/v1/gifs/${gifId}?api_key=${process.env.GIPHY_API_KEY}`,
    );
    const gif = await gifQuery.json();
    if (gif.data) {
      res.send(gif.data);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error fetching GIF details:", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default gifRouter;
