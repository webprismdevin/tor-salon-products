import S from '@sanity/desk-tool/structure-builder'

// prettier-ignore
export const home = S.listItem()
  .title('Home')
  .schemaType('homepage')
  .child(
    S.editor()
      .title('Home')
      .schemaType('homepage')
      .documentId('homepage')
  )
