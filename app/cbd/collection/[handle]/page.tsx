import { CbdBuyButton } from "../../product/[handle]/cbdBuyButton";
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

export default async function Page({ params }: { params: { handle: string } }) {
  const data = await getCollection(params.handle);

  console.log(data.collection.products);

  return (
    <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 py-8 md:py-12 lg:py-16 place-items-center">
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
          <CbdBuyButton
            checkoutUrl={product.checkoutUrl}
            handle={product.slug.current}
          >
            ${product.priceRange.price} | Buy Now
          </CbdBuyButton>
        </Card>
      ))}
    </div>
  );
}
