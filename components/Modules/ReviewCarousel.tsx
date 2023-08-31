import Loader from "../../components/Loader";
import { useScroll } from "framer-motion";
import { RatingStar } from "rating-star";
import { useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ReviewCarousel({ data }: { data: any }) {
  const { data: response, error } = useSWR(
    `https://api.yotpo.com/v1/apps/${process.env.NEXT_PUBLIC_YOTPO_APP_KEY}/reviews?deleted=false&utoken=${process.env.NEXT_PUBLIC_YOTPO_UTOKEN}&count=100`,
    fetcher
  );

  if (!data) {
    return <Loader />;
  }
  if(error){
    return <p>error...something went wrong :(</p>
  }
  return (
    <div className="my-4 md:my-8 lg:my-12">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl">{data.title}</h1>
        <h2>{data.subtitle}</h2>
      </div>
      <div className="flex overflow-x-scroll gap-8 mt-4 md:mt-8 lg:my-12 px-8 snap-x">
        {response?.reviews.map((review: any) => {
          return (
            <div
              key={review.id}
              className="flex flex-col min-w-[280px] max-w-[280px] flex-1 border-2 rounded p-4 snap-center`"
            >
              <div className="flex items-center gap-2 mb-2">
                <RatingStar
                  id={review.id.toString()}
                  rating={Number(review.score)}
                  size={16}
                  colors={{ stroke: "#000000", mask: "#000000" }}
                />
                <p className="text-xs">Verified Buyer</p>
              </div>
              <p
                className="text-xl font-bold"
                dangerouslySetInnerHTML={{
                  __html: review.title,
                }}
              />
              <p
                className="line-clamp-6"
                dangerouslySetInnerHTML={{
                  __html: review.content,
                }}
              />
              <p
                className="text-right italic mt-4"
                dangerouslySetInnerHTML={{
                  __html: review.name,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
