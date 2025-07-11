// Core data types for the Digital Routine & Results Tracker

export interface RoutineItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  daysOfWeek?: number[]; // Optional: specific days (0=Sunday, 1=Monday, ..., 6=Saturday). If not specified, shows every day
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
  pin?: string; // Optional PIN for security (hashed)
  hasPinSetup?: boolean; // Whether user has set up PIN
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
      purpose: 'Connect with the divine, find inner peace, and seek guidance for daily life.',
      benefits: [
        'Reduces stress and anxiety',
        'Provides spiritual guidance and clarity',
        'Strengthens faith and spiritual connection',
        'Promotes gratitude and mindfulness',
        'Offers comfort during difficult times'
      ],
      tips: [
        'Set aside a quiet, dedicated space for prayer',
        'Choose a consistent time each day',
        'Start with gratitude and thanksgiving',
        'Include prayers for others, not just yourself',
        'Listen for guidance and inner peace'
      ],
      timeRecommendation: '10-30 minutes',
      frequency: 'Daily'
    }
  },
  {
    id: 'study',
    name: 'Study',
    icon: '📚',
    description: 'Learning, reading, or skill development',
    detailedInfo: {
      purpose: 'Expand knowledge, develop skills, and pursue personal or professional growth through dedicated learning.',
      benefits: [
        'Improves cognitive function and memory',
        'Enhances career prospects and opportunities',
        'Builds confidence and self-esteem',
        'Keeps mind sharp and engaged',
        'Opens new perspectives and ideas'
      ],
      tips: [
        'Create a distraction-free study environment',
        'Use active learning techniques (notes, summaries)',
        'Take regular breaks to maintain focus',
        'Set specific, achievable learning goals',
        'Review and practice regularly for retention'
      ],
      timeRecommendation: '30-120 minutes',
      frequency: 'Daily'
    }
  },
  {
    id: 'hygiene',
    name: 'Hygiene',
    icon: '🧼',
    description: 'Personal care and cleanliness',
    detailedInfo: {
      purpose: 'Maintain personal cleanliness, health, and confidence through proper hygiene practices.',
      benefits: [
        'Prevents illness and infections',
        'Boosts self-confidence and social acceptance',
        'Improves overall health and well-being',
        'Creates positive first impressions',
        'Reduces stress and anxiety about appearance'
      ],
      tips: [
        'Establish a consistent daily routine',
        'Use quality hygiene products suited for your skin type',
        'Pay attention to often-missed areas (behind ears, between toes)',
        'Replace hygiene items regularly (toothbrush, razors)',
        'Stay hydrated to support healthy skin and hair'
      ],
      timeRecommendation: '20-45 minutes',
      frequency: 'Daily'
    }
  },
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    description: 'Professional tasks and responsibilities',
    detailedInfo: {
      purpose: 'Accomplish professional goals, contribute value, and advance career through focused work.',
      benefits: [
        'Provides financial stability and security',
        'Builds professional skills and experience',
        'Creates sense of purpose and achievement',
        'Develops problem-solving abilities',
        'Expands professional network and opportunities'
      ],
      tips: [
        'Set clear daily and weekly goals',
        'Prioritize tasks using time management techniques',
        'Take regular breaks to maintain productivity',
        'Minimize distractions during focused work time',
        'Continuously learn and improve your skills'
      ],
      timeRecommendation: '6-8 hours',
      frequency: 'Weekdays'
    }
  },
  {
    id: 'exercise',
    name: 'Exercise',
    icon: '💪',
    description: 'Physical activity and fitness',
    detailedInfo: {
      purpose: 'Maintain physical health, build strength, and improve overall well-being through regular exercise.',
      benefits: [
        'Improves cardiovascular health and endurance',
        'Builds muscle strength and bone density',
        'Enhances mental health and reduces stress',
        'Boosts energy levels and sleep quality',
        'Helps maintain healthy weight and metabolism'
      ],
      tips: [
        'Start with activities you enjoy to build consistency',
        'Gradually increase intensity and duration',
        'Include both cardio and strength training',
        'Stay hydrated before, during, and after exercise',
        'Listen to your body and allow for rest days'
      ],
      timeRecommendation: '30-60 minutes',
      frequency: 'Daily or 5-6 times per week'
    }
  },
  {
    id: 'nutrition',
    name: 'Nutrition',
    icon: '🥗',
    description: 'Healthy eating and meal planning',
    detailedInfo: {
      purpose: 'Fuel your body with nutritious foods to support optimal health, energy, and well-being.',
      benefits: [
        'Provides essential nutrients for body functions',
        'Maintains stable energy levels throughout the day',
        'Supports immune system and disease prevention',
        'Improves mental clarity and cognitive function',
        'Helps maintain healthy weight and metabolism'
      ],
      tips: [
        'Plan meals in advance to avoid unhealthy choices',
        'Include a variety of colorful fruits and vegetables',
        'Stay hydrated with plenty of water',
        'Practice portion control and mindful eating',
        'Limit processed foods and added sugars'
      ],
      timeRecommendation: '30-60 minutes for meal prep',
      frequency: 'Daily meal planning and preparation'
    }
  },
  {
    id: 'reflection',
    name: 'Reflection',
    icon: '🤔',
    description: 'Daily journaling or self-reflection',
    detailedInfo: {
      purpose: 'Gain self-awareness, process experiences, and promote personal growth through thoughtful reflection.',
      benefits: [
        'Increases self-awareness and emotional intelligence',
        'Helps process and learn from experiences',
        'Reduces stress and promotes mental clarity',
        'Identifies patterns and areas for improvement',
        'Enhances gratitude and positive mindset'
      ],
      tips: [
        'Set aside quiet time without distractions',
        'Write freely without worrying about grammar',
        'Ask yourself meaningful questions about your day',
        'Focus on both challenges and achievements',
        'Review past entries to track growth and patterns'
      ],
      timeRecommendation: '10-30 minutes',
      frequency: 'Daily, preferably evening'
    }
  },
  {
    id: 'connection',
    name: 'Connection',
    icon: '👥',
    description: 'Meaningful social interactions',
    detailedInfo: {
      purpose: 'Build and maintain meaningful relationships that provide support, joy, and personal growth.',
      benefits: [
        'Reduces feelings of loneliness and isolation',
        'Provides emotional support and encouragement',
        'Enhances mental health and well-being',
        'Creates opportunities for learning and growth',
        'Builds a strong support network for life challenges'
      ],
      tips: [
        'Be present and actively listen during conversations',
        'Reach out to friends and family regularly',
        'Engage in shared activities and interests',
        'Show genuine interest in others\' lives and experiences',
        'Practice empathy and offer support when needed'
      ],
      timeRecommendation: '30-60 minutes',
      frequency: 'Daily interactions, deeper connections weekly'
    }
  },
  {
    id: 'fasting',
    name: 'Fasting',
    icon: '🌙',
    description: 'Spiritual fasting practice',
    daysOfWeek: [3, 5], // Wednesday (3) and Friday (5)
    detailedInfo: {
      purpose: 'Engage in spiritual discipline, self-control, and deeper connection with faith through fasting.',
      benefits: [
        'Develops self-discipline and willpower',
        'Enhances spiritual awareness and focus',
        'Promotes gratitude for daily blessings',
        'Encourages prayer and meditation',
        'Builds empathy for those less fortunate'
      ],
      tips: [
        'Start with shorter fasting periods if new to fasting',
        'Stay hydrated with water throughout the day',
        'Use fasting time for prayer and reflection',
        'Break your fast gently with light, healthy foods',
        'Consult healthcare provider if you have medical conditions'
      ],
      timeRecommendation: 'Sunrise to sunset',
      frequency: 'Wednesdays and Fridays'
    }
  }
];

