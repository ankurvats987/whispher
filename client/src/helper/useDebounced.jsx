import React, { useEffect, useState } from "react";

const useDebounced = ({ searchTerm = "", delay = 500 }) => {
  const [debouncedValue, setDebouncedValue] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(searchTerm), delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return debouncedValue;
};

export default useDebounced;
