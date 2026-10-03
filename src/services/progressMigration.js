import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from './authStorage';

const API_URL = 'https://holalingo-backend.onrender.com';

const STORAGE_KEY = 'spanish_progress';

export async function migrateGuestProgress() {
  try {
    const savedProgress = await AsyncStorage.getItem(
      STORAGE_KEY
    );

    if (!savedProgress) {
      console.log('NO GUEST PROGRESS TO MIGRATE');
      return;
    }

    const guestProgress = JSON.parse(savedProgress);

    console.log(
      'GUEST PROGRESS TO MIGRATE:',
      guestProgress
    );

    const token = await getToken();

    if (!token) {
      throw new Error(
        'No access token found for migration'
      );
    }

    const response = await fetch(
      `${API_URL}/progress/migrate`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          xp: guestProgress.xp ?? 0,

          completed_lessons:
            guestProgress.completedLessons ?? [],

          study_dates:
            guestProgress.studyDates ?? [],
        }),
      }
    );

    const data = await response.json();

    console.log(
      'GUEST MIGRATION RESPONSE:',
      data
    );

    if (!response.ok) {
      throw new Error(
        data.detail ||
        'Failed to migrate guest progress'
      );
    }

   
    await AsyncStorage.removeItem(
      STORAGE_KEY
    );

    console.log(
      'GUEST PROGRESS MIGRATED AND LOCAL DATA CLEARED'
    );

    return data;

  } catch (error) {

    console.log(
      'GUEST MIGRATION ERROR:',
      error
    );

    throw error;
  }
}