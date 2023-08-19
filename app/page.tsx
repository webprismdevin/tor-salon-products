import { sanity } from "lib/sanity";
import { Metadata } from "next";

async function getData() {
  const res = await sanity.fetch(`*[_type == "homepage"][0]`);

  console.log(res)

  if (!res) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res;
}

export const metadata: Metadata = {
  title: "My Page Title",
};

export default async function Page() {
  const data = await getData();

  return <div>New home page</div>;
}
