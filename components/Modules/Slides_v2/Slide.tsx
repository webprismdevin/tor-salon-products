import { Button } from "components/Button";
import { imageBuilder } from "lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { SlideProps } from "../Slides";

export default function Slide({ slide }: { slide: SlideProps }) {
  const { image, colorTheme } = slide;

  return (
    <div
      className="h-[700px] w-full relative overflow-hidden flex sm:p-4 md:p-24"
      style={{
        justifyContent: slide?.contentJustify ?? "flex-start",
        alignItems: slide?.contentAlign ?? "center",
      }}
    >
      <Image
        blurDataURL={imageBuilder(image).height(10).width(10).url()}
        src={imageBuilder(image)
          .width(1200)
          .height(1200)
          .format("webp")
          .quality(90)
          .url()}
        fill
        style={{
          objectFit: "cover",
        }}
        sizes="100vw"
        alt={image?.alt}
      />
      <div
        className="z-10"
        style={{
          color: colorTheme?.text?.hex ?? "#ffffff",
        }}
      >
        <p className="text-shadow mb-4">{slide.caption}</p>
        <h2 className="text-shadow mb-6 max-w-xl font-heading text-4xl uppercase md:text-5xl lg:text-6xl">
          {slide.title}
        </h2>
        <Button
          style={{
            backgroundColor: colorTheme?.background?.hex ?? "#121212",
            color: colorTheme?.text?.hex ?? "#ffffff",
          }}
          href={slide.cta?.to ?? "#"}
        >
          {slide.cta?.text ?? "Shop now"}
        </Button>
      </div>
    </div>
  );
}
