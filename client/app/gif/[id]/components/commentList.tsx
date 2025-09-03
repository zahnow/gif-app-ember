"use client";

import { VStack, Text, HStack } from "@chakra-ui/react";
import CommentListItem from "./commentListItem";
import Comment from "@/types/comment";

export default function CommentList({
  comments,
  fetchComments,
}: {
  comments: Comment[];
  fetchComments: () => void;
}) {
  return (
    <HStack justifyContent={"center"}>
      <VStack w={"60ch"} gap={4}>
        {comments.length === 0 ? (
          <Text textAlign="center">
            No comments yet. Be the first to comment!
          </Text>
        ) : (
          comments.map((comment) => (
            <CommentListItem
              key={comment.comment.id}
              comment={comment}
              fetchComments={fetchComments}
            />
          ))
        )}
      </VStack>
    </HStack>
  );
}
