import { Post } from '@/types';
import { users } from './users';

export const posts: Post[] = [
  {
    id: '1',
    user: users[0],
    content: "Just released a new React Native component library! Check it out and let me know what you think. It's fully customizable and works great with Expo. #ReactNative #OpenSource",
    images: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
    ],
    likes: 128,
    comments: 32,
    shares: 14,
    createdAt: '2023-06-15T14:23:00Z',
    isLiked: true,
  },
  {
    id: '2',
    user: users[1],
    content: "Working on a new mobile app design. Focusing on accessibility and clean UI. What do you think about this color palette?",
    images: [
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
    ],
    likes: 95,
    comments: 18,
    shares: 5,
    createdAt: '2023-06-14T10:15:00Z',
  },
  {
    id: '3',
    user: users[2],
    content: "Just hiked to the top of Mount Rainier! The view was absolutely breathtaking. Definitely worth the 6-hour climb. #Hiking #Adventure #Nature",
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
    ],
    likes: 215,
    comments: 42,
    shares: 28,
    createdAt: '2023-06-13T18:45:00Z',
  },
  {
    id: '4',
    user: users[3],
    content: "Excited to announce that I'll be speaking at the React Native Conference next month! My talk will be about performance optimization techniques. Hope to see some of you there! #ReactNativeConf",
    likes: 178,
    comments: 24,
    shares: 19,
    createdAt: '2023-06-12T09:30:00Z',
    isLiked: true,
  },
  {
    id: '5',
    user: users[4],
    content: "Just finished reading 'Atomic Habits' by James Clear. Highly recommend it if you're looking to build better habits and break bad ones. What books have you read recently?",
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
    ],
    likes: 87,
    comments: 31,
    shares: 7,
    createdAt: '2023-06-11T15:20:00Z',
  },
  {
    id: '6',
    user: users[0],
    content: "Spent the weekend refactoring our codebase. Reduced bundle size by 30% and improved app startup time. Small optimizations add up! #WebPerformance #DeveloperLife",
    likes: 142,
    comments: 19,
    shares: 12,
    createdAt: '2023-06-10T11:05:00Z',
  },
  {
    id: '7',
    user: users[1],
    content: "Just launched my portfolio website! Built with React and Tailwind CSS. Would love some feedback from fellow designers and developers.",
    images: [
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
    ],
    likes: 110,
    comments: 28,
    shares: 9,
    createdAt: '2023-06-09T16:40:00Z',
    isSaved: true,
  },
];

export const communityPosts: Post[] = [
  {
    id: '8',
    user: users[2],
    content: "Started learning React Native last month and just published my first app to the App Store! It's a simple habit tracker but I'm really proud of it. #ReactNative #MobileApp #FirstApp",
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
    ],
    likes: 65,
    comments: 14,
    shares: 3,
    createdAt: '2023-06-08T13:15:00Z',
  },
  {
    id: '9',
    user: users[3],
    content: "Looking for recommendations on state management libraries for React Native. Currently using Redux but considering alternatives like MobX or Zustand. What's your preference?",
    likes: 42,
    comments: 37,
    shares: 2,
    createdAt: '2023-06-07T10:30:00Z',
  },
  {
    id: '10',
    user: users[4],
    content: "Just attended a great workshop on UI/UX design principles. Here are some key takeaways: 1) Always design with accessibility in mind, 2) Consistency is key, 3) Test with real users early and often. #UXDesign",
    likes: 89,
    comments: 12,
    shares: 8,
    createdAt: '2023-06-06T17:50:00Z',
  },
  {
    id: '11',
    user: users[0],
    content: "Question for the community: What's your favorite code editor for React Native development? I've been using VS Code but curious about other options.",
    likes: 73,
    comments: 45,
    shares: 1,
    createdAt: '2023-06-05T14:10:00Z',
  },
  {
    id: '12',
    user: users[1],
    content: "Just discovered the React Native Reanimated library and it's a game-changer for animations! The declarative API makes complex animations so much easier to implement. #ReactNative #Animation",
    images: [
      'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80',
    ],
    likes: 118,
    comments: 22,
    shares: 15,
    createdAt: '2023-06-04T09:25:00Z',
  },
];

export default posts;