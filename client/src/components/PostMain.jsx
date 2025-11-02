import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import ProfileContext from "../context/ProfileContext";
import { cleanUp, toggleReadMore } from "../features/post/postSlice";
import { createAComment, getAPost } from "../features/post/postThunks";
import { Button } from "./Button";
import ContentCard from "./ContentCard";
import InteractionTab from "./InteractionTab";
import getDateStamp from "../helper/accurate_timestamp";
import CarouselPosts from "./CarouselPosts";
import { SearchUsers } from "./SearchUsers";
import { setSelectedUser } from "../features/user/userSlice";
import ModifiedTextArea from "./ModifiedTextArea";

const PostMain = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();

  const postLoading = useSelector((state) => state.post.loading);
  const currentPost = useSelector((state) => state.post.currentPost);
  const error = useSelector((state) => state.post.error);
  const currentUser = useSelector((state) => state.user.user);

  const [currIdx, setCurrIdx] = useState(0);

  const createCommentLoading = useSelector(
    (state) => state.post.createCommentLoading
  );

  const [comment, setComment] = useState("");
  const location = useLocation();
  const { getAProfile } = useContext(ProfileContext);
  const navigate = useNavigate();
  const commentSectionRef = useRef(null);

  const readMore = useSelector((state) => state.post.readMore);

  const [showReadMore, setShowReadMore] = useState(false);
  const [expand, setExpand] = useState(false);

  const [showUsers, setShowUsers] = useState(false);

  const [searchedUser, setSearchedUser] = useState({ start: -1, user: "" });

  const textAreaRef = useRef(null);

  const selectedUser = useSelector((state) => state.user.selectedUser);

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
      try {
        const data = await dispatch(getAPost(postId)).unwrap();
        setShowReadMore(data.post.content.length > 200);
        setExpand(readMore);
      } catch (error) {
        console.error("Fetch Post Error:", error?.message);
      }
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

  // useEffect(() => {
  //   if (selectedUser !== "") {
  //     const textarea = textAreaRef.current;

  //     const currentValue = textarea.value;

  //     const newValue =
  //       currentValue.substring(0, searchedUser.start + 1) + selectedUser + " ";

  //     textarea.value = newValue;
  //     setComment(newValue);

  //     setShowUsers(false);
  //     setSearchedUser((prev) => ({
  //       ...prev,
  //       start: -1,
  //       user: "",
  //     }));

  //     textarea.focus();

  //     const end = textarea.value.length;
  //     textarea.selectionStart = end;
  //     textarea.selectionEnd = end;

  //     dispatch(setSelectedUser(""));
  //   }
  // }, [selectedUser]);

  const handleAddComment = async (e) => {
    e.stopPropagation();

    try {
      await dispatch(
        createAComment({ postId, comment: comment.trim() })
      ).unwrap();

      toast.success("Comment created successfully!");
    } catch (error) {
      toast.error(error || "Failed to create comment");
    }
    setComment("");
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;

    const secondLastChar =
      value.length > 1 ? value.charAt(value.length - 2) : "";

    const lastChar = value.charAt(value.length - 1);

    if (lastChar === "@" && (secondLastChar === " " || value.length === 1)) {
      setShowUsers(true);
      setSearchedUser((prev) => ({
        ...prev,
        start: value.length - 1,
      }));
    } else if (showUsers && (lastChar === " " || value.length === 0)) {
      setShowUsers(false);
      setSearchedUser((prev) => ({
        ...prev,
        start: -1,
        user: "",
      }));
    } else if (showUsers) {
      setSearchedUser((prev) => ({
        ...prev,
        user: value.substring(prev.start + 1),
      }));
    }
    setComment(e.target.value);
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
      <div className="max-w-[100rem] mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-3">
            <div className="text-card-foreground bg-white border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="flex items-center gap-x-4 mb-6">
                  <img
                    src={currentPost.createdBy.profilePicture}
                    alt="Profile Picture"
                    className="w-16 h-16 rounded-full object-cover hover:opacity-90 cursor-pointer"
                    onClick={(e) =>
                      handleProfileClick(e, currentPost.createdBy)
                    }
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

                      <span className>@{currentPost.createdBy.username}</span>
                    </div>

                    <span className="text-gray-500">
                      {getDateStamp(currentPost.createdAt)}
                    </span>
                  </div>
                </div>

                <CarouselPosts
                  images={currentPost.images}
                  extraStyle="mb-4"
                  currIdx={currIdx}
                  setCurrIdx={setCurrIdx}
                />

                <div className="mb-4 leading-relaxed text-gray-900 text-lg relative">
                  <p
                    className={`break-words whitespace-pre-wrap ${
                      showReadMore && !expand && "line-clamp-10"
                    }`}
                  >
                    {currentPost.content.split(/(@\w+)/g).map((part, i) => {
                      return part.startsWith("@") ? (
                        <span
                          key={i}
                          className="cursor-pointer text-blue-500 transition-transform hover:scale-120 duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${part.substring(1)}`);
                          }}
                        >
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      );
                    })}
                  </p>

                  {showReadMore && (
                    <button
                      className="text-blue-500 hover:text-blue-700 font-medium text-sm mt-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpand((val) => !val);
                      }}
                    >
                      {expand ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
                <InteractionTab content={currentPost} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="relative">
              <div
                className={`text-card-foreground bg-white border-gray-200 rounded-xl shadow-sm ${
                  showUsers && "rounded-b-none"
                }`}
              >
                <div className="p-6">
                  <div className="space-x-4 flex">
                    <img
                      src={currentUser.profilePicture}
                      alt="Your Profile Picture"
                      className="h-12 w-12 rounded-full object-cover"
                    />

                    <div className="flex-1 space-y-3">
                      {/* <textarea
                        ref={textAreaRef}
                        value={comment}
                        onChange={handleCommentChange}
                        name="comment"
                        id="comment"
                        className="w-full resize-none flex min-h-[80px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="Add a comment..."
                        maxLength={300}
                      ></textarea> */}
                      <ModifiedTextArea
                        value={comment}
                        setValue={setComment}
                        mode={"comment"}
                      />

                      <div className="flex items-center justify-between">
                        <div className="text-gray-400 text-sm">
                          <span>{comment.length}/300</span>
                        </div>

                        <Button
                          extraStyle={
                            "disabled:opacity-50 h-10 px-4 py-2 bg-gradient-to-r from-rose-400 to-purple-400 rounded-lg text-white text-sm cursor-pointer hover:from-rose-500 hover:to-purple-500"
                          }
                          title={
                            createCommentLoading ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin h-4 w-4 mr-2"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Commenting...
                              </span>
                            ) : (
                              "Comment"
                            )
                          }
                          isDisabled={!comment.trim() || createCommentLoading}
                          onClick={handleAddComment}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* {showUsers && (
                <div className="absolute inset-x-0 bottom-0 top-[100%] bg-gray-100 shadow-xl border-gray-300 border-1 h-60 w-full rounded-b-xl z-50 overflow-y-scroll">
                  <SearchUsers searchedTerm={searchedUser.user} />
                </div>
              )} */}
            </div>

            <div className="flex flex-col bg-white space-y-6 rounded-xl shadow-sm ">
              <div className="px-6 py-4 pt-4 border-b border-gray-300">
                <h3
                  ref={commentSectionRef}
                  className="text-gray-900 font-semibold text-lg pt-1"
                >
                  Comments
                </h3>
              </div>

              <div className="px-6 pb-2 space-y-6 max-h-[60rem] overflow-y-auto scrollbar">
                {currentPost.comments.length === 0 ? (
                  <div className="w-full flex justify-center p-8">
                    <span className="text-gray-500">No comments here.</span>
                  </div>
                ) : (
                  currentPost.comments.map((comment) => (
                    <ContentCard
                      key={comment._id}
                      content={comment}
                      postId={postId}
                      profileClickHandler={(e) =>
                        handleProfileClick(e, comment.createdBy)
                      }
                      onlyLike={true}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default PostMain;
