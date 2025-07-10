// Core data types for the Digital Routine & Results Tracker

export interface RoutineItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  detailedInfo?: {
    purpose: string;
    benefits: string[];
    tips: string[];
    timeRecommendation?: string;
    frequency?: string;
  };
}

export interface DailyProgress {
  userId: string;
  date: string; // YYYY-MM-DD format
  completedItems: string[]; // Array of routine item IDs
  lastUpdated: string; // ISO timestamp
}

export interface User {
  id: string;
  name: string;
  createdAt: string; // ISO timestamp
  lastActive: string; // ISO timestamp
}

export interface HistoricalData {
  userId: string;
  date: string; // YYYY-MM-DD format
  completedItems: string[];
  completionRate: number; // Percentage (0-100)
  streak: number; // Days in a row with activity
}

// Default routine items that every user gets
export const DEFAULT_ROUTINE_ITEMS: RoutineItem[] = [
  {
    id: 'prayer',
    name: 'Prayer',
    icon: '🙏',
    description: 'Daily spiritual practice and reflection',
    detailedInfo: {
      purpose: 'Connect with your spiritual side and find inner peace through daily prayer and meditation.',
      benefits: [
        'Reduces stress and anxiety',
        'Provides mental clarity and focus',
        'Strengthens spiritual connection',
        'Promotes gratitude and mindfulness'
      ],
      tips: [
        'Set aside a quiet time each day',
        'Find a comfortable, peaceful space',
        'Start with just 5-10 minutes if you\'re new',
        'Use prayer beads or meditation apps if helpful'
      ],
      timeRecommendation: '10-30 minutes',
      frequency: 'Daily, preferably same time each day'
    }
  },
  {
    id: 'study',
    name: 'Study',
    icon: '📚',
    description: 'Learning, reading, or skill development',
    detailedInfo: {
      purpose: 'Continuous learning and personal development through reading, courses, or skill practice.',
      benefits: [
        'Expands knowledge and skills',
        'Improves cognitive function',
        'Enhances career prospects',
        'Builds confidence and competence'
      ],
      tips: [
        'Choose topics that interest and challenge you',
        'Set specific learning goals',
        'Take notes and review regularly',
        'Apply what you learn in real situations'
      ],
      timeRecommendation: '30-60 minutes',
      frequency: 'Daily, consistent schedule works best'
    }
  },
  {
    id: 'hygiene',
    name: 'Hygiene',
    icon: '🧼',
    description: 'Personal care and cleanliness',
    detailedInfo: {
      purpose: 'Maintain physical health and personal presentation through proper hygiene practices.',
      benefits: [
        'Prevents illness and infections',
        'Boosts self-confidence',
        'Shows respect for others',
        'Maintains professional appearance'
      ],
      tips: [
        'Brush teeth twice daily',
        'Shower regularly and use deodorant',
        'Keep nails clean and trimmed',
        'Maintain clean, appropriate clothing'
      ],
      timeRecommendation: '20-45 minutes total',
      frequency: 'Multiple times daily as needed'
    }
  },
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    description: 'Professional tasks and responsibilities',
    detailedInfo: {
      purpose: 'Focus on productive work activities that contribute to your career and financial goals.',
      benefits: [
        'Builds career advancement',
        'Provides financial stability',
        'Develops professional skills',
        'Creates sense of accomplishment'
      ],
      tips: [
        'Prioritize important tasks first',
        'Take regular breaks to maintain focus',
        'Set clear daily and weekly goals',
        'Minimize distractions during work time'
      ],
      timeRecommendation: '6-8 hours',
      frequency: 'Daily during work days'
    }
  },
  {
    id: 'exercise',
    name: 'Exercise',
    icon: '💪',
    description: 'Physical activity and fitness',
    detailedInfo: {
      purpose: 'Maintain physical health and fitness through regular exercise and movement.',
      benefits: [
        'Improves cardiovascular health',
        'Builds strength and endurance',
        'Enhances mood and energy',
        'Helps maintain healthy weight'
      ],
      tips: [
        'Start with activities you enjoy',
        'Begin slowly and gradually increase intensity',
        'Mix cardio, strength, and flexibility training',
        'Stay hydrated and listen to your body'
      ],
      timeRecommendation: '30-60 minutes',
      frequency: 'Daily or at least 5 times per week'
    }
  },
  {
    id: 'nutrition',
    name: 'Nutrition',
    icon: '🥗',
    description: 'Healthy eating and meal planning',
    detailedInfo: {
      purpose: 'Nourish your body with healthy, balanced meals and proper nutrition.',
      benefits: [
        'Provides sustained energy',
        'Supports immune system',
        'Improves mental clarity',
        'Maintains healthy weight'
      ],
      tips: [
        'Plan meals in advance',
        'Include variety of fruits and vegetables',
        'Stay hydrated throughout the day',
        'Practice portion control and mindful eating'
      ],
      timeRecommendation: '15-30 minutes per meal',
      frequency: '3 main meals + healthy snacks'
    }
  },
  {
    id: 'reflection',
    name: 'Reflection',
    icon: '🤔',
    description: 'Daily journaling or self-reflection',
    detailedInfo: {
      purpose: 'Take time to reflect on your day, thoughts, and personal growth journey.',
      benefits: [
        'Increases self-awareness',
        'Helps process emotions',
        'Tracks personal growth',
        'Improves decision-making'
      ],
      tips: [
        'Write about your day\'s highlights and challenges',
        'Ask yourself what you learned today',
        'Set intentions for tomorrow',
        'Be honest and non-judgmental with yourself'
      ],
      timeRecommendation: '10-20 minutes',
      frequency: 'Daily, preferably evening'
    }
  },
  {
    id: 'connection',
    name: 'Connection',
    icon: '👥',
    description: 'Meaningful social interactions',
    detailedInfo: {
      purpose: 'Build and maintain meaningful relationships with family, friends, and community.',
      benefits: [
        'Reduces feelings of loneliness',
        'Provides emotional support',
        'Enhances sense of belonging',
        'Improves mental health'
      ],
      tips: [
        'Reach out to someone you care about',
        'Practice active listening',
        'Share your thoughts and feelings openly',
        'Make time for quality conversations'
      ],
      timeRecommendation: '30-60 minutes',
      frequency: 'Daily interactions, deeper connections weekly'
    }
  }
];

// Utility functions for date handling
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Check if it's a new day (for reset logic)
export const isNewDay = (lastDate: string): boolean => {
  return getCurrentDate() !== lastDate;
};

// Calculate completion rate
export const calculateCompletionRate = (completed: string[], total: number): number => {
  return Math.round((completed.length / total) * 100);
};

// Generate user ID (simple approach for now)
export const generateUserId = (name: string): string => {
  const timestamp = Date.now();
  const nameHash = name.toLowerCase().replace(/\s+/g, '-');
  return `${nameHash}-${timestamp}`;
};
