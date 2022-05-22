
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    name: 'landingSection',
    title: 'Landing Page Section',
    type: 'document',
    fields: [
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
          name: 'body',
          title: 'Section Body',
          type: 'blockContent'
      },
      {
          name: 'image',
          title: 'Image',
          type: 'image'
      },
      {
          name: 'layout',
          title: 'Section Layout',
          type: 'string',
          description: 'For "column" layouts, use a 16:9 apsect ratio image',
            options: {
                list: [{
                    title: 'Row (image left)',
                    value: 'row'
                }, {
                    title: 'Row (image right)',
                    value: 'row-reverse'
                },{
                    title: 'Column (full width)',
                    value: 'column'
                }],
                layout: 'dropdown'
            }
      }
    ],
    initialValue: {
    layout: 'row'      
    },
    preview: {
        select: {
          title: 'heading'
        },
      },
  }