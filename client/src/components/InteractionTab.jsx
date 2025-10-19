import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  likeAComment,
  likeAPost,
  unlikeAComment,
  unlikeAPost,
} from "../features/post/postThunks";
import { Button } from "./Button";

const InteractionTab = ({ onlyLike = false, content, postId = null }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  let contentLiked =
    content.likedBy === undefined
      ? false
      : content.likedBy.includes(currentUser.id);

  const dispatch = useDispatch();

  const handleLike = async (e) => {
    e.stopPropagation();

    if (onlyLike) {
      // We are dealing with a comment

      if (contentLiked) {
        try {
          await dispatch(unlikeAComment(content._id)).unwrap();
        } catch (error) {
          toast.error("Something went wrong while unliking the comment");
        }
      } else {
        try {
          await dispatch(likeAComment(content._id)).unwrap();
        } catch (error) {
          toast.error("Something went wrong while liking the comment");
        }
      }
    } else {
      // We are dealing with a post
      if (contentLiked) {
        try {
          await dispatch(unlikeAPost(content._id)).unwrap();
        } catch (error) {
          toast.error("Something went wrong while unliking the post");
        }
      } else {
        try {
          await dispatch(likeAPost(content._id)).unwrap();
        } catch (error) {
          toast.error("Something went wrong while liking the post");
        }
      }
    }
  };

  return (
    <div
      className={`flex items-center space-x-6 ${
        !onlyLike && "border-t border-gray-100 pt-3"
      } mb-4`}
    >
      {/* Like Button */}
      <Button
        extraStyle={
          "text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-500 h-9 px-3 text-sm"
        }
        onClick={handleLike}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={contentLiked ? "red" : "none"}
          stroke={contentLiked ? "red" : "currentColor"}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-heart w-4 h-4 mr-2"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </svg>
        {content.likedBy.length}
      </Button>

      {!onlyLike && (
        <>
          <Button
            extraStyle={
              "h-9 px-3 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded-xl text-sm"
            }
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/post/${content._id}`, {
                state: { postId: content._Id, openComments: true },
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-message-circle w-4 h-4 mr-2"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
            </svg>
            {content.comments.length}
          </Button>

          <Button
            extraStyle={
              "h-9 px-3 rounded-xl hover:bg-green-50 hover:text-green-500 text-gray-500 text-sm"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-share w-4 h-4 mr-2"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" x2="12" y1="2" y2="15"></line>
            </svg>
            {content.shareCount}
          </Button>
        </>
      )}
    </div>
  );
};

export default InteractionTab;
