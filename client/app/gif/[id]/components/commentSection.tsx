"use client";

import { useEffect, useState } from "react";
import CommentInput from "./commentInput";
import CommentList from "./commentList";
import Comment from "@/types/comment";
import { Heading, Center, Spinner } from "@chakra-ui/react";

export default function CommentSection({ gifId }: { gifId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchComments() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${gifId}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [gifId]);

  return (
    <>
      <Heading as="h2" size="lg" mb={2} textAlign="center">
        Comments
      </Heading>
      <CommentInput gifId={gifId} fetchComments={fetchComments} />
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <CommentList comments={comments} fetchComments={fetchComments} />
      )}
    </>
  );
}
