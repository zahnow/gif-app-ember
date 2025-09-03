import { Dialog, Portal, Button, CloseButton, Text } from "@chakra-ui/react";

export function DeleteComment({
  commentId,
  fetchComments,
}: {
  commentId: string;
  fetchComments: () => void;
}) {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) {
        console.error("Failed to delete comment:", response.statusText);
      }
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Text cursor={"pointer"} fontSize={"xs"}>
          Delete
        </Text>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Comment</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              Are you sure you want to delete this comment?
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="xs" />
              </Dialog.CloseTrigger>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette={"red"} onClick={handleDelete}>
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
