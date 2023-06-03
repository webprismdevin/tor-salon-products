import React, { Fragment } from "react";
import BigTextBlock from "./Page/Modules/BigTextBlock";
import FeaturedInformation from "./Page/Modules/FeaturedInformation";
import ReviewSlider from "./ReviewSlider";
import SecondBuyButton from "./Page/Modules/SecondBuyButton";
import HairTypes from "./Page/Modules/HairTypes";
import ReviewSection from "./Page/Modules/ReviewSection";
import EmailSignup from "./Page/Modules/EmailSignup";
import { imageBuilder } from "lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { SanityImageAssetDocument } from "@sanity/client";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import PortableText from "components/PortableText/PortableText";
import Slides from "./Page/Slides";

export default function Modules({ modules, product }: any) {
  return (
    <React.Fragment>
      {modules.map((module: any) => {
        switch (module._type) {
          case "module.featuredInformation":
            return <FeaturedInformation key={module._key} module={module} />;
          case "module.bigTextBlock":
            return <BigTextBlock key={module._key} module={module} />;
          case "module.reviewSlider":
            return <ReviewSlider key={module._key} reviews={module.reviews} />;
          case "additionalBuyButton":
            return <SecondBuyButton product={product} key={module._key} />;
          case "hairTypeSection":
            return <HairTypes key={module._key} />;
          case "reviewSection":
            return <ReviewSection key={module._key} />;
          case "module.emailSignup":
            return <EmailSignup key={module._key} {...module} />;
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
        } z-1 relative self-center text-contrast max-w-prose`}
      >
        <p className="text-shadow text-xl font-bold lg:text-2xl">{caption}</p>
        <h2 className="text-shadow mb-4 font-heading text-4xl uppercase lg:text-6xl">
          {title}
        </h2>
        {cta?.to && <Link className="px-4 py-2 rounded bg-black text-white font-bold" href={cta.to}>{cta.text}</Link>}
      </div>
    </div>
  );
}

function TextWithImage({ data }: { data: any }) {
  return (
    <div
      className={`flex flex-col w-full lg:flex-row ${
        data.image ? "justify-between" : ""
      } ${data.layout === "right" ? "lg:flex-row-reverse" : ""}`}
      key={data._key}
    >
      <div
        className={`max-w-full grow-1 self-center p-8 ${
          data.image ? "lg:max-w-[50%]" : "lg:max-w-screen-lg mx-auto"
        } lg:p-24`}
      >
        <div className={`${data.image ?? "justify-center text-center"}`}>
          <p className="font-heading text-base">{data.caption}</p>
          <p className="font-heading text-2xl md:text-3xl lg:text-4xl">
            {data.title}
          </p>
        </div>
        <div className="mt-4">
          {data?.content && <PortableText blocks={data.content} />}
          {data.cta && (
            <div className="mt-4">
              <Link href={data.cta.to} className="border-b-2 border-white">
                Learn more
              </Link>
            </div>
          )}
        </div>
      </div>
      {data.image && (
        <div className="relative aspect-square min-w-[50%]">
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

function CollectionGrid({ data }: { data: any }) {
  const { collections } = data;

  const imageClass =
    "absolute left-0 top-0 z-0 h-full w-full object-cover object-center";

  const collectionClass =
    "relative grid place-items-center font-heading text-2xl uppercase min-h-[100px] md:min-h-[200px]";

  function isEven(n: number) {
    return n % 2 == 0;
  }

  return (
    <div
      className={`grid min-h-[300px] ${
        isEven(collections.length) ? "grid-cols-2" : "grid-cols-1"
      } gap-4 p-4 md:min-h-[400px] md:grid-cols-3`}
      key={data._key}
    >
      {collections.map((collection: any) => (
        <Link
          href={collection.to}
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
