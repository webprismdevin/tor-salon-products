import Header from "components/Header";
import { sanity, settingsQuery } from "lib/sanity";
import { Metadata } from "next";
import './globals.css';


export async function getData() {
  const res = await sanity.fetch(settingsQuery);

  if (!res) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res;
}

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getData();

  return (
    <html lang="en">
      <body>
        <Header menu={settings?.menu} />
        {children}
      </body>
    </html>
  );
}
