export interface SanityImageReference {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface SanityColorTheme {
  background: {
    hex: string;
  };
  text: {
    hex: string;
  };
}

export interface CollectionLink {
  _id: string;
  _type: "collection";
  store: {
    descriptionHtml: string;
    title: string;
    imageUrl: string;
    slug: {
      _type: "slug";
      current: string;
    };
    gid: string;
  };
}

export type SanityProductWithVariant = {
  _id: string;
  _key?: string;
  _type: 'productWithVariant';
  colorTheme: SanityColorTheme;
  product: any;
  variant: any;
};