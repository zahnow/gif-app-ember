"use client";

import { useEffect, useState } from "react";
import ImageGrid from "@/app/components/shared/imageGrid";

export default function SearchResults({ query }: { query: string | null }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/gifs/search?q=${query}`,
          {
            credentials: "include",
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.statusText}`);
        }
        const data = await response.json();
        setResults(data.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchData();
  }, [query]);

  return <ImageGrid gifs={results} />;
}
