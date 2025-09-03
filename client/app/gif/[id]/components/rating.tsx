"use client";

import { useEffect, useState } from "react";
import {
  Box,
  HStack,
  CloseButton,
  RatingGroup,
  Heading,
} from "@chakra-ui/react";

export default function StarRating({ gifId }: { gifId: string }) {
  const [rating, setRating] = useState(0);

  const updateRating = async (event: { value: number }) => {
    const value = event.value;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ratings/${gifId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating: event.value }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update rating: " + response.statusText);
      }
      setRating(value);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const deleteRating = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ratings/${gifId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete rating: " + response.statusText);
      }
      setRating(0);
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ratings/${gifId}`,
          {
            credentials: "include",
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch rating: " + response.statusText);
        }
        const data = await response.json();
        setRating(data.rating || 0);
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };

    fetchRating();
  }, [gifId]);

  return (
    <Box py={4}>
      <Heading as="h2" size="lg" textAlign="center">
        Your Rating
      </Heading>
      <HStack justifyContent={"center"}>
        <RatingGroup.Root
          py={3}
          count={5}
          size={"lg"}
          value={rating}
          onValueChange={(event) => updateRating(event)}
        >
          <RatingGroup.HiddenInput />
          <RatingGroup.Control />
        </RatingGroup.Root>
        <CloseButton onClick={deleteRating} disabled={rating === 0} />
      </HStack>
    </Box>
  );
}
