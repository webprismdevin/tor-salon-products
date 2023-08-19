// web/lib/sanity.js

import sanityClient from "@sanity/client";
import createImageUrlBuilder from "@sanity/image-url";
import groq from "groq";

const config = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/

  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  useCdn: process.env.NODE_ENV === "production",
  apiVersion: "2022-02-04",

  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
};

export const imageBuilder = (source: any) =>
  createImageUrlBuilder(config).image(source);

// Set up the client for fetching data in the getProps page functions
export const sanity = sanityClient(config);
// Set up a preview client with serverless authentication for drafts
export const previewClient = sanityClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Helper function for easily switching between normal client and preview client
export const getClient = (usePreview: boolean | undefined) =>
  usePreview ? previewClient : sanityClient;

export const settingsQuery = `*[ _type == "settings" ][0]
  { 
    ...,
    menu { 
      mega_menu[]{
        ...,
        _type == 'collectionGroup' => @{ 
          collectionLinks[]-> 
        },
        _type != 'collectionGroup' => @
      },
      links[]{
        _type == 'reference' => @->,
        _type != 'reference' => @,
      }
    } 
  }`;

export const COLLECTION = groq`
  _id,
  "gid": collection->store.gid,
  "slug": "/collection/" + collection->store.slug.current,
  "vector": collection->vector.asset->url,
`;

const COLLECTION_LINK = groq`
"to":'/collection/' + collection->store.slug.current`;

export const LINK = groq`
  "documentType": _type,
  (_type == "collection") => {
    "slug": "/collection/" + store.slug.current,
  },
  (_type == "home") => {
    "slug": "/",
  },
  (_type == "page") => {
    "slug": "/pages/" + slug.current,
  },
  (_type == "product" && store.isEnabled && store.status == "active") => {
    "slug": "/products/" + store.slug.current,
  },
`;

export const LINK_INTERNAL = groq`
  _key,
  _type,
  title,
  ...reference-> {
    ${LINK}
  }
`;

export const COLLECTION_GROUP = groq`
  _key,
  _type,
  ...,
  megaMenuFeatures[]{
    _key,
    title,
    image,
    link->{
      ${LINK}
    }
  },
  collectionLinks[]{
    _key,
    "title": displayTitle,
    ${COLLECTION}
  },
  collectionProducts->{
    ${COLLECTION}
  },
  megaMenuTitle {
    title,
    ${COLLECTION_LINK}
  },
  title,
`;

export const LINK_EXTERNAL = groq`
    _key,
    _type,
    newWindow,
    title,
    url,
`;

export const CTA_FRAGMENT = groq`
  cta {
    "text": title,
    ...,
    ...reference-> {
      "documentType": _type,
      (_type == "collection") => {
        "to": "/collection/" + store.slug.current,
      },
      (_type == "home") => {
        "to": "/",
      },
      (_type == "page") => {
        "to": "/pages/" + slug.current,
      },
      (_type == "product" && store.status == "active") => {
        "to": "/product/" + store.slug.current,
      },
    }
  }
`;

//homepage fragments
export const HERO_FRAGMENT = groq`
    ...,
    image {
      ...,
      "height": asset-> metadata.dimensions.height,
      "width": asset-> metadata.dimensions.width
    },
    ${CTA_FRAGMENT}
`;

export const COLLECTION_GRID_FRAGMENT = groq`
(_type == 'component.collectionGrid') => {
  ...,
  collections[]{
    ...,
    ${COLLECTION_LINK}
  }
}
`;

export const MODULE_FRAGMENT = groq`
modules[]{
  ...,
  colorTheme->,
  _type,
  (_type == 'component.swimlane') => {
      "gid": collection->store.gid,
      "to": "/collection/" + collection->store.slug.current,
      "handle": collection->store.slug.current,
  },
  (_type == 'component.hero') => {
    ${HERO_FRAGMENT}
  },
  (_type == 'component.slides') => {
    ...,
    slides[]{
      ...,
      ${CTA_FRAGMENT},
      image {
        ...,
        "height": asset-> metadata.dimensions.height,
        "width": asset-> metadata.dimensions.width
      },
      image2 {
        ...,
        "height": asset-> metadata.dimensions.height,
        "width": asset-> metadata.dimensions.width
      }
    }
  },
  ${COLLECTION_GRID_FRAGMENT},
  (_type == 'component.textWithImage') => {
    ...,
    colorTheme->,
    ${CTA_FRAGMENT}
  },
  (_type == 'component.faq') => {
    ...,
    faqs[]->{
      _id,
      question,
      answer
    }
  },
  (_type == 'component.collection') => {
    ...,
    "handle": collection->store.slug.current,
    ${COLLECTION}
  },
  (_type == 'component.productGrid') => {
    ...,
    products[]->{
      "gid": store.gid,
      "to": "/product/" + store.slug.current,
      "featuredImage": store.previewImageUrl,
      "title": store.title,
      "priceRange": store.priceRange,
      "compareAtPrice": store.compareAtPrice,
      "handle": store.slug.current
    },
    ${CTA_FRAGMENT}
  },
}
`;
