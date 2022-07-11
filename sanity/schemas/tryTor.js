export default {
  name: "tryTor",
  type: "document",
  __experimental_actions: ["update", "create", "publish"],
  groups: [
    {
      name: "content",
      title: 'Content',
      default: true,
    },
    {
      name: "seo",
      title: "SEO"
    }
  ],
  fields: [
    {
      name: 'pageTitle',
      type: 'string',
      group: 'seo'
    },
    {
      name: 'metaDescription',
      type: 'text',
      group: 'seo'
    },
    {
      name: "hero",
      type: "object",
      group: "content",
      fields: [
        {
          name: "title",
          type: "blockContent",
        },
        {
          name: 'subtitle',
          type: 'blockContent'
        },
        {
          name: "subtext",
          type: "string",
        },
        {
          name: "text",
          type: "text",
        }
      ],
    },
    {
      name: 'reviews',
      type: 'array',
      group: 'content',
      of: [{type: 'reference', to: {type: 'review'}}]

    },
    {
      name: 'about',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'title',
          type: 'string'
        },
        {
          name: 'text',
          type: 'text'
        }
      ]
    }
  ],
};
