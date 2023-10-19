import { IconSearch } from "components/Header";
import { Heading } from "components/Heading";
import ProductCard from "components/Modules/ProductGrid_v2/ProductCard";
import { PRODUCTS_FRAGMENT } from "lib/get-products";
import graphClient from "lib/graph-client";

async function searchProducts(query: string) {
  if (!query) return undefined;

  const response = await graphClient.request(GRAPHQL_QUERY, {
    searchTerm: query,
  });

  return response;
}

export default async function Page({ searchParams }: { searchParams: any }) {
  const data = await searchProducts(searchParams?.q);

  return (
    <div className="grid col-span-2 md:grid-cols-3 gap-4 md:gap-12 place-items-center mx-auto p-4 md:p-12">
      <div className="place-self-start relative">
        <span className="absolute inset-y-0 left-0 items-center pl-2 hidden md:flex">
          <button
            type="submit"
            className="p-1 focus:outline-none focus:shadow-outline"
          >
            <IconSearch />
          </button>
        </span>
        <form>
          <input
            type="search"
            name="q"
            defaultValue={searchParams?.q}
            className="py-2 text-sm bg-transparent rounded-md pl-10 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            placeholder="Search..."
            autoComplete="off"
          />
        </form>
      </div>
      {searchParams?.q && (
        <div className="col-span-2 md:col-span-3 w-full text-left grid gap-4">
          <p>Search results for</p>
          <Heading as="h2">{searchParams.q}</Heading>
        </div>
      )}
      {data &&
        data.products.edges.map((product: any) => {
          const { node } = product;

          return (
            <ProductCard
              key={node.id}
              product={{
                gid: node.id,
                title: node.title,
                featuredImage: node.images.edges[0].node.url,
                price: node.priceRange.minVariantPrice.amount,
                handle: node.handle,
                variantId: node.variants.edges[0].node.id,
              }}
            />
          );
        })}
    </div>
  );
}

const GRAPHQL_QUERY = `query($searchTerm: String!) {
    products(query: $searchTerm, first: 100) {
        ${PRODUCTS_FRAGMENT}
    }
}`;
