import { RiStarLine } from 'react-icons/ri'
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    name: 'review',
    title: 'Reviews',
    type: 'document',
    icon: RiStarLine,
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
    preview: {
      select: {
        title: 'title',
        subtitle: 'name'
      }
    }
  }