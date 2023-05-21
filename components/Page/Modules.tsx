import React, { Fragment } from "react";
import BigTextBlock from "./Modules/BigTextBlock";
import FeaturedInformation from "./Modules/FeaturedInformation";
import ReviewSlider from "../ReviewSlider";
import SecondBuyButton from "./Modules/SecondBuyButton";
import HairTypes from "./Modules/HairTypes";
import ReviewSection from "./Modules/ReviewSection";
import EmailSignup from "./Modules/EmailSignup";
import { imageBuilder } from "lib/sanity";
import Image from "next/image";
import Link from "next/link";
import PortableText from "components/PortableText/PortableText";
import Slides from "./Slides";

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
            return <Hero key={module._key} {...module} />;
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

const Hero = ({ title, caption, image, layout: direction }: any) => {
  return (
    <div className="relative h-[500px] flex items-center text-white">
      <Image
        src={imageBuilder(image).url()}
        alt={image?.alt}
        fill
        className="object-cover object-center z-0"
      />
      <div className="z-10 p-8 md:p-12 lg:p-16">
        <h2 className="text-2xl">{caption}</h2>
        <h1 className="text-5xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

function TextWithImage({ data }: { data: any }) {
  return (
    <div
      className={`flex flex-col lg:flex-row ${data.image ?? "justify-center"} ${
        data.layout === "right" && "lg:flex-row-reverse"
      }`}
      key={data._key}
    >
      <div
        className={`max-w-full self-center p-8 ${
          data.image ? "lg:max-w-[50%]" : "lg:max-w-screen-lg"
        } lg:p-24`}
      >
        <div className={`${data.image ?? "justify-center text-center"}`}>
          <p className="font-heading text-3xl md:text-5xl lg:text-7xl">
            {data.title}
          </p>
          <p className="font-heading text-xl md:text-3xl lg:text-5xl">
            {data.caption}
          </p>
        </div>
        <div className="mt-4">
          {data?.content && (
            <div className="max-w-prose">
              <PortableText blocks={data.content} />
            </div>
          )}
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
        <div className=" relative aspect-square min-w-[50%]">
          <Image
            src={imageBuilder(data.image).format("webp").url()}
            alt={data.image.alt ? data.image.alt : "Image"}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="absolute h-full w-full object-cover object-center"
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
          // href={collection.to}
          href="/"
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
