"use client";

import { useState } from "react";
import { Input, Button, Group, HStack } from "@chakra-ui/react";

export default function CommentInput({
  gifId,
  fetchComments,
}: {
  gifId: string;
  fetchComments: () => void;
}) {
  const [comment, setComment] = useState("");

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/comments/`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment, gifId }),
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.statusText}`);
        } else {
          setComment("");
          fetchComments();
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <HStack justifyContent={"center"} pt={4} pb={8}>
      <form onSubmit={handleAddComment}>
        <Group w={"60ch"} attached>
          <Input
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button type="submit">Post</Button>
        </Group>
      </form>
    </HStack>
  );
}
