"use client";

import { useEffect, useState } from "react";
import { Button, Menu, Portal, Dialog, CloseButton } from "@chakra-ui/react";
import { authClient } from "@/components/auth/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Account() {
  const session = authClient.useSession();
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    authClient.signOut();
    setIsConfirmationOpen(false);
    router.push("/");
  }

  useEffect(() => {
    if (session.data) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session.data]);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline">
                {session?.data?.user.email || "Account"}
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    value="logout"
                    onClick={() => setIsConfirmationOpen(true)}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Dialog.Root
            open={isConfirmationOpen}
            onOpenChange={() => setIsConfirmationOpen(!isConfirmationOpen)}
          >
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Logout</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>Are you sure you want to log out?</Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="xs" />
                    </Dialog.CloseTrigger>
                    <Button
                      variant="outline"
                      onClick={() => setIsConfirmationOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button colorPalette="red" onClick={(e) => handleLogout(e)}>
                      Logout
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </>
      ) : (
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      )}
    </>
  );
}
