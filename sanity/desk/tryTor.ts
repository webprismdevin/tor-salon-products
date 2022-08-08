import S from '@sanity/desk-tool/structure-builder'

// prettier-ignore
export const tryTor = S.listItem()
  .title('Try TOR')
  .schemaType('tryTor')
  .child(
    S.editor()
      .title('Try TOR')
      .schemaType('tryTor')
      .documentId('tryTor')
  )
