/* eslint-disable import/no-anonymous-default-export */
// studio/schemas/about.js
export default {
  name: "about",
  title: "About",
  type: "document",

  // These actions define what users can do with this document.
  // Notice how "delete" is not available in this array.
  // This means, users can't delete this document
  // from within the studio
  __experimental_actions: ["update", "create", "publish"],

  fields: [
    {
      name: "seo_title",
      title: "SEO: Page title",
      type: "string"
    },
    {
      name: "seo_description",
      title: "SEO: Meta Description",
      type: "text"
    },
    {
      name: "mainHeading",
      title: "Main Heading",
      type: "string",
    },
    {
      name: 'mainParagraph',
      title: 'Main Paragraph',
      type: 'blockContent'
    },
    {
      name: 'secTwoHeading',
      title: 'Section 2 Heading',
      type: 'string'
    },
    {
      name: 'secTwoParagraph',
      title: 'Section 2 Paragraph',
      type: 'blockContent'
    },
    {
      name: 'secThreeHeading',
      title: 'Section 3 Heading',
      type: 'string'
    },
    {
      name: 'secThreeParagraph',
      title: 'Section 3 Paragraph',
      type: 'blockContent'
    },
    {
      name: 'secThreeButtonText',
      title: 'Section 3 Button Text',
      type: 'string'
    },
    {
      name: 'secThreeButtonLink',
      title: 'Section 3 Button Link',
      type: 'url'
    },
    {
      name: 'secThreeButtonTarget',
      title: 'Section 3 Button Target',
      type: 'string',
      options: {
        list: [{ title: 'Same Tab', value: '_self' }, { title: 'New Tab', value: '_blank'}],
      },
      initialValue: '_self' 
    },
    {
      name: 'secFourHeading',
      title: 'Section 4 Main Heading',
      type: 'string'
    },
    {
      name: 'secFourColOneParagraph',
      title: 'Section 4 Column 1 Paragraph',
      type: 'blockContent'
    },
    {
      name: 'secFourColTwoHeading',
      title: 'Section 4 Column 2 Heading',
      type: 'string'
    },
    {
      name: 'secFourColTwoParagraph',
      title: 'Section 4 Column 2 Paragraph',
      type: 'blockContent'
    },
    {
      name: 'secFiveHeading',
      title: 'Section 4 Column 2 Heading',
      type: 'string'
    },
    {
      name: 'secFiveParagraph',
      title: 'Section 5 Paragraph',
      type: 'blockContent'
    },
  ],
};