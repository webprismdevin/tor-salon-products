import { CollectionLink } from "./sanity";

export interface MenuProps {
    menu: {
      links: [
        {
          _key: string;
          _type: "linkExternal" | "linkInternal";
          newWindow: boolean;
          title: string;
          url: string;
        }
      ];
      mega_menu: [
        {
          _key: string;
          _type: "linkExternal" | "linkInternal" | "collectionGroup";
          newWindow: boolean;
          title: string;
          url: string;
          collectionLinks?: [CollectionLink];
        }
      ];
    };
  }