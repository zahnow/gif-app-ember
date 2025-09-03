"use client";

import { useState } from "react";
import { authClient } from "@/components/auth/auth-client";
import { Box, HStack, Spacer, VStack, Text, Input } from "@chakra-ui/react";
import Comment from "@/types/comment";
import { DeleteComment } from "./deleteComment";

export default function CommentListItem({
  comment,
  fetchComments,
}: {
  comment: Comment;
  fetchComments: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment.comment);
  const session = authClient.useSession();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedComment(comment.comment.comment);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editedComment.trim() === "") {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${comment.comment.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: editedComment }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update comment:" + response.statusText);
      }
      setIsEditing(false);
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  function cancelEdit() {
    setIsEditing(false);
    setEditedComment(comment.comment.comment);
  }

  return (
    <>
      <Box
        key={comment.comment.id}
        p={4}
        borderRadius="md"
        borderWidth="1px"
        width={"100%"}
      >
        <VStack gap={2} alignItems="flex-start">
          <HStack
            width="100%"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Text fontWeight="bold">{comment.user}</Text>
              <Text fontSize="xs">
                {new Date(comment.comment.createdAt).toLocaleString()}
                {comment.comment.updatedAt && " (edited)"}
              </Text>
            </Box>
            <Spacer />
          </HStack>
          {isEditing ? (
            <form onSubmit={handleEdit} style={{ width: "100%" }}>
              <Input
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                onBlur={cancelEdit}
                autoFocus
              />
            </form>
          ) : (
            <Text mt={2}>{comment.comment.comment}</Text>
          )}
          <HStack width="100%" gap={4} justifyContent="flex-end">
            {session.data?.user.id === comment.comment.userId && (
              <>
                <Text
                  cursor={"pointer"}
                  fontSize={"xs"}
                  onClick={handleEditToggle}
                >
                  Edit
                </Text>
                <DeleteComment
                  commentId={comment.comment.id}
                  fetchComments={fetchComments}
                />
              </>
            )}
          </HStack>
        </VStack>
      </Box>
    </>
  );
}
