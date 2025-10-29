import { useDispatch } from "react-redux";
import getDateStamp from "../helper/accurate_timestamp";
import CarouselPosts from "./CarouselPosts";
import InteractionTab from "./InteractionTab";
import { toggleReadMore } from "../features/post/postSlice";

const ContentCard = ({
  content,
  postId = null,
  cardClickHandler,
  profileClickHandler,
  onlyLike = false,
}) => {
  const contentLength = content.content.length;
  const showReadMore = contentLength > 600;

  const dispatch = useDispatch();

  return (
    <div
      className={`bg-white ${
        !onlyLike &&
        "text-card-foreground rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
      } `}
      key={postId}
      onClick={cardClickHandler}
    >
      <div className={!onlyLike && "p-4 md:p-6"}>
        {!onlyLike ? (
          <>
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <img
                src={content.createdBy.profilePicture}
                alt="Profile Picture"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover hover:opacity-90 flex-shrink-0"
                onClick={profileClickHandler}
              />
              <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-gray-500 text-sm min-w-0">
                <span
                  className="text-gray-800 font-bold text-base hover:underline truncate"
                  onClick={profileClickHandler}
                >
                  {content.createdBy.displayName}
                </span>
                <span className="truncate">{`@${content.createdBy.username}`}</span>
                <span className="text-gray-400 flex-shrink-0">•</span>
                <span className="flex-shrink-0">
                  {getDateStamp(content.createdAt)}
                </span>
              </div>
            </div>
            <CarouselPosts images={content.images} extraStyle="mb-4" />

            <div className="mb-4 leading-relaxed text-gray-900">
              <p
                className={`break-words whitespace-pre-wrap ${
                  showReadMore && "line-clamp-10"
                } `}
              >
                {content.content}
              </p>
              {showReadMore && (
                <button
                  className="text-blue-500 hover:text-blue-700 font-medium text-sm mt-1 cursor-pointer"
                  onClick={() => {
                    console.log("read more clicked");
                    dispatch(toggleReadMore(true));
                  }}
                >
                  Read More
                </button>
              )}
            </div>

            <InteractionTab
              postId={postId}
              content={content}
              onlyLike={onlyLike}
            />
          </>
        ) : (
          <div className="flex gap-3 md:gap-4 mb-4">
            <img
              src={content.createdBy.profilePicture}
              alt="Profile Picture"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover hover:opacity-90 flex-shrink-0"
              onClick={profileClickHandler}
            />

            <div>
              <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-gray-500 text-sm min-w-0">
                <span
                  className="text-gray-800 font-bold text-base hover:underline truncate"
                  onClick={profileClickHandler}
                >
                  {content.createdBy.displayName}
                </span>
                <span className="truncate">{`@${content.createdBy.username}`}</span>
                <span className="text-gray-400 flex-shrink-0">•</span>
                <span className="flex-shrink-0">
                  {getDateStamp(content.createdAt)}
                </span>
              </div>

              <div className="mt-2 mb-1 leading-relaxed text-gray-900">
                <p
                  className={`break-words whitespace-pre-wrap ${
                    showReadMore && "line-clamp-10"
                  } `}
                >
                  {content.content}
                </p>
                {showReadMore && (
                  <button className="text-blue-500 hover:text-blue-700 font-medium text-sm mt-1 cursor-pointer">
                    Read More
                  </button>
                )}
              </div>

              <InteractionTab
                postId={postId}
                content={content}
                onlyLike={onlyLike}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
