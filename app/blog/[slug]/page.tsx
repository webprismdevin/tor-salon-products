import { Heading } from "components/Heading";
import RichContent from "components/RichContent";
import groq from "groq";
import { imageBuilder, sanity } from "lib/sanity";
import Image from "next/image";

const getBlogPost = async (slug: string) => {
  const res = sanity.fetch(blogPostQuery, { slug: slug });

  return res;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const page = await getBlogPost(params.slug);

  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? page.description,
    // todo: add OG image
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getBlogPost(params.slug);

  return (
    <div>
      <Image
        src={imageBuilder(data.mainImage).height(300).width(1600).url()}
        quality={100}
        width={1600}
        height={300}
        className="w-full aspect-[16/3]"
        alt=""
      />
      <div className="max-w-prose mx-auto grid gap-8 mt-8 md:mt-12 lg:mt-16">
        <Heading as="h1" size="h3" className="text-center">
          {data.title}
        </Heading>
        <div className="max-w-prose mx-auto">
          <RichContent blocks={data.body} />
        </div>
      </div>
    </div>
  );
}
const blogPostQuery = groq`*[ _type == "post" && slug.current == $slug][0]{
    ...,
    body[] {
      ...,

      markDefs[] {
        ...,
        productWithVariant {
          ...,
          product-> {
            ...,
            store {
              ...,
              variants[]->
            }
          },
          variant->
        }
      },
    },
  }`;
