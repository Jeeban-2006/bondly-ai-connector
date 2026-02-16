export type RelationshipType = 'Family' | 'Friend' | 'Colleague' | 'Partner' | 'Acquaintance';
export type HealthStatus = 'strong' | 'check' | 'overdue';

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  relationshipType: RelationshipType;
  importance: number;
  birthday: string;
  lastContacted: string;
  healthScore: number;
  healthStatus: HealthStatus;
  notes: string;
  interactions: Interaction[];
}

export interface Interaction {
  id: string;
  date: string;
  type: 'call' | 'message' | 'meeting' | 'gift' | 'note';
  description: string;
}

const getHealthStatus = (score: number): HealthStatus => {
  if (score >= 70) return 'strong';
  if (score >= 40) return 'check';
  return 'overdue';
};

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '',
    relationshipType: 'Friend',
    importance: 5,
    birthday: '1994-03-15',
    lastContacted: '2 days ago',
    healthScore: 92,
    healthStatus: 'strong',
    notes: 'Loves hiking and photography. Recently got promoted.',
    interactions: [
      { id: '1', date: '2026-02-14', type: 'message', description: 'Sent Valentine\'s Day wishes' },
      { id: '2', date: '2026-02-10', type: 'call', description: 'Caught up about her new role' },
      { id: '3', date: '2026-01-28', type: 'meeting', description: 'Coffee at Blue Bottle' },
      { id: '4', date: '2026-01-15', type: 'gift', description: 'Sent her a book on landscape photography' },
    ],
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: '',
    relationshipType: 'Colleague',
    importance: 4,
    birthday: '1991-07-22',
    lastContacted: '1 week ago',
    healthScore: 68,
    healthStatus: 'check',
    notes: 'Working on the Q2 product launch together.',
    interactions: [
      { id: '5', date: '2026-02-09', type: 'meeting', description: 'Sprint planning meeting' },
      { id: '6', date: '2026-01-30', type: 'message', description: 'Shared project update' },
    ],
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    avatar: '',
    relationshipType: 'Family',
    importance: 5,
    birthday: '1968-11-08',
    lastContacted: '3 weeks ago',
    healthScore: 35,
    healthStatus: 'overdue',
    notes: 'Mom. Loves gardening and cooking. Call her more often!',
    interactions: [
      { id: '7', date: '2026-01-25', type: 'call', description: 'Quick Sunday call' },
      { id: '8', date: '2026-01-01', type: 'meeting', description: 'New Year\'s family dinner' },
    ],
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: '',
    relationshipType: 'Friend',
    importance: 3,
    birthday: '1993-05-30',
    lastContacted: '4 days ago',
    healthScore: 85,
    healthStatus: 'strong',
    notes: 'College friend. Big into gaming and craft beer.',
    interactions: [
      { id: '9', date: '2026-02-12', type: 'message', description: 'Shared a funny meme' },
      { id: '10', date: '2026-02-05', type: 'meeting', description: 'Game night at his place' },
    ],
  },
  {
    id: '5',
    name: 'Aisha Patel',
    avatar: '',
    relationshipType: 'Acquaintance',
    importance: 2,
    birthday: '1996-09-14',
    lastContacted: '1 month ago',
    healthScore: 28,
    healthStatus: 'overdue',
    notes: 'Met at a networking event. Works in UX design.',
    interactions: [
      { id: '11', date: '2026-01-16', type: 'message', description: 'Connected on LinkedIn' },
    ],
  },
  {
    id: '6',
    name: 'James O\'Brien',
    avatar: '',
    relationshipType: 'Partner',
    importance: 5,
    birthday: '1992-12-03',
    lastContacted: '1 day ago',
    healthScore: 96,
    healthStatus: 'strong',
    notes: 'Best partner ever. Plans to visit Tokyo together in spring.',
    interactions: [
      { id: '12', date: '2026-02-15', type: 'meeting', description: 'Dinner date at Olive Garden' },
      { id: '13', date: '2026-02-14', type: 'gift', description: 'Valentine\'s surprise!' },
      { id: '14', date: '2026-02-13', type: 'call', description: 'Evening video call' },
    ],
  },
];

export const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase();

export const getAvatarColor = (name: string) => {
  const colors = [
    'bg-primary', 'bg-accent', 'bg-success', 'bg-warning',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
