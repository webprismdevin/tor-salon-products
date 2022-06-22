export default {
    name: 'siteSettings',
    type: 'document',
    __experimental_actions: ["update", "create", "publish"],
    groups: [{
        name: 'settings',
        default: true
    },{
        name: 'seo'
    }],
    fields: [
        {
            name: 'banner',
            title: 'Homepage Banner',
            type: 'array',
            description: 'Each string in this list will be cycled in the banner at the top of the homepage.',
            of: [{type: 'string'}]
          },
    ]
}