import { SanityImageAssetDocument } from "@sanity/client";
import { CallToAction, CallToActionProps } from "../Modules";
import Image from "next/image";
import { imageBuilder } from "lib/sanity";
import { Parallax } from "./Parallax";

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
  cta?: CallToActionProps;
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

export default function Hero({ data }: { data: Hero }) {
  const { image, title, caption, cta, layout, size } = data;

  return (
    <div
      className={`flex-column align-center relative flex ${
        size === "small" ? "h-[500px]" : "h-[700px]"
      } overflow-hidden p-8 lg:p-24 ${layout === "right" && "justify-end"} ${
        layout === "center" && "justify-center text-center"
      }`}
      style={{
        backgroundColor: data.colorTheme?.background?.hex ?? "#ffffff",
        color: data.colorTheme?.text?.hex ?? "#121212",
      }}
    >
      <Parallax>
        <Image
          src={imageBuilder(image.asset).format("webp").quality(80).url()}
          sizes={"100vw"}
          className="mx-auto mt-0 min-h-full w-auto object-cover"
          alt={image.alt}
          fill
          loading={image.loading ? image.loading : "lazy"}
        />
      </Parallax>
      <div
        className={`${
          layout === "right" && "text-right"
        } z-1 relative self-center max-w-prose`}
      >
        <p className="text-shadow text-xl lg:text-2xl">{caption}</p>
        <h2 className="text-shadow mb-4 font-heading text-4xl uppercase lg:text-6xl">
          {title}
        </h2>
        {data.cta && (
          <CallToAction cta={data.cta} colorTheme={data.colorTheme} />
        )}
      </div>
    </div>
  );
}
