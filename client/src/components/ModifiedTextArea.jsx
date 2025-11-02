import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../features/user/userSlice";
import { SearchUsers } from "./SearchUsers";

const ModifiedTextArea = ({ value, setValue, mode }) => {
  const dispatch = useDispatch();

  const textAreaRef = useRef(null);

  const [showUsers, setShowUsers] = useState(false);

  const selectedUser = useSelector((state) => state.user.selectedUser);

  const [searchedUser, setSearchedUser] = useState({ start: -1, user: "" });

  useEffect(() => {
    if (selectedUser !== "") {
      const textarea = textAreaRef.current;

      const currentValue = textarea.value;

      const newValue =
        currentValue.substring(0, searchedUser.start + 1) + selectedUser + " ";

      textarea.value = newValue;
      setValue(newValue);

      setShowUsers(false);
      setSearchedUser((prev) => ({
        ...prev,
        start: -1,
        user: "",
      }));

      textarea.focus();

      const end = textarea.value.length;
      textarea.selectionStart = end;
      textarea.selectionEnd = end;

      dispatch(setSelectedUser(""));
    }
  }, [selectedUser]);

  const handleValueChange = (e) => {
    const value = e.target.value;

    const secondLastChar =
      value.length > 1 ? value.charAt(value.length - 2) : "";

    const lastChar = value.charAt(value.length - 1);

    if (lastChar === "@" && (secondLastChar === " " || value.length === 1)) {
      setShowUsers(true);
      setSearchedUser((prev) => ({
        ...prev,
        start: value.length - 1,
        user: "",
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
        user: value.substring(prev.start + 1) || "",
      }));
    }
    setValue(e.target.value);
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={handleValueChange}
        name={mode}
        id={mode}
        className="w-full resize-none flex min-h-[80px] border border-gray-300 rounded-lg px-3 py-2 text-sm bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-gray-500"
        placeholder={
          mode === "comment" ? "Add a comment..." : "Share your thoughts"
        }
        maxLength={mode === "comment" ? 300 : 1500}
      ></textarea>
      {showUsers && (
        <div className="absolute inset-x-0 bottom-0 top-[100%] bg-gray-100 shadow-xl border-gray-300 border-1 h-60 w-full rounded-b-xl z-50 overflow-y-scroll">
          <SearchUsers searchedTerm={searchedUser.user} />
        </div>
      )}
    </div>
  );
};

export default ModifiedTextArea;
