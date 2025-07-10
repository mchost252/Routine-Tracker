// Authorized users configuration for the Digital Routine & Results Tracker
// Only users with names in this list can access the application

export interface AuthorizedUser {
  name: string;
  displayName?: string; // Optional custom display name
  role?: 'admin' | 'user'; // Future role-based features
  joinDate?: string; // When they were added
}

// List of authorized users - Add names here to grant access
export const AUTHORIZED_USERS: AuthorizedUser[] = [
  {
    name: "Obinna",
    displayName: "Mchost",
    role: "admin",
    joinDate: "2025-01-10"
  },
  {
    name: "Daniel",
    displayName: "Aj danny Roze", 
    role: "user",
    joinDate: "2025-01-10"
  },
  // Add more authorized users here...
  // Format: { name: "full name", displayName: "Display Name", role: "user" }
];

// Utility functions for user authorization
export const isUserAuthorized = (inputName: string): boolean => {
  const normalizedInput = inputName.toLowerCase().trim();
  return AUTHORIZED_USERS.some(user => 
    user.name.toLowerCase() === normalizedInput
  );
};

export const getAuthorizedUser = (inputName: string): AuthorizedUser | null => {
  const normalizedInput = inputName.toLowerCase().trim();
  return AUTHORIZED_USERS.find(user => 
    user.name.toLowerCase() === normalizedInput
  ) || null;
};

export const getUserDisplayName = (inputName: string): string => {
  const user = getAuthorizedUser(inputName);
  return user?.displayName || inputName;
};

export const isAdmin = (inputName: string): boolean => {
  const user = getAuthorizedUser(inputName);
  return user?.role === 'admin';
};

// Get total number of authorized users
export const getAuthorizedUsersCount = (): number => {
  return AUTHORIZED_USERS.length;
};

// Get all authorized user names (for admin purposes)
export const getAllAuthorizedNames = (): string[] => {
  return AUTHORIZED_USERS.map(user => user.displayName || user.name);
};
