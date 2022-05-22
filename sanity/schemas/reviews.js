
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'review',
        title: 'Review',
        type: 'text',
      },
      {
          name: 'name',
          title: 'Name',
          type: 'string'
      },
      {
          name: 'rating',
          title: 'Rating',
          type: 'rating'
      }
    ],
  }