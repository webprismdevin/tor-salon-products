import React, { Fragment, Suspense } from "react";
import { imageBuilder } from "../../lib/sanity";
import Image from "next/image";
import PortableText from "../PortableText/PortableText";
import Slides from "./Slides_v2/index";
import dynamic from "next/dynamic";
import ProductGrid from "./ProductGrid_v2";
import { Button } from "../Button";
import CollectionGrid from "./CollectionGrid";
import Collection from "./Collection";
import Hero from "./Hero";
import FAQs from "./FAQs";
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
            return <ReviewCarousel data={module} key={module._key} />;
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
      className={`flex w-full md:flex-row  ${
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
        <div className="mt-4 flex flex-col items-start gap-4">
          {data?.content && <PortableText blocks={data.content} />}
          {data.cta && (
            <CallToAction cta={data.cta} colorTheme={data.colorTheme} />
          )}
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

export type CallToActionProps = {
  text: string;
  to: string;
  useRelativePath?: boolean;
  relativeLink?: string;
};

export type ColorThemeProps = {
  background?: {
    hex: string;
  };
  text?: {
    hex: string;
  };
};

export function CallToAction({
  cta,
  colorTheme,
}: {
  cta: CallToActionProps;
  colorTheme?: ColorThemeProps;
}) {
  const { text, to, useRelativePath, relativeLink } = cta;

  return (
    <div>
      {cta?.text && (
        <Button
          variant="primary"
          className="py-3 px-4"
          style={{
            backgroundColor: colorTheme?.text?.hex ?? "#121212",
            color: colorTheme?.background?.hex ?? "#ffffff",
          }}
          href={useRelativePath ? relativeLink : to}
        >
          {text}
        </Button>
      )}
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
