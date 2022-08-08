import { GetStaticProps } from "next";
import { sanity } from "../../lib/sanity";

declare interface PageProps {}

export default function Offer({ page }: { page: PageProps }) {
  return <div></div>;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[ _type == "offer" && slug.current == "${params?.slug}"][0]`;
  const result = await sanity.fetch(query);

  return {
    props: {
        page: result
    },
  };
};
