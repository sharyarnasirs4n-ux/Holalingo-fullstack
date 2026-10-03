import {
  saveToken,
  getToken,
  removeToken,
} from './authStorage';

const API_URL = 'https://holalingo-backend.onrender.com';



export const registerUser = async (
  email,
  password,
  level = 'A0'
) => {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
        level,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || 'Unable to create account'
    );
  }

  return data;
};




export const loginUser = async (
  email,
  password
) => {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || 'Unable to sign in'
    );
  }

  await saveToken(data.access_token);

  return data;
};




export const getCurrentUser = async () => {
  const token = await getToken();

  if (!token) {
    return null;
  }

  const response = await fetch(
    `${API_URL}/auth/me`,
    {
      method: 'GET',

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      await removeToken();
      return null;
    }

    throw new Error(
      'Failed to get current user'
    );
  }

  return await response.json();
};



export const addFavorite = async (
  favorite
) => {
  const token = await getToken();

  if (!token) {
    throw new Error(
      'User is not authenticated'
    );
  }

  const response = await fetch(
    `${API_URL}/favorites`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        word: favorite.word,
        translation: favorite.translation,
        example_1: favorite.example_1,
        example_2: favorite.example_2,
        example_translation_1:
          favorite.example_translation_1,
        example_translation_2:
          favorite.example_translation_2,
        level: favorite.level,
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(
        'Word is already in favorites'
      );
    }

    throw new Error(
      'Failed to add favorite'
    );
  }

  return await response.json();
};




export const getFavorites = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error(
      'User is not authenticated'
    );
  }

  const response = await fetch(
    `${API_URL}/favorites`,
    {
      method: 'GET',

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      'Failed to get favorites'
    );
  }

  return await response.json();
};



export const deleteFavorite = async (
  favoriteId
) => {
  const token = await getToken();

  if (!token) {
    throw new Error(
      'User is not authenticated'
    );
  }

  const response = await fetch(
    `${API_URL}/favorites/${favoriteId}`,
    {
      method: 'DELETE',

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      'Failed to delete favorite'
    );
  }

  return true;
};



export const deleteAccount = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error(
      'User is not authenticated'
    );
  }

  const response = await fetch(
    `${API_URL}/auth/account`,
    {
      method: 'DELETE',

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      'Failed to delete account'
    );
  }

  await removeToken();

  return await response.json();
};

// UPDATE PROFILE
export const updateProfile = async (profileData) => {
  const token = await getToken();

  if (!token) {
    throw new Error(
      'User is not authenticated'
    );
  }

  const response = await fetch(
    `${API_URL}/auth/profile`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        'Failed to update profile'
    );
  }

  return data;
};