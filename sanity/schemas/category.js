import { ImPriceTags } from "react-icons/im";

export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: ImPriceTags,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
}
