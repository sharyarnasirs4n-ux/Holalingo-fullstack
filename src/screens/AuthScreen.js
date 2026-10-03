import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { migrateGuestProgress } from '../services/progressMigration';
import { loginUser } from '../services/api';
import { useTheme } from '../Context/ThemeContext';
import { signInWithGoogle } from '../services/googleAuth';
import { signInWithApple } from '../services/appleAuth';

export default function AuthScreen({ navigation,onLogin, }) {
 const { colors } = useTheme();
   const styles = createStyles(colors);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);



  const handleAppleLogin = async () => {
  try {
    const result = await signInWithApple();

    console.log('APPLE RESULT:', result);

    await migrateGuestProgress();

console.log(
  'APPLE GUEST MIGRATION COMPLETE'
);

onLogin();

  } catch (error) {

    if (error?.code === 'ERR_REQUEST_CANCELED') {
      return;
    }

    console.log('APPLE LOGIN ERROR:', error);

    Alert.alert(
      'Apple Login Error',
      'Unable to sign in with Apple.'
    );
  }
};

  
 const handleGoogleLogin = async () => {

  if (googleLoading) {
    return;
  }

  try {

    setGoogleLoading(true);

    const result = await signInWithGoogle();

    console.log('GOOGLE LOGIN RESULT:', result);

    await migrateGuestProgress();

console.log(
  'GOOGLE GUEST MIGRATION COMPLETE'
);

onLogin();

  } catch (error) {

    console.log('GOOGLE LOGIN ERROR:', error);

    Alert.alert(
      'Google Login Error',
      'Unable to sign in with Google.'
    );

  } finally {

    setGoogleLoading(false);

  }

};


  
  const handleEmailLogin = async () => {

  if (emailLoading) {
    return;
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    Alert.alert(
      'Missing email',
      'Please enter your email address.'
    );
    return;
  }

  if (!password) {
    Alert.alert(
      'Missing password',
      'Please enter your password.'
    );
    return;
  }

  try {

    setEmailLoading(true);

    await loginUser(
      cleanEmail,
      password
    );

    await migrateGuestProgress();

    console.log(
      'EMAIL GUEST MIGRATION COMPLETE'
    );

    onLogin();

  } catch (error) {

    console.log(
      'EMAIL LOGIN ERROR:',
      error
    );

    Alert.alert(
      'Login Error',
      error?.message ||
        'Unable to sign in. Please check your email and password.'
    );

  } finally {

    setEmailLoading(false);

  }
};


  
  return (

    <SafeAreaView style={styles.container}>

      
      <View style={styles.header}>

        <Text style={styles.title}>
          Welcome back!
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue your Spanish journey.
        </Text>

      </View>


      
      <View style={styles.socialButtons}>


        <Pressable
          style={[
            styles.socialButton,
            googleLoading && styles.socialButtonDisabled,
          ]}
          disabled={googleLoading}
          onPress={handleGoogleLogin}
        >

          <Text style={styles.socialIcon}>
            G
          </Text>

          <Text style={styles.socialButtonText}>
            {googleLoading
              ? 'Signing in...'
              : 'Continue with Google'}
          </Text>

        </Pressable>



        <AppleAuthentication.AppleAuthenticationButton
  buttonType={
    AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
  }
  buttonStyle={
    AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
  }
  cornerRadius={16}
  style={styles.appleButton}
  onPress={handleAppleLogin}
/>

          

      </View>


      
      <View style={styles.dividerContainer}>

        <View style={styles.divider} />

        <Text style={styles.dividerText}>
          OR
        </Text>

        <View style={styles.divider} />

      </View>


      
      <View style={styles.form}>


        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={colors.textLight}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />



        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={colors.textLight}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />



        <Pressable
  style={[
    styles.loginButton,
    emailLoading && styles.loginButtonDisabled,
  ]}
  onPress={handleEmailLogin}
  disabled={emailLoading}
>

  <Text style={styles.loginButtonText}>
    {emailLoading
      ? 'Signing in...'
      : 'Log In'}
  </Text>

</Pressable>

      </View>


      
      <View style={styles.signupContainer}>

        <Text style={styles.signupText}>
          Don't have an account?
        </Text>

        <Pressable
          onPress={() => {
  navigation.navigate('Register');
}}

          
        >

          <Text style={styles.signupLink}>
            Create account
          </Text>

        </Pressable>

      </View>


      
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >

        <Text style={styles.backText}>
          ← Back
        </Text>

      </Pressable>
      <Pressable
  style={styles.levelButton}
  onPress={() => navigation.navigate('Level')}
>
  <Text style={styles.levelButtonText}>
    Continue to Level Selection
  </Text>
</Pressable>

    </SafeAreaView>

  );
}



const createStyles = (colors) => ({
  
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 22,
  },

  
  header: {
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 32,
  },

  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },

  
  socialButtons: {
    gap: 12,
  },

  socialButton: {
    height: 54,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  socialButtonDisabled: {
    opacity: 0.5,
  },

  socialIcon: {
    fontSize: 19,
    fontWeight: '800',
    marginRight: 10,
    color: colors.text,
  },

  socialButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },

  
  appleButton: {
    width: '100%',
    height: 54,
  },

  
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    marginHorizontal: 14,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
  },

  
  form: {
    gap: 9,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },

  input: {
    height: 52,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 14,
    color: colors.text,
    marginBottom: 7,
  },

  
  loginButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  loginButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },

  
  signupContainer: {
    alignItems: 'center',
    marginTop: 25,
  },

  signupText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  signupLink: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 5,
  },

  
  backButton: {
    alignItems: 'center',
    marginTop: 20,
  },

  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  
  levelButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  levelButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },loginButtonDisabled: {
  opacity: 0.6,
},
});