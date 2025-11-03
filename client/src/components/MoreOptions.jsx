import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setToggleMenu } from "../features/post/postSlice";
import { commentDelete, postDelete } from "../features/post/postThunks";
import { useNavigate } from "react-router";
import Modal from "./Modal";

const MoreOptions = ({ content, mode = "" }) => {
  const contentId = content._id;

  const loading =
    mode === "comment"
      ? useSelector((state) => state.post.commentDeleteLoading)
      : useSelector((state) => state.post.postDeleteLoading);

  const toggleMenuId = useSelector((state) => state.post.toggleMenu);

  const currentUser = useSelector((state) => state.user.user);

  const moreOptionsRef = useRef(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(e.target)
      ) {
        dispatch(setToggleMenu(null));
      }
    };

    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("touchstart", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const handlePostDelete = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const confirmDelete = async (e) => {
    e.stopPropagation();

    try {
      if (mode === "comment") {
        await dispatch(commentDelete(contentId)).unwrap();
        toast.success("Comment deleted successfully!");
      } else {
        await dispatch(postDelete(contentId)).unwrap();

        setOpen(false);
        toast.success("Post deleted successfully!");
        if (mode === "currentPost") navigate("/feed", { replace: true });
      }
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleMoreOptions = (e) => {
    e.stopPropagation();

    dispatch(setToggleMenu(contentId === toggleMenuId ? null : contentId));
  };

  return (
    (currentUser.id === import.meta.env.VITE_ADMIN_ID ||
      content.createdBy._id === currentUser.id) && (
      <>
        <div className="relative w-8">
          <button
            className="cursor-pointer text-gray-700 hover:scale-110 transition-all duration-200 hover:text-gray-950"
            onClick={handleMoreOptions}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3.5"
              stroke="currentColor"
              className="w-full h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12h.008v.008H6.75V12zm5.25 0h.008v.008H12v-.008zm5.25 0h.008v.008H17.25V12z"
              />
            </svg>
          </button>

          <div
            ref={moreOptionsRef}
            className={`bg-gray-100 w-[150px] h-30 absolute bottom-0 ${
              !mode
                ? "top-[65%]"
                : mode === "comment"
                ? "top-[23%]"
                : "top-[40%]"
            }  right-0 rounded-lg shadow-lg border border-gray-200 flex flex-col transition-all duration-200 z-[999] ${
              contentId === toggleMenuId
                ? "opacity-100 translate-y-0"
                : "opacity-0 pointer-events-none -translate-y-0"
            }`}
          >
            <div
              className={`hover:bg-white px-3 py-4 flex items-center gap-3 cursor-pointer transition-all duration-100 ${
                loading &&
                "select-none opacity-50 cursor-not-allowed pointer-events-none"
              }`}
              onClick={(e) => {
                if (!loading) {
                  handlePostDelete(e);
                }
              }}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                </svg>
              )}

              <span className="">{loading ? "Deleting..." : "Delete"}</span>
            </div>
          </div>
        </div>
        <Modal
          isOpen={open}
          onClose={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <div className="flex flex-col items-center justify-center gap-y-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="text-red-500"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <line
                x1="12"
                y1="7"
                x2="12"
                y2="13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>

            <h2 className="text-3xl font-semibold ">{`Delete ${
              mode === "comment" ? "Comment" : "Post"
            }?`}</h2>
            <p className="text-gray-700 text-lg text-center">
              {`Do you really want to delete this ${
                mode === "comment" ? "comment" : "post"
              }? This process cannot be undone? `}
            </p>
            <div className="mt-1 flex justify-end w-full gap-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  dispatch(setToggleMenu(null));
                }}
                className="px-4 py-2 border-2 border-gray-200 text-black rounded-sm hover:bg-gray-200 flex-1 cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600 flex-1 cursor-pointer transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55 flex items-center justify-center"
                disabled={loading}
              >
                {loading && (
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
                )}

                <span>{loading ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </div>
        </Modal>
      </>
    )
  );
};

export default MoreOptions;
