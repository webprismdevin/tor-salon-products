import { Money } from "@shopify/hydrogen-react";
import { SanityPrice } from "components/SanityPrice";
import { imageBuilder } from "lib/sanity";
import { ImageUrlBuilder } from "next-sanity-image";
import Image from "next/image";
import Link from "next/link";

export default function ProductGrid({ data }: { data: any }) {
  return (
    <div
      className={`flex flex-col ${
        data.layout == "right" ? "md:flex-row-reverse" : "md:flex-row"
      } `}
    >
      {data.image && (
        <div className="relative min-w-[50%]">
          <Image
            src={imageBuilder(data.image).width(1200).height(1200).url()}
            alt={data.image?.alt ?? ""}
            //   width={1200}
            //   height={1200}
            fill
          />
        </div>
      )}
      <div className="p-8 md:p-12 lg:p-16">
        <div className="text-center pb-8">
          <p className="text-xl">{data.caption}</p>
          <h2 className="text-3xl font-bold">{data.title}</h2>
        </div>
        <div
          className={`grid grid-cols-2 ${
            !data.image && `md:grid-cols-${data.products.length}`
          } gap-4 justify-center items-center`}
        >
          {data.products.map((product: any) => (
            <Link
              href={product.to}
              key={product.gid}
              className="flex flex-col justify-center items-center p-6 bg-slate-200 h-full w-full text-center"
            >
              <Image
                src={product.featuredImage}
                alt={product.title}
                width={200}
                height={200}
              />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <SanityPrice product={product} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
