"use client";
import React, { Fragment, Suspense, useEffect, useState } from "react";
import { imageBuilder } from "lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { SanityImageAssetDocument } from "@sanity/client";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import PortableText from "components/PortableText/PortableText";
import Slides from "./Slides";
import graphClient from "lib/graph-client";
import { collection_query } from "pages/collection/[handle]";
import Product from "components/Product/Product";
import dynamic from "next/dynamic";
import ProductGrid from "./ProductGrid";

const ReviewCarousel = dynamic(() => import("./ReviewCarousel"));

export default function Modules({ modules }: any) {
  if (!modules) return <>No section modules to display</>;

  return (
    <React.Fragment>
      {modules.map((module: any) => {
        switch (module._type) {
          case "component.hero":
            return <Hero key={module._key} data={module} />;
          case "component.textWithImage":
            return <TextWithImage key={module._key} data={module} />;
          case "component.collectionGrid":
            return <CollectionGrid key={module._key} data={module} />;
          case "component.marquee":
            return <Marquee key={module._key} data={module} />;
          case "component.slides":
            return <Slides key={module._key} data={module} />;
          case "component.collection":
            return <Collection key={module._key} data={module} />;
          case "component.reviewCarousel":
            return (
              <Suspense>
                <ReviewCarousel data={module} key={module._key} />
              </Suspense>
            );
          case "component.faq":
            return <FAQs key={module._key} data={module} />;
          case "component.productGrid":
            return <ProductGrid key={module._key} data={module} />;
          default:
            return null;
        }
      })}
    </React.Fragment>
  );
}

export type Hero = {
  _key: string;
  image: {
    asset: SanityImageAssetDocument;
    alt: string;
    loading?: "lazy" | "eager";
    width: number;
    height: number;
  };
  title: string;
  caption: string;
  cta?: {
    text: string;
    to: string;
    useRelativePath?: boolean;
    relativeLink?: string;
  };
  colorTheme?: {
    background?: {
      hex: string;
    };
    text?: {
      hex: string;
    };
  };
  layout?: "left" | "right" | "center";
  size?: "small" | "medium" | "large";
};

export function Hero({ data }: { data: Hero }) {
  const { image, title, caption, cta, layout, size } = data;

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div
      key={data._key}
      className={`flex-column align-center relative flex ${
        size === "small" ? "h-[500px]" : "h-[800px]"
      } overflow-hidden p-8 lg:p-24 ${layout === "right" && "justify-end"} ${
        layout === "center" && "justify-center text-center"
      }`}
      ref={ref}
      style={{
        backgroundColor: data.colorTheme?.background?.hex ?? "#ffffff",
        color: data.colorTheme?.text?.hex ?? "#121212",
      }}
    >
      <motion.div
        style={{ y }}
        className="absolute left-0 top-0 z-0 h-full w-full"
      >
        <Image
          src={imageBuilder(image.asset).format("webp").quality(80).url()}
          sizes={"100vw"}
          className="mx-auto mt-0 min-h-full w-auto object-cover"
          alt={image.alt}
          fill
          loading={image.loading ? image.loading : "lazy"}
        />
      </motion.div>
      <div
        className={`${
          layout === "right" && "text-right"
        } z-1 relative self-center max-w-prose`}
      >
        <p className="text-shadow text-xl lg:text-2xl">{caption}</p>
        <h2 className="text-shadow mb-4 font-heading text-4xl uppercase lg:text-6xl">
          {title}
        </h2>
        {cta?.to && (
          <Link
            className="px-4 py-2 rounded bg-black text-white font-bold"
            href={cta.to}
          >
            {cta.text}
          </Link>
        )}
      </div>
    </div>
  );
}

export type CollectionResponse = {
  collection: {
    products: {
      edges: any[];
    };
  };
};

