import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://holalingo-backend.onrender.com';

export async function signInWithApple() {
  try {
    const nonce = Crypto.randomUUID();

    console.log('1. STARTING APPLE LOGIN');
    console.log('2. NONCE CREATED');

    const credential = await AppleAuthentication.signInAsync({
      nonce,
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    console.log('3. APPLE SIGN-IN SUCCESS');
    console.log(
      'HAS IDENTITY TOKEN:',
      !!credential.identityToken
    );

    if (!credential.identityToken) {
      throw new Error(
        'Apple did not return an identity token'
      );
    }

    console.log(
      '4. SENDING APPLE TOKEN TO BACKEND'
    );

    const response = await fetch(
      `${API_URL}/auth/apple`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
  identity_token: credential.identityToken,
  nonce: nonce,
  email: credential.email,
  name: credential.fullName
    ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
    : null,
}),
      }
    );

    const data = await response.json();

    console.log(
      '5. APPLE BACKEND RESPONSE:',
      data
    );
    console.log(data.access_token)

    if (!response.ok) {
      throw new Error(
        data.detail || 'Apple login failed'
      );
    }

    await SecureStore.setItemAsync(
      'access_token',
      data.access_token
    );

    console.log(
      '6. ACCESS TOKEN SAVED'
    );

    return data;

  } catch (error) {

    console.log(
      'APPLE ERROR:',
      error
    );

    console.log(
      'APPLE ERROR MESSAGE:',
      error?.message
    );

    throw error;
  }
}