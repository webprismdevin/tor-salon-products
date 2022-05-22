/* eslint-disable import/no-anonymous-default-export */
// studio/schemas/about.js
export default {
    name: "help",
    title: "Help",
    type: "document",
  
    // These actions define what users can do with this document.
    // Notice how "delete" is not available in this array.
    // This means, users can't delete this document
    // from within the studio
    __experimental_actions: ["update", "create", "publish"],
  
    fields: [
      {
        title: "Hero Heading",
        description:
          "This heading will appear at the top of the page.",
        type: "string",
        name: "heading",
      },
      {
        title: "Subheading",
        description:
          "This subheading will appeart at the top of the page. A great place to put a help phone number, email address, or other helpful contact info.",
        type: "string",
        name: "subheading",
      },
      // {
      //   title: "Hero Button",
      //   name: "heroButton",
      //   type: "string",
      //   description: "Text for the button in the hero section. If no text is set, the button will be hidden."
      // },
      // {
      //   name: 'paragraphOne',
      //   type: 'text',
      //   title: 'First paragraph after the hero section.'
      // },
      {
        name: 'faqs',
        title: 'Frequently Asked Questions',
        type: 'array',
        of: [{type: 'reference', to: {type: 'faq'}}],
      },
    ],
  };