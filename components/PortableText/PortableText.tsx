import BlockContent from '@sanity/block-content-to-react';
import type { Block as SanityBlock } from '@sanity/types';
import AccordionBlock from './Blocks/Accordion';
// import LinkEmailAnnotation from './annotations/LinkEmail';
// import LinkExternalAnnotation from './annotations/LinkExternal';
// import LinkInternalAnnotation from './annotations/LinkInternal';
import Block from './Blocks/Block';
// import ListBlock from './blocks/List';
import ImagesBlock from './Blocks/ImagesBlock'

type Props = {
  blocks: SanityBlock[];
  className?: string;
  centered?: boolean
};

export default function PortableText({blocks, className, centered}: Props) {
  return (
    <BlockContent
      blocks={blocks}
      // className={clsx('portableText', className)}
      renderContainerOnSingleChild
      serializers={{
        // Lists
        // list: ListBlock,
        // Marks
        // marks: {
        //   annotationLinkEmail: LinkEmailAnnotation,
        //   annotationLinkExternal: LinkExternalAnnotation,
        //   annotationLinkInternal: LinkInternalAnnotation,
        // },
        // Block types
        types: {
          block: Block,
          blockAccordion: AccordionBlock,
          blockImages: (props: any) => (
            <ImagesBlock centered={centered} {...props} />
          ),
        },
      }}
    />
  );
}