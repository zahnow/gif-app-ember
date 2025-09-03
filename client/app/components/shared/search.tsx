"use client";

import { useState } from "react";
import { Box, Input, InputGroup } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export default function Search() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchValue.trim()) {
      return;
    }
    router.push(`/search?query=${encodeURIComponent(searchValue.trim())}`);
  };

  return (
    <form onSubmit={(e) => handleSearch(e)}>
      <Box maxW="60ch" mx="auto" mt={4}>
        <InputGroup startElement={<FaSearch />}>
          <Input
            size={"xl"}
            placeholder="Search GIFs..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </InputGroup>
      </Box>
    </form>
  );
}
