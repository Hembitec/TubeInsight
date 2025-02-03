import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types/auth';

export const adaptFirebaseUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    credits: 0, // Default value until migration
    created_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
    updated_at: firebaseUser.metadata.lastSignInTime || new Date().toISOString()
  };
};

// Temporary solution until user table migration
export const checkCredits = async (userId: string): Promise<number> => {
  // TODO: Implement Firebase Firestore connection
  return 5; // Default credit value
};
