import { RiPagesLine } from 'react-icons/ri'
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  name: 'landing',
  title: 'Landing Page',
  type: 'document',
  icon: RiPagesLine,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
    },
    {
      name: 'socialProof',
      title: 'Header social proof',
      type: 'string'
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Image alt text',
          type: 'string'
        }
      ]
    },
    {
      name: 'buttonOne',
      title: 'Button One',
      type: 'string'
    },
    {
      name: 'buttonSubtext',
      title: 'Button Sub Text',
      description: 'OPTIONAL: Put a little note about the price.',
      type: 'string'
    },
    {
      name: 'sections',
      title: 'Sections (below the fold)',
      type: 'array',
      of: [{type: 'reference', to: { type: 'landingSection'}}]
    },
    {
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      description: 'Select 4 reviews',
      of: [{type: 'reference', to: {type: 'review'}}]
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{type: 'reference', to: { type: 'faq'}}]
    },
    {
      name: 'ctaSupertext',
      title: 'Call To Action Supertext',
      type: 'string'
    },
    {
      name: 'cta',
      title: 'Call to Action',
      type: 'string'
    },
    {
      name: 'ctaSubtext',
      title: 'Call To Action Subtext',
      type: 'string'
    },
    {
      name: 'product',
      title: 'Product handle',
      description: 'Handle of the product for sale on this page',
      type: 'string'
    },
    {
      name: 'variantPrompt',
      title: 'Variant Prompt',
      type: 'string'
    },
    {
      name: 'discountCode',
      title: 'Automatic Discount',
      type: 'string'
    }
  ],
}