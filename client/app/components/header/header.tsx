import { HStack, Heading, Spacer } from "@chakra-ui/react";
import Link from "next/link";
import Account from "./account";

export default function Header() {
  return (
    <HStack paddingBottom={5}>
      <Link href="/">
        <Heading fontSize={"2xl"} fontWeight={"bold"}>
          GIF Finder
        </Heading>
      </Link>
      <Spacer />
      <Account />
    </HStack>
  );
}
