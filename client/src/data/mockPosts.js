import { v4 as uuidv4 } from "uuid";

const mockPosts = [
  {
    postId: uuidv4(),
    createdBy: "1",
    createdAt: Date.now() - 1000000,
    desc: "Just launched my portfolio website! 🚀",
    likesCount: 45,
    shareCount: 3,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "2",
        createdAt: Date.now() - 900000,
        desc: "Looks awesome! 😍",
        likesCount: 4,
        likedBy: [],
      },
      {
        commentId: uuidv4(),
        createdBy: "3",
        createdAt: Date.now() - 850000,
        desc: "Great job bro 👏",
        likesCount: 2,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "2",
    createdAt: Date.now() - 1800000,
    desc: "New Figma design drop 🔥💡",
    likesCount: 33,
    shareCount: 1,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "1",
        createdAt: Date.now() - 1700000,
        desc: "Very clean UI!",
        likesCount: 1,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "3",
    createdAt: Date.now() - 2000000,
    desc: "Dockerized my entire app today. 🐳💪",
    likesCount: 27,
    shareCount: 2,
    likedBy: [],
    comments: [],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "4",
    createdAt: Date.now() - 2500000,
    desc: "Weekend trek to the hills 🏞️",
    likesCount: 58,
    shareCount: 0,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "6",
        createdAt: Date.now() - 2400000,
        desc: "This view is everything!",
        likesCount: 5,
        likedBy: [],
      },
      {
        commentId: uuidv4(),
        createdBy: "1",
        createdAt: Date.now() - 2350000,
        desc: "Where is this place?",
        likesCount: 1,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "5",
    createdAt: Date.now() - 3000000,
    desc: "Practicing React hooks today. useEffect is 🔥",
    likesCount: 14,
    shareCount: 0,
    likedBy: [],
    comments: [],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "6",
    createdAt: Date.now() - 4000000,
    desc: "Finally nailed the perfect night city shot 🌃📷",
    likesCount: 77,
    shareCount: 2,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "2",
        createdAt: Date.now() - 3900000,
        desc: "Your photos are always so good!",
        likesCount: 6,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "7",
    createdAt: Date.now() - 5000000,
    desc: "Trying Unity shader graph — mind blown! 🤯",
    likesCount: 38,
    shareCount: 1,
    likedBy: [],
    comments: [],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "8",
    createdAt: Date.now() - 6000000,
    desc: "Sprints + daily standups = productive chaos 🌀",
    likesCount: 19,
    shareCount: 0,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "3",
        createdAt: Date.now() - 5900000,
        desc: "Relatable AF 😂",
        likesCount: 3,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "9",
    createdAt: Date.now() - 7000000,
    desc: "Reading about web security exploits all night 🕵️‍♂️",
    likesCount: 22,
    shareCount: 1,
    likedBy: [],
    comments: [],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "10",
    createdAt: Date.now() - 8000000,
    desc: "A new poem: 'Silence in Syntax' — coming soon 🌙",
    likesCount: 50,
    shareCount: 4,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "1",
        createdAt: Date.now() - 7900000,
        desc: "Can’t wait for it!",
        likesCount: 2,
        likedBy: [],
      },
      {
        commentId: uuidv4(),
        createdBy: "6",
        createdAt: Date.now() - 7850000,
        desc: "That title is perfect 🔥",
        likesCount: 1,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },

  {
    postId: uuidv4(),
    createdBy: "2",
    createdAt: Date.now() - 8500000,
    desc: "Just published a Medium article on accessibility in design. 💡",
    likesCount: 34,
    shareCount: 2,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "1",
        createdAt: Date.now() - 8400000,
        desc: "Shared it with my team. So useful!",
        likesCount: 2,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "5",
    createdAt: Date.now() - 9000000,
    desc: "Struggled with useRef all morning. I think I get it now 🧠🔁",
    likesCount: 20,
    shareCount: 0,
    likedBy: [],
    comments: [],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "6",
    createdAt: Date.now() - 9300000,
    desc: "Some golden hour shots from last evening 🌇📸",
    likesCount: 88,
    shareCount: 3,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "4",
        createdAt: Date.now() - 9200000,
        desc: "Stunning light 😍",
        likesCount: 4,
        likedBy: [],
      },
      {
        commentId: uuidv4(),
        createdBy: "3",
        createdAt: Date.now() - 9150000,
        desc: "Wallpaper material 🔥",
        likesCount: 3,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "7",
    createdAt: Date.now() - 9500000,
    desc: "Started learning C# today! Back to basics. 🧩",
    likesCount: 17,
    shareCount: 0,
    likedBy: [],
    comments: [],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "3",
    createdAt: Date.now() - 10000000,
    desc: "Tried Bun.js on a side project — blazing fast! ⚡",
    likesCount: 29,
    shareCount: 1,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "8",
        createdAt: Date.now() - 9900000,
        desc: "How's the DX compared to Node?",
        likesCount: 0,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "1",
    createdAt: Date.now() - 10800000,
    desc: "Dark mode theme finally done! 🌙✨",
    likesCount: 60,
    shareCount: 2,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "2",
        createdAt: Date.now() - 10700000,
        desc: "Screenshot please!",
        likesCount: 1,
        likedBy: [],
      },
      {
        commentId: uuidv4(),
        createdBy: "9",
        createdAt: Date.now() - 10650000,
        desc: "Looks better than Twitter's 🔥",
        likesCount: 2,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "8",
    createdAt: Date.now() - 11000000,
    desc: "We're testing a new roadmap feature in our app 🚦📲",
    likesCount: 42,
    shareCount: 3,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "3",
        createdAt: Date.now() - 10900000,
        desc: "Very curious to see how users respond!",
        likesCount: 1,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "9",
    createdAt: Date.now() - 11300000,
    desc: "Thinking of making a browser extension. Any ideas? 🧩",
    likesCount: 11,
    shareCount: 0,
    likedBy: [],
    comments: [],
    getCommentsCount() {
      return this.comments.length;
    },
  },
  {
    postId: uuidv4(),
    createdBy: "10",
    createdAt: Date.now() - 11600000,
    desc: "Midnight thought dump: 'Code is poetry too.'",
    likesCount: 24,
    shareCount: 1,
    likedBy: [],
    comments: [
      {
        commentId: uuidv4(),
        createdBy: "6",
        createdAt: Date.now() - 11500000,
        desc: "Bookmarking this one ✨",
        likesCount: 2,
        likedBy: [],
      },
    ],
    getCommentsCount() {
      return this.comments.length;
    },
  },
];

export default mockPosts;
