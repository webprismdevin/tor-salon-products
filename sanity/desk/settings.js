import S from '@sanity/desk-tool/structure-builder'

// prettier-ignore
export const settings = S.listItem()
  .title('Settings')
  .schemaType('siteSettings')
  .child(
    S.editor()
      .title('Settings')
      .schemaType('siteSettings')
      .documentId('siteSettings')
  )
