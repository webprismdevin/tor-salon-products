import { RatingStar } from "rating-star";

type Review = {
  id: string;
  score: number;
  title: string;
  content: string;
  user: {
    display_name: string;
  };
};

type ReviewData = {
  bottomline: {
    average_score: number;
    total_review: number;
  };
  reviews: Review[];
};

export default function Reviews({ data }: { data: ReviewData }) {
  const { reviews, bottomline } = data;

  return (
    <div className="mx-auto max-w-[1200px] p-12">
      {reviews && (
        <div className="mb-12 text-center bg-slate-100 py-8">
          <h2 className="text-4xl">
            {data.bottomline.average_score}&nbsp;Stars
          </h2>
          <span>Based on {bottomline.total_review} review(s)</span>
        </div>
      )}
      <div>
        {reviews &&
          reviews.map((r: any) => (
            <div key={r.id} className="gap-2">
              <div className="mb-4">
                <p className="mb-1">Reviews</p>
                <hr />
              </div>
              <div className="float-right">
                {new Date(r.created_at).toLocaleDateString()}
              </div>
              <div className="mb-4">
                <RatingStar id={r.id.toString()} rating={r.score} size={18} />
                <div className="flex items-center">
                  <p className="bold text-md">{r.user.display_name}</p>
                  <p className="text-slate-400 text-md">Verified Buyer</p>
                </div>
              </div>
              <p
                className="text-xl font-bold capitalize"
                dangerouslySetInnerHTML={{
                  __html: r.title,
                }}
              />
              <p
                className="max-w-prose"
                dangerouslySetInnerHTML={{
                  __html: r.content,
                }}
              />
            </div>
          ))}
        {!reviews && <p>No reviews yet</p>}
      </div>
    </div>
  );
}
