import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { imageBuilder } from "../../../lib/sanity";

type Props = {
  centered?: boolean;
  node: any;
};

export default function ImagesBlock({ centered, node }: Props) {
  const multipleImages = node.modules.length > 1;
  let alignClass;
  switch (node.verticalAlign) {
    case "bottom":
      alignClass = "items-end";
      break;
    case "center":
      alignClass = "items-center";
      break;
    case "top":
      alignClass = "items-start";
      break;
  }

  return (
    <div>
        {node?.modules?.map((module:any) => (
          <Image key={module._key} src={imageBuilder(module.image.asset).width(400).height(400).url()} alt="" layout="fill"  />
        ))}
    </div>
  );
}
