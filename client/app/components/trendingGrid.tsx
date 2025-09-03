// "use client";

import ImageGrid from "./shared/imageGrid";

export default async function TrendingGrid() {
  let gifs = { data: [] };
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifs`, {
      headers: {
        authorization: `Bearer ${process.env.SERVER_SECRET}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.statusText}`);
    } else {
      gifs = await response.json();
    }
  } catch (error) {
    console.error("Error fetching trending GIFs:", error);
  }

  return <ImageGrid gifs={gifs.data} />;
}
