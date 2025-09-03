import { Heading } from "@chakra-ui/react";
import SearchResults from "./components/searchResults";
import Search from "../components/shared/search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string | null };
}) {
  const { query } = await searchParams;

  return (
    <>
      <Search />
      <Heading size={"xl"} textAlign={"center"} py={4}>
        Results for {query}
      </Heading>
      <SearchResults query={query} />
    </>
  );
}
