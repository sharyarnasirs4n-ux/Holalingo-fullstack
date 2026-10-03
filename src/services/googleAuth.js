import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://holalingo-backend.onrender.com';

const WEB_CLIENT_ID = '889423555504-dde8220v40elh77ggklf5gt576bbraf0.apps.googleusercontent.com';
const IOS_CLIENT_ID = '889423555504-fmt7podhie8eekk59mf2aq2goeiritvk.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
});

export async function signInWithGoogle() {
  try {
    console.log('1. STARTING GOOGLE LOGIN');

    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    console.log('2. GOOGLE SIGN-IN SUCCESS');

    console.log('GOOGLE USER:', userInfo);

    const idToken = userInfo?.data?.idToken;

    if (!idToken) {
  if (userInfo?.type === 'cancelled') {
    console.log('GOOGLE LOGIN CANCELLED');
    return null;
  }

  throw new Error(
    'Google did not return an ID token'
  );
}

    console.log('3. GOOGLE ID TOKEN RECEIVED');

    const response = await fetch(
      `${API_URL}/auth/google`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          id_token: idToken,
        }),
      }
    );

    const data = await response.json();

    console.log(
      '4. GOOGLE BACKEND RESPONSE:',
      data
    );
    console.log(data.access_token)

    if (!response.ok) {
      throw new Error(
        data.detail || 'Google login failed'
      );
    }

    await SecureStore.setItemAsync(
      'access_token',
      data.access_token
    );

    console.log(
      '5. GOOGLE ACCESS TOKEN SAVED'
    );

    return data;

  } catch (error) {

    console.log(
      'GOOGLE LOGIN ERROR:',
      error
    );

    throw error;
  }
}