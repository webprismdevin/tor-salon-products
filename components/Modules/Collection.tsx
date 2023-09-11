"use client";
import graphClient from "../../lib/graph-client";
import { collection_query } from "../../pages/collection/[handle]";
import { useEffect, useState } from "react";
import ProductCard from "./ProductGrid_v2/ProductCard";

export type CollectionResponse = {
  collection: {
    products: {
      edges: any[];
    };
  };
};

export default function Collection({ data }: any) {
  const [products, setProducts] = useState<any[] | null>(null);

  const getProducts = async () => {
    const { collection } = (await graphClient.request(collection_query, {
      handle: data.handle,
    })) as CollectionResponse;

    setProducts(collection.products.edges);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div
      className="flex flex-col gap-2 w-full py-4 md:py-8 text-center md:text-left no-scrollbar"
      style={{
        background: data.colorTheme?.background?.hex ?? "#ffffff",
        color: data.colorTheme?.text?.hex ?? "#121212",
      }}
    >
      <div className="px-9">
        <h2
          className="font-heading text-2xl md:text-3xl lg:text-4xl pb-4"
          style={{
            color: data.colorTheme?.text?.hex ?? "#121212",
          }}
        >
          {data.title}
        </h2>
        <p>{data.subtitle}</p>
      </div>
      <div className="flex snap-x overflow-auto gap-4 md:gap-12">
        {products && products.map((product: any) => {
          return (
            <div
              className="snap-center first:ml-8 last:mr-8"
              key={product.node.id}
            >
              <ProductCard
                product={{
                  gid: product.node.id,
                  title: product.node.title,
                  featuredImage: product.node.images.edges[0].node.url,
                  price: product.node.priceRange.minVariantPrice.amount,
                  handle: product.node.handle,
                  variantId: product.node.variants.edges[0].node.id,
                }}
              />
            </div>
          );
        })}
        {
          !products && (<>
            <SkeletonCard/>
            <SkeletonCard/>
            <SkeletonCard/>
            <SkeletonCard/>
            <SkeletonCard/>
          </>

          )
        }
      </div>
    </div>
  );
}


import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="snap-center first:ml-8 last:mr-8">
      <div style={{ backgroundColor: '#eee' }} className="w-[168px] h-[285px] md:w-[280px] md:h-[380px] animate-pulse rounded" />
    </div>
  );
};
