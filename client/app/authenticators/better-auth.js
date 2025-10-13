import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default class BetterAuthAuthenticator extends BaseAuthenticator {
  async authenticate(email, password) {
    const response = await fetch(
      'http://localhost:3001/api/auth/sign-in/email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include', // Important for cookies/sessions
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication failed');
    }

    const data = await response.json();

    // Return the session data that will be stored
    return {
      user: data.user,
      token: data.token,
      session: data.session,
    };
  }

  async restore(data) {
    // You might want to validate the session with the server
    // For now, we'll just return the stored data if it exists
    if (data && data.user) {
      return data;
    }

    throw new Error('Session could not be restored');
  }

  async invalidate() {
    // Call the logout endpoint
    try {
      await fetch('http://localhost:3001/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      // Even if logout fails on server, we should clear local session
      console.warn('Server logout failed:', error);
    }

    return Promise.resolve();
  }
}
