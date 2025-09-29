import { Router } from "express";
import { db } from "../db/db";
import { ratingsTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { requireSession } from "../middleware/requireSession";

const ratingRouter: Router = Router();

ratingRouter.get("/:id", requireSession, async (req, res) => {
  const gifId = req.params.id;
  const userId = req.session.user.id;

  try {
    const result = await db
      .select()
      .from(ratingsTable)
      .where(
        and(eq(ratingsTable.gifId, gifId), eq(ratingsTable.userId, userId)),
      )
      .limit(1);

    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.send(0);
    }
  } catch (error) {
    console.error("Error fetching rating:", error);
    return res.sendStatus(500);
  }
});

ratingRouter.put("/:id", requireSession, async (req, res) => {
  const gifId = req.params.id;
  const { rating } = req.body;
  const userId = req.session.user.id;

  if (typeof rating !== "number") {
    return res.status(400).send("Rating must be a number.");
  }

  const newRating = {
    gifId,
    userId,
    rating,
  };

  try {
    const result = await db
      .insert(ratingsTable)
      .values(newRating)
      .onConflictDoUpdate({
        target: [ratingsTable.gifId, ratingsTable.userId],
        set: { rating: newRating.rating },
      });
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating rating:", error);
    return res.sendStatus(500);
  }
});

ratingRouter.delete("/:id", requireSession, async (req, res) => {
  const gifId = req.params.id;
  const userId = req.session.user.id;

  try {
    const result = await db
      .delete(ratingsTable)
      .where(
        and(eq(ratingsTable.gifId, gifId), eq(ratingsTable.userId, userId)),
      );

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting rating:", error);
    return res.sendStatus(500);
  }
});

export default ratingRouter;
