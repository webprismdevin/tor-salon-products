/* eslint-disable import/no-anonymous-default-export */
// studio/deskStructure.js

import S from "@sanity/desk-tool/structure-builder";
import { ImBook, ImHome, ImQuestion } from 'react-icons/im';

export default () =>
  S.list()
    .title("Menu")
    .items([
      S.listItem()
        .title("Homepage")
        .icon(ImHome)
        .child(
          S.editor()
            .id("homepage")
            .schemaType("homepage")
            .documentId("homepage")
            .title("Homepage")
        ),
        S.listItem()
        .title("About")
        .icon(ImBook)
        .child(
          S.editor()
            .id("about")
            .schemaType("about")
            .documentId("about")
            .title("About Us")
        ),
        S.listItem()
        .title("Help")
        .icon(ImQuestion)
        .child(
          S.editor()
            .id("help")
            .schemaType("help")
            .documentId("help")
            .title("Help")
        ),
        S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !["homepage", "about", "help"].includes(listItem.getId())
      ),
    ]);