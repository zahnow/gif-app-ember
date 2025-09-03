import Link from "next/link";
import Image from "next/image";
import { Box } from "@chakra-ui/react";
import Gif from "@/types/gif";

export default function ImageGridItem({ gif }: { gif: Gif }) {
  return (
    <Link href={`/gif/${gif.id}`} key={gif.id}>
      <Box
        borderRadius={"4"}
        overflow={"hidden"}
        transition={"transform 0.2s ease"}
        _hover={{ transform: "scale(1.05)" }}
      >
        <Image
          src={gif.images.original.url}
          width={gif.images.original.width}
          height={gif.images.original.height}
          alt={gif.title}
          style={{ borderRadius: "8px" }}
          unoptimized
        />
      </Box>
    </Link>
  );
}
