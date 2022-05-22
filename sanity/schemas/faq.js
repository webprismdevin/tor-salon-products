import { ImCheckmark } from "react-icons/im";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: ImCheckmark,
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
    },
    {
      name: 'link',
      title: 'Learn More link',
      type: 'url',
    },
  ],
}