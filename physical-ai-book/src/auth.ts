import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

const { siteConfig: { customFields } } = useDocusaurusContext();

const API_BASE_URL = customFields.backendUrl;

// Export auth-related functions
export const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Sign in failed');
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-out`, {
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Sign out failed');
    }

    return data;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Sign up failed');
    }

    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const getAuthSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      // If not authenticated, return null
      if (response.status === 401) {
        return null;
      }
      throw new Error(data.message || 'Failed to get session');
    }

    return data;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
};