import S from '@sanity/desk-tool/structure-builder'

// prettier-ignore
export const wholesale = S.listItem()
  .title('Wholesale')
  .schemaType('wholesale')
  .child(
    S.editor()
      .title('Wholesale')
      .schemaType('wholesale')
      .documentId('Wholesale')
  )
