import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import ProfileContext from "../context/ProfileContext";
import { cleanUp } from "../features/post/postSlice";
import { createAComment, getAPost } from "../features/post/postThunks";
import { Button } from "./Button";
import ContentCard from "./ContentCard";
import InteractionTab from "./InteractionTab";
import getDateStamp from "../helper/accurate_timestamp";

const PostMain = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();

  const postLoading = useSelector((state) => state.post.loading);
  const currentPost = useSelector((state) => state.post.currentPost);
  const error = useSelector((state) => state.post.error);
  const currentUser = useSelector((state) => state.user.user);

  const createCommentLoading = useSelector(
    (state) => state.post.createCommentLoading
  );

  const [comment, setComment] = useState("");
  const location = useLocation();
  const { getAProfile } = useContext(ProfileContext);
  const navigate = useNavigate();
  const commentSectionRef = useRef(null);

  useEffect(() => {
    // Instantly scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "auto" });

    const showComments = location.state?.openComments;
    if (showComments) {
      requestAnimationFrame(() => {
        if (commentSectionRef.current) {
          commentSectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    const fetchPost = async () => {
      await dispatch(getAPost(postId));
    };

    fetchPost();

    return () => {
      dispatch(cleanUp({ clearCurrentPost: true }));
    };
  }, [postId, dispatch]);

  const handleProfileClick = (e, user) => {
    e.stopPropagation();
    navigate(`/profile/${user.username}`, {
      state: { userId: user._id },
    });
  };

  const handleAddComment = async (e) => {
    e.stopPropagation();

    try {
      const res = await dispatch(
        createAComment({ postId, comment: comment.trim() })
      ).unwrap();

      console.log(res);
      toast.success("Comment created successfully!");
    } catch (error) {
      toast.error(error || "Failed to create comment");
    }
    setComment("");
  };

  if (postLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-gray-500 text-lg">Loading posts...</span>
      </div>
    );
  } else if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-red-400 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
        <span className="text-red-500 text-lg font-semibold">
          Failed to load the post
        </span>
        <span className="text-gray-500 text-sm mt-1">
          Please check your connection or try again later.
        </span>
      </div>
    );
  }

  if (currentPost) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="text-card-foreground bg-white border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="p-8">
            <div className="flex items-center gap-x-4 mb-6">
              <img
                src={currentPost.createdBy.profilePicture}
                alt="Profile Picture"
                className="w-16 h-16 rounded-full object-cover hover:opacity-90 cursor-pointer"
                onClick={(e) => handleProfileClick(e, currentPost.createdBy)}
              />
              <div className="flex-1">
                <div className="flex space-x-2 text-gray-500 items-center">
                  <span
                    className="text-gray-800 font-semibold text-lg hover:underline cursor-pointer"
                    onClick={(e) =>
                      handleProfileClick(e, currentPost.createdBy)
                    }
                  >
                    {currentPost.createdBy.displayName}
                  </span>

                  <span className>{currentPost.createdBy.username}</span>
                </div>

                <span className="text-gray-500">
                  {getDateStamp(currentPost.createdAt)}
                </span>
              </div>
            </div>
            <div className="mb-4 leading-relaxed text-gray-900 text-lg">
              <p>{currentPost.content}</p>
            </div>
            <InteractionTab content={currentPost} />
          </div>
        </div>

        <div className="text-card-foreground bg-white border-gray-200 rounded-xl shadow-sm">
          <div className="p-6">
            <div className="space-x-4 flex">
              <img
                src={currentUser.profilePicture}
                alt="Your Profile Picture"
                className="h-12 w-12 rounded-full object-cover"
              />

              <div className="flex-1 space-y-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  name="comment"
                  id="comment"
                  className="w-full resize-none flex min-h-[80px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Add a comment..."
                  maxLength={300}
                ></textarea>

                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    <span>{comment.length}/300</span>
                  </div>

                  <Button
                    extraStyle={
                      "disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-rose-400 to-purple-400 rounded-lg text-white text-sm cursor-pointer hover:from-rose-500 hover:to-purple-500"
                    }
                    title={createAComment ? "Creating..." : "Comment"}
                    isDisabled={!comment.trim() || createCommentLoading}
                    onClick={handleAddComment}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3
          ref={commentSectionRef}
          className="text-gray-900 font-semibold text-lg pt-1"
        >
          Comments
        </h3>

        {currentPost.comments.map((comment) => (
          <ContentCard
            key={comment._id}
            content={comment}
            postId={postId}
            profileClickHandler={(e) =>
              handleProfileClick(e, comment.createdBy)
            }
            onlyLike={true}
          />
        ))}
      </div>
    );
  }
};

export default PostMain;