function Collection({ data }: any) {
  const [products, setProducts] = React.useState<any[] | null>(null);

  const getProducts = async () => {
    const { collection } = (await graphClient.request(collection_query, {
      handle: data.handle,
    })) as CollectionResponse;

    setProducts(collection.products.edges);
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (!products) return <></>;

  return (
    <div
      className="flex flex-col gap-2 w-full py-4 md:py-8 text-center md:text-left no-scrollbar"
      style={{
        background: data.colorTheme?.background?.hex ?? "#ffffff",
        color: data.colorTheme?.text?.hex ?? "#121212",
      }}
    >
      <div className="px-9">
        <h2
          className="font-heading text-2xl md:text-3xl lg:text-4xl pb-4"
          style={{
            color: data.colorTheme?.text?.hex ?? "#121212",
          }}
        >
          {data.title}
        </h2>
        <p>{data.subtitle}</p>
      </div>
      <div className="flex snap-x overflow-auto">
        {products.map((product: any) => {
          return (
            <div
              className="snap-start first:ml-8 last:mr-8"
              key={product.node.id}
            >
              <Product product={product} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SanityProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.handle}`}>
      <p>{product.title}</p>
    </Link>
  );
}

function TextWithImage({ data }: { data: any }) {
  const layoutClass =
    data.layout === "right"
      ? "flex-col-reverse md:flex-row-reverse"
      : "flex-col";

  const sizeClass = data.size === "small" ? "md:max-h-[500px]" : "";

  return (
    <div
      style={{
        backgroundColor: data.colorTheme?.background?.hex ?? "#ffffff",
        color: data.colorTheme?.text?.hex ?? "#121212",
      }}
      className={`flex w-full lg:flex-row  ${
        data.image ? "justify-between" : ""
      } ${layoutClass} ${sizeClass}`}
      key={data._key}
    >
      <div
        className={`max-w-full grow-1 self-center ${
          data.image ? "p-8 lg:p-24" : "p-4"
        } ${data.image ? "lg:max-w-[50%]" : "lg:max-w-screen-lg mx-auto"}`}
      >
        <div className={`${data.image ?? "justify-center text-center"}`}>
          <p className="font-heading text-base">{data.caption}</p>
          <p className="font-heading text-2xl md:text-3xl lg:text-4xl">
            {data.title}
          </p>
        </div>
        <div className="mt-4 flex flex-col items-start">
          {data?.content && <PortableText blocks={data.content} />}
          {data.cta && <CallToAction data={data} />}
        </div>
      </div>
      {data.image && (
        <div className="relative aspect-[16/9] md:aspect-square min-w-[50%]">
          <Image
            src={imageBuilder(data.image).format("webp").url()}
            alt={data.image.alt ? data.image.alt : "Image"}
            // sizes="(min-width: 1024px) 50vw, 100vw"
            className="absolute w-full object-cover left-0 right-0"
            fill
          />
        </div>
      )}
    </div>
  );
}

function CallToAction({ data }: { data: any }) {
  return (
    <div>
      {data.cta?.text && (
        <div
          className="rounded py-2 px-4 text-lg font-bold"
          style={{
            backgroundColor: data.colorTheme?.text?.hex ?? "#000000",
            color: data.colorTheme?.background?.hex ?? "#ffffff",
          }}
        >
          <Link
            href={
              data.cta.useRelativePath ? data.cta.relativeLink : data.cta.to
            }
          >
            {data.cta.text}
          </Link>
        </div>
      )}
    </div>
  );
}

function CollectionGrid({ data }: { data: any }) {
  const { collections } = data;

  const imageClass =
    "absolute left-0 top-0 z-0 h-full w-full object-cover object-center";

  const collectionClass =
    "relative grid place-items-center font-heading text-2xl uppercase min-h-[150px] md:min-h-[200px]";

  function isEven(n: number) {
    return n % 2 == 0;
  }

  return (
    <div id="collection-grid">
      <div className="text-center px-8 md:px-12 md:mt-12 pb-4">
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-center pb-4">
          {data.title}
        </h2>
        <p>{data.subtitle}</p>
      </div>
      <div
        className={`grid min-h-[300px] ${
          isEven(collections.length) ? "grid-cols-2" : "grid-cols-1"
        } gap-4 p-4 md:min-h-[400px] md:grid-cols-3`}
        key={data._key}
      >
        {collections.map((collection: any) => (
          <Link
            href={collection?.to ?? "/"}
            className={collectionClass}
            key={collection._key}
          >
            <Image
              className={imageClass}
              src={imageBuilder(collection.image)
                .height(800)
                .format("webp")
                .url()}
              alt=""
              loading={data.loading ?? "lazy"}
              sizes={"33vw"}
              fill
            />
            <span className="z-10 text-shadow relative text-center text-2xl text-white md:text-3xl lg:text-5xl">
              {collection.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Marquee({ data }: { data: any }) {
  return (
    <div className="flex select-none gap-[1rem] overflow-hidden py-4">
      <div className="scroll flex min-w-full flex-shrink-0 items-center justify-around gap-[1rem]">
        {data.items.map((item: any) => (
          <Fragment key={crypto.randomUUID()}>
            <div>
              <span className="font-heading text-4xl uppercase">{item}</span>
            </div>
            <div>
              <img
                src={imageBuilder(data.icon).url()}
                width="36px"
                height="36px"
                alt="decorative icon"
                loading="lazy"
              />
            </div>
          </Fragment>
        ))}
        {data.items.map((item: any) => (
          <Fragment key={crypto.randomUUID()}>
            <div>
              <span className="font-heading text-4xl uppercase">{item}</span>
            </div>
            <div>
              <img
                src={imageBuilder(data.icon).url()}
                width="36px"
                height="36px"
                alt="decorative icon"
                loading="lazy"
              />
            </div>
          </Fragment>
        ))}
      </div>
      <div className="scroll flex min-w-full flex-shrink-0 items-center justify-around gap-[1rem]">
        {data.items.map((item: any) => (
          <Fragment key={crypto.randomUUID()}>
            <div>
              <span className="font-heading text-4xl uppercase">{item}</span>
            </div>
            <div>
              <img
                src={imageBuilder(data.icon).url()}
                width="36px"
                height="36px"
                alt="decorative icon"
                loading="lazy"
              />
            </div>
          </Fragment>
        ))}
        {data.items.map((item: any) => (
          <Fragment key={crypto.randomUUID()}>
            <div>
              <span className="font-heading text-4xl uppercase">{item}</span>
            </div>
            <div>
              <img
                src={imageBuilder(data.icon).url()}
                width="36px"
                height="36px"
                alt="decorative icon"
                loading="lazy"
              />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function FAQs({ data }: { data: any }) {
  return (
    <div className="flex flex-col gap-2 mx-auto max-w-prose p-4 md:p-8 lg:p-12">
      <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-center pb-4">
        {data.title}
      </h2>
      {data.faqs.map((faq: any) => (
        <Accordion faq={faq} key={faq._id} />
      ))}
    </div>
  );
}
const Accordion = ({ faq }: { faq: { question: string; answer: string } }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col pt-2 border-2 rounded py-2 px-4">
      <div
        className="flex flex-row gap-2 cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-heading text-xl">{faq.question}</h3>
        <svg
          className={`w-6 h-6 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <div
        className={`overflow-hidden transition-all ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="font-body text-base pt-2">{faq.answer}</p>
      </div>
    </div>
  );
};
