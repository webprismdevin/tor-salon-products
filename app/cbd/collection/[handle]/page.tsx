import { CbdCheckout } from "../../product/[handle]/CbdCheckout";
import Card from "../../../../components/Card";
import { Heading } from "../../../../components/Heading";
import { imageBuilder, sanity } from "../../../../lib/sanity";

const getCollection = async (handle: string) => {
  const collection = await sanity.fetch(
    `*[_type == "cbdCollection" && slug.current == $handle][0]{
      ...,
      products[]->
    }`,
    { handle }
  );
  return { collection };
};

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}) {
  const data = await getCollection(params.handle);

  return {
    title: data.collection.seo?.title ?? data.collection.title,
    description:
      data.collection.seo?.description ?? data.collection.description,
  };
}

export default async function Page({ params }: { params: { handle: string } }) {
  const data = await getCollection(params.handle);

  return (
    <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 py-8 px-4 md:py-12 lg:py-16 place-items-center">
      <Heading as="h1" className="w-full text-left col-span-2 md:col-span-3">
        {data.collection.title}
      </Heading>
      {data.collection.products.map((product: any) => (
        <Card
          key={product._key}
          content={{
            title: product.title,
            imageUrl: imageBuilder(product.images[0]).url(),
            path: `/cbd/product/${product.slug.current}`,
          }}
        >
          <CbdCheckout
            checkoutUrl={product.checkoutUrl}
            handle={product.slug.current}
          >
            <div className="whitespace-nowrap font-heading text-lg md:text-xl">
              {product.priceRange.price} | Buy&nbsp;<span className="hidden md:inline">Now</span>
            </div>
          </CbdCheckout>
        </Card>
      ))}
    </div>
  );
}

export const revalidate = 600;