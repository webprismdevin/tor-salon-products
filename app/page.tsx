import Modules from "../components/Modules/Modules";
import { MODULE_FRAGMENT, sanity } from "../lib/sanity";
import { cache, Suspense } from "react";

export const revalidate = 60;

const getData = cache(async () => {
  const res = await sanity.fetch(
    `*[_type == "home"][0]{
    ...,
    ${MODULE_FRAGMENT}
  }`
  );

  if (!res) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res;
});

export async function generateMetadata() {
  const data = await getData();

  return {
    title: data?.seo_title ?? "TOR Salon Products",
  };
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Modules modules={data.modules} />
      </Suspense>
    </div>
  );
}
