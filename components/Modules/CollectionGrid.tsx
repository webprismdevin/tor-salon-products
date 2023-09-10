import { imageBuilder } from "lib/sanity";
import Image from "next/image";
import Link from "next/link";


export default function CollectionGrid({ data }: { data: any }) {
    const { collections } = data;
  
    const imageClass =
      "absolute left-0 top-0 z-0 h-full w-full object-cover object-center";
  
    const collectionClass =
      "relative grid place-items-center font-heading text-2xl uppercase min-h-[150px] md:min-h-[200px]";
  
    function isEven(n: number) {
      return n % 2 == 0;
    }
  
    return (
      <div
        id="collection-grid"
        className={!data.title && !data.subtitle ? "" : "py-4 md:py-8"}
        style={{
          backgroundColor: data.colorTheme?.background?.hex ?? "#ffffff",
          color: data.colorTheme?.text?.hex ?? "#121212",
        }}
      >
        <div className="text-center px-8 md:px-12 pb-4">
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