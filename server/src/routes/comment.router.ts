import { Router } from "express";
import { eq, and, sql, isNull } from "drizzle-orm";
import { db } from "../db/db";
import { commentsTable, user } from "../db/schema";
import { requireSession } from "../middleware/requireSession";

const commentRouter: Router = Router();

commentRouter.get("/:id", requireSession, async (req, res) => {
  const gifId = req.params.id;
  try {
    const comments = await db
      .select({ comment: commentsTable, user: user.name })
      .from(commentsTable)
      .leftJoin(user, eq(commentsTable.userId, user.id))
      .where(
        and(eq(commentsTable.gifId, gifId), isNull(commentsTable.deletedAt)),
      );

    if (!comments) {
      return res.status(200).send([]);
    }

    res.send(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.sendStatus(500);
  }
});

commentRouter.post("/", requireSession, async (req, res) => {
  const { gifId, comment } = req.body;
  const userId = req.session.user.id;
  if (!gifId || !comment) {
    return res.status(400).send("gifId, and comment are required.");
  }

  const newComment: typeof commentsTable.$inferInsert = {
    gifId,
    userId,
    comment,
  };

  try {
    await db.insert(commentsTable).values(newComment);
    res.sendStatus(201);
  } catch (error) {
    console.error("Error inserting comment:", error);
    return res.sendStatus(500);
  }
});

commentRouter.put("/:id", requireSession, async (req, res) => {
  const commentId = Number(req.params.id);
  const { comment } = req.body;
  const userId = req.session.user.id;

  if (!comment) {
    return res.status(400).send("Comment text is required for updating.");
  }
  try {
    const result = await db
      .update(commentsTable)
      .set({ comment, updatedAt: sql`(current_timestamp)` })
      .where(
        and(eq(commentsTable.id, commentId), eq(commentsTable.userId, userId)),
      );

    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.sendStatus(500);
  }
});

commentRouter.delete("/:id", requireSession, async (req, res) => {
  const commentId = Number(req.params.id);
  const userId = req.session.user.id;
  try {
    const result = await db
      .update(commentsTable)
      .set({ deletedAt: sql`(current_timestamp)` })
      .where(
        and(eq(commentsTable.id, commentId), eq(commentsTable.userId, userId)),
      );

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.sendStatus(500);
  }
});

export default commentRouter;
