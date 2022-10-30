
import React from "react";
import Navigation from "./Navigation-client";
import Banner from "./Banner-client";
import Chakra from "./Chakra-client";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body>
        <Chakra>
          <Banner />
          <Navigation />
          <div>Layout!</div>
          {children}
        </Chakra>
      </body>
    </html>
  );
}
