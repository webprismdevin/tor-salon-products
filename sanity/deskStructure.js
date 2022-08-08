/* eslint-disable import/no-anonymous-default-export */
// studio/deskStructure.js

import S from "@sanity/desk-tool/structure-builder";
import { ImCog, ImHome, ImQuestion } from "react-icons/im";
import { BsBoxSeam, BsBookHalf } from "react-icons/bs";

const DOCUMENT_TYPES_IN_STRUCTURE = [
  "siteSettings",
  "homepage",
  "about",
  "help",
  "wholesale",
  "tryTor",
  "media.tag",
];

import { settings } from "./desk/settings";
import { home } from "./desk/home";
import { about } from "./desk/about";
import { help } from "./desk/help";
import { tryTor } from "./desk/tryTor";
import { wholesale } from './desk/wholesale'

export default () =>
  S.list()
    .title("Content")
    .items([
      settings,
      S.divider(),
      home,
      about,
      help,
      wholesale,
      tryTor,
      S.divider(),
      // Automatically add new document types to the root pane
      //prettier-ignore
      ...S.documentTypeListItems().filter(listItem => !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId())),
    ]);
