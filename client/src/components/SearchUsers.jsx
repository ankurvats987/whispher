import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounced from "../helper/useDebounced";
import { searchUser } from "../features/user/userThunks";
import UserSearchCard from "./UserSearchCard";

export const SearchUsers = ({ searchedTerm }) => {
  const dispatch = useDispatch();

  const searchedUsers = useSelector((state) => state.user.searchedUser);
  const searchUsersErr = useSelector((state) => state.user.error.searching);

  const searchUserLoading = useSelector(
    (state) => state.user.loading.searching
  );

  const search = useDebounced({ searchTerm: searchedTerm });

  const abortControllerRef = useRef(null);

  useEffect(() => {
    console.log("Inside SearchUsers: ", searchedTerm);
  }, [searchedTerm]);

  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchUsers = async () => {
      try {
        await dispatch(
          searchUser({ key: search, signal: controller.signal })
        ).unwrap();
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [dispatch, search]);
  return (
    <div className="w-full flex space-y-3 flex-col">
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
          <UserSearchCard key={user._id} user={user} tag={true} />
        ))
      ) : (
        <p className="text-gray-500 text-center py-8">No users found</p>
      )}
    </div>
  );
};
