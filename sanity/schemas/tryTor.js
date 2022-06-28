export default {
  name: "tryTor",
  type: "document",
  __experimental_actions: ["update", "create", "publish"],
  groups: [
    {
      name: "seo",
    },
    {
      name: "content",
      default: true,
    },
  ],
  fields: [
    {
      name: "hero",
      type: "object",
      group: "content",
      fields: [
        {
          name: "title",
          type: "string",
        },
        {
          name: "subtext",
          type: "string",
        },
        {
          name: "text",
          type: "text",
        },
        {
          name: "image",
          type: "image",
          options: {
            hotspot: true,
          },
        },
        {
          name: "testimonial",
          type: "object",
          fields: [
            {
              name: "text",
              type: "text",
              description: "Testimonial content, do not include quotation marks."
            },
            {
              name: "name",
              type: "string",
            },
          ],
        },
      ],
    },
  ],
};
