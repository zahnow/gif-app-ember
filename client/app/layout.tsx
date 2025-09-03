import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { Container } from "@chakra-ui/react";
import Header from "@/app/components/header/header";

export const metadata: Metadata = {
  title: "Gif Finder",
  description: "Explore and find your favorite GIFs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Container paddingTop={10}>
            <Header />
            {children}
          </Container>
        </Provider>
      </body>
    </html>
  );
}
