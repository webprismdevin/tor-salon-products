export default {
  name: "wholesale",
  type: "document",
  __experimental_actions: ["update", "create", "publish"],
  groups: [
    {
      name: "content",
      default: true,
    },
    {
      name: "seo",
    },
    {
      name: "files",
    },
  ],
  fields: [
    {
      name: "title",
      type: "string",
      group: "content",
    },
    {
        name: 'subtitle',
        type: 'string',
        group: 'content'
    },
    {
      name: "retailGuide",
      type: "file",
      group: "files",
    },
    {
      name: "wholesaleGuide",
      type: "file",
      group: "files",
    },
  ],
};
