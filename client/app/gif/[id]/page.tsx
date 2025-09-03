import StarRating from "./components/rating";
import GifDetails from "./components/gifDetails";
import CommentSection from "./components/commentSection";

export default async function GifDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <>
      <GifDetails id={id} />
      <StarRating gifId={id} />
      <CommentSection gifId={id} />
    </>
  );
}
