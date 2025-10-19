import getDateStamp from "../helper/accurate_timestamp";
import InteractionTab from "./InteractionTab";

const ContentCard = ({
  content,
  postId = null,
  cardClickHandler,
  profileClickHandler,
  onlyLike = false,
}) => {
  return (
    <div
      className="text-card-foreground bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
      key={postId}
      onClick={cardClickHandler}
    >
      <div className="p-6">
        <div className="flex items-center gap-x-6 mb-4">
          <img
            src={content.createdBy.profilePicture}
            alt="Profile Picture"
            className="w-14 h-14 rounded-full object-cover hover:opacity-90"
            onClick={profileClickHandler}
          />
          <div className="flex flex-1 items-center gap-x-2 text-gray-500 text-sm">
            <span
              className="text-gray-800 font-bold text-base hover:underline"
              onClick={profileClickHandler}
            >
              {content.createdBy.displayName}
            </span>
            <span className>{`@${content.createdBy.username}`}</span>
            <span className="text-gray-400">•</span>
            <span>{getDateStamp(content.createdAt)}</span>
          </div>
        </div>
        <div className="mb-4 leading-relaxed text-gray-900">
          <p>{content.content}</p>
        </div>

        <InteractionTab postId={postId} content={content} onlyLike={onlyLike} />
      </div>
    </div>
  );
};

export default ContentCard;
