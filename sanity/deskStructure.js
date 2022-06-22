/* eslint-disable import/no-anonymous-default-export */
// studio/deskStructure.js

import S from "@sanity/desk-tool/structure-builder";
import { ImCog, ImHome, ImQuestion } from "react-icons/im";
import { BsBoxSeam, BsBookHalf } from 'react-icons/bs'

export default () =>
  S.list()
    .title("Menu")
    .items([
      S.listItem()
        .title("Site Settings")
        .icon(ImCog)
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings")
        ),
      S.listItem()
        .title("Home")
        .icon(ImHome)
        .child(
          S.editor()
            .id("homepage")
            .schemaType("homepage")
            .documentId("homepage")
            .title("Home Page")
        ),
      S.listItem()
        .title("About")
        .icon(BsBookHalf)
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
        S.listItem()
        .title("Wholesale")
        .icon(BsBoxSeam)
        .child(
          S.editor()
            .id("wholesale")
            .schemaType("wholesale")
            .documentId("wholesale")
            .title("Wholesale")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !["homepage", "about", "help", "siteSettings", "wholesale"].includes(listItem.getId())
      ),
    ]);
