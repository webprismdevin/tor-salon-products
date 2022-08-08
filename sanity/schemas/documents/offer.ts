export default {
  name: "offer",
  title: "Offer",
  type: "document",
  groups: [
    {
      name: "seo",
    },
    {
      name: "content",
    },
    {
      name: "products",
    },
  ],
  fields: [
    {
      name: "title",
      type: "string",
      group: "content",
    },
    {
      name: "subheading",
      type: "text",
      group: "content",
    },
    {
      name: "product",
      type: "array",
      of: [{ type: "product",}],
    },
  ],
};
