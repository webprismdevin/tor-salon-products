import { ImLocation } from "react-icons/im";

export default {
  name: 'salon',
  title: 'Salons',
  type: 'document',
  icon: ImLocation,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'street',
      title: 'Street Address',
      type: 'string',
    },
    {
        name: 'city',
        title: 'City',
        type: 'string',
    },
    {
        name: 'state',
        title: 'State',
        type: 'string',
    },
    {
        name: 'zip',
        title: 'ZIP',
        type: 'string',
    },
    {
        name: 'phone',
        title: 'Phone Number',
        type: 'string',
    },
    {
        name: 'website',
        title: 'Website',
        type: 'url',
    },
  ],
}
