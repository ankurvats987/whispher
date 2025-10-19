const getDateStamp = (createdAt) => {
  const now = Date.now();
  const creation = new Date(createdAt).getTime();

  const diff = now - creation;

  if (diff < 0) return "just now";

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));

  if (seconds < 60) {
    return `${seconds}s ago`;
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else if (weeks < 4) {
    return `${weeks}w ago`;
  } else if (months < 12) {
    return `${months}mo ago`;
  } else {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(createdAt).toLocaleDateString(undefined, options);
  }
};

export const getMonthAndYear = (createdAt) => {
  const creation = new Date(createdAt);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = monthNames[creation.getMonth()];
  const year = creation.getFullYear();

  return `${month} ${year}`;
};

export default getDateStamp;

console.log(getDateStamp("2024-07-01T10:00:00.000Z"));
