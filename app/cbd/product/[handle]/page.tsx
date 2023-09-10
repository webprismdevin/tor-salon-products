import { Heading } from "../../../../components/Heading";
import Modules from "../../../../components/Modules/Modules";
import { imageBuilder, sanity } from "../../../../lib/sanity";
import { formatUSD, getModules } from "../../../../lib/utils";
import Image from "next/image";
import { cache } from "react";
import { CbdCheckout } from "./CbdCheckout";
import { Accordions } from "./Accordions";

const getPage = cache(async (handle: string) => {
  const res = await sanity.fetch(
    `*[_type == "cbdProduct" && slug.current == "${handle}"][0]`
  );

  if (!res) {
    throw new Error("Failed to fetch data");
  }

  return res;
});

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}) {
  const page = await getPage(params.handle);

  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? page.description,
  };
}
export default async function Page({ params }: { params: { handle: string } }) {
  const modules = await getModules("cbdProduct", params.handle);
  const page = await getPage(params.handle);

  const { title, description, images, priceRange, checkoutUrl } = page;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:max-w-screen-xl mx-auto px-4">
        <div className="max-w-[260px] md:max-w-none mx-auto">
          <Image
            src={imageBuilder(images[0]).url()}
            width={800}
            height={800}
            alt=""
          />
        </div>
        <div className="p-4 md:p-12 flex flex-col gap-8">
          <Heading as="h3">{title}</Heading>
          <div>{description}</div>
          <CbdCheckout
            className="fixed bottom-4 left-4 right-4 z-50 md:static md:z-0"
            checkoutUrl={checkoutUrl}
            handle={params.handle}
          >
            <div className="whitespace-nowrap font-heading text-2xl md:text-xl py-1 px-2 md:px-0 md:py-0">
              {formatUSD(priceRange.price)} | Buy Now
            </div>
          </CbdCheckout>
          {page.icons && (
            <div className="flex flex-row justify-center gap-4">
              {page.icons.map((icon: any) => (
                <Image
                  key={icon._key}
                  src={imageBuilder(icon).url()}
                  width={64}
                  height={64}
                  alt=""
                />
              ))}
            </div>
          )}
          <Accordions data={page.accordions} />
        </div>
      </div>
      <div>
        <Modules modules={modules.modules} />
      </div>
    </div>
  );
}
