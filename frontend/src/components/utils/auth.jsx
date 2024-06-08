// utils/auth.js
import { toast } from 'react-hot-toast';

export const logout = async () => {
  try {
    // Send a request to the backend logout route
    const response = await fetch('http://localhost:3106/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      localStorage.removeItem('userToken');
      setTimeout(() => {
        window.location.href = '/';
        }, 2000);
      toast.success('Logged out successfully');
    } else {
      console.error('Logout failed.');
      toast.error('Logout failed');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    toast.error('Error during logout');
  }
};