// Get Nigerian time (West Africa Time - UTC+1)
const getNigerianTime = (): Date => {
  // Create a date in Nigerian timezone
  const now = new Date();
  const nigerianTimeString = now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  return new Date(nigerianTimeString);
};

// Get routine items for a specific day (filters by day of week)
export const getRoutineItemsForDay = (date?: Date): RoutineItem[] => {
  const targetDate = date || getNigerianTime();
  const dayOfWeek = targetDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

  return DEFAULT_ROUTINE_ITEMS.filter(item => {
    // If no specific days are defined, show the item every day
    if (!item.daysOfWeek || item.daysOfWeek.length === 0) {
      return true;
    }
    // Otherwise, only show on specified days
    return item.daysOfWeek.includes(dayOfWeek);
  });
};

// Get routine items for today
export const getTodayRoutineItems = (): RoutineItem[] => {
  return getRoutineItemsForDay();
};

// Utility functions for date handling (using Nigerian time)
export const getCurrentDate = (): string => {
  return getNigerianTime().toISOString().split('T')[0];
};

export const getCurrentTimestamp = (): string => {
  return getNigerianTime().toISOString();
};

// Get current Nigerian time for display
export const getNigerianTimeDisplay = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Africa/Lagos'
  });
};

// Check if it's a new day (for reset logic)
export const isNewDay = (lastDate: string): boolean => {
  return getCurrentDate() !== lastDate;
};

// Calculate completion rate
export const calculateCompletionRate = (completed: string[], total: number): number => {
  return Math.round((completed.length / total) * 100);
};

// Generate user ID (consistent based on name only)
export const generateUserId = (name: string): string => {
  // Create a consistent ID based on the name only (no timestamp)
  const nameHash = name.toLowerCase().replace(/\s+/g, '-');
  // Add a simple hash to make it more unique but still consistent
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${nameHash}-${Math.abs(hash)}`;
};
