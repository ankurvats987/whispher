import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, searchPost } from "../features/post/postThunks";
import { cleanUp } from "../features/post/postSlice";
import ContentCard from "./ContentCard";
import { useNavigate, useParams } from "react-router";
import { searchUser } from "../features/user/userThunks";
import UserSearchCard from "./UserSearchCard";

const SearchDetails = () => {
  const allPosts = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchedUsers = useSelector((state) => state.user.searchedUser);
  const searchedPosts = useSelector((state) => state.post.searchedPosts);

  const searchUsersErr = useSelector((state) => state.user.error.searching);
  const searchPostsErr = useSelector((state) => state.post.searchPostError);

  const searchPostLoading = useSelector(
    (state) => state.post.searchPostLoading
  );
  const searchUserLoading = useSelector(
    (state) => state.user.loading.searching
  );

  const { key } = useParams();
  const searchKey = key || "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await dispatch(searchPost(searchKey)).unwrap();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUsers = async () => {
      try {
        await dispatch(searchUser(searchKey)).unwrap();
      } catch (error) {
        console.log(searchPostsErr);
        console.error(error);
      }
    };

    fetchUsers();

    if (searchKey !== "") {
      fetchPosts();
    }
  }, [dispatch, searchKey]);

  const handleProfileClick = (e, createdBy) => {
    e.stopPropagation();
    navigate(`/profile/${createdBy.username}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Similar Users</h2>
        <div className="space-y-3">
          {searchUserLoading ? (
            <span className="flex items-center justify-center gap-2">
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
              Searching Users...
            </span>
          ) : searchUsersErr ? (
            <span className="flex items-center justify-center text-red-500 text-lg mt-12">
              Failed to search any user. Retry later
            </span>
          ) : searchedUsers && searchedUsers.length > 0 ? (
            searchedUsers.map((user) => (
              <UserSearchCard key={user._id} user={user} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No users found</p>
          )}
        </div>
      </div>

      {searchKey !== "" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Similar Posts</h2>
          <div className="space-y-6">
            {searchPostLoading ? (
              <span className="flex items-center justify-center gap-2">
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
                Searching Posts...
              </span>
            ) : searchPostsErr ? (
              <span className="flex items-center justify-center text-red-500 text-lg mt-12">
                Failed to search any post. Retry later
              </span>
            ) : searchedPosts && searchedPosts.length > 0 ? (
              searchedPosts.map((post) => (
                <ContentCard
                  key={post._id}
                  content={post}
                  cardClickHandler={() =>
                    navigate(`/post/${post._id}`, {
                      state: { postId: post._id },
                    })
                  }
                  profileClickHandler={(e) =>
                    handleProfileClick(e, post.createdBy)
                  }
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No posts found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDetails;
