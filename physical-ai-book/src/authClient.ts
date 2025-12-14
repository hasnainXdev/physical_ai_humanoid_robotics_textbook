// Import our updated auth functions
import { signIn as signInFunc, signOut as signOutFunc, getAuthSession } from './auth';

// Create a simple client wrapper for our auth functions
export const signIn = signInFunc;
export const signOut = signOutFunc;

// Mock useSession hook - for actual session management, we'd need to implement a proper React hook
// For now, we'll provide a function to get the session
export const useSession = () => {
  // This would typically be a React hook that manages session state
  // In Docusaurus, we'll keep it simple with a getter function
  return { getSession: getAuthSession };
};