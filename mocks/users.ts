import { User } from '@/types';

export const users: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarahj',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    bio: 'UX Designer | Coffee enthusiast | Dog lover',
    isVerified: true,
    followers: 1250,
    following: 365,
    joinedDate: '2022-01-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    username: 'mikechen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    bio: 'Software Engineer | React Native Developer',
    isVerified: true,
    followers: 3420,
    following: 512,
    joinedDate: '2021-11-03',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    username: 'emmaw',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    bio: 'Travel photographer | Explorer',
    isVerified: false,
    followers: 876,
    following: 235,
    joinedDate: '2022-03-22',
  },
  {
    id: '4',
    name: 'David Kim',
    username: 'davidk',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    bio: 'Product Manager | Tech enthusiast',
    isVerified: true,
    followers: 2150,
    following: 178,
    joinedDate: '2021-09-10',
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    username: 'oliviam',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    bio: 'Content Creator | Digital Marketing',
    isVerified: false,
    followers: 945,
    following: 412,
    joinedDate: '2022-02-18',
  },
];

export const currentUser = users[0];

export default users;