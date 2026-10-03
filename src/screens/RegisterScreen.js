import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { useTheme } from '../Context/ThemeContext';
import { registerUser, loginUser } from '../services/api';


export default function RegisterScreen({
  navigation,
  onLogin,
}) {

  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  const handleRegister = async () => {

    if (loading) {
      return;
    }


    const cleanEmail =
      email.trim().toLowerCase();


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
        'Please enter a password.'
      );

      return;
    }


    if (password.length < 8) {

      Alert.alert(
        'Password too short',
        'Your password must be at least 8 characters.'
      );

      return;
    }


    if (password !== confirmPassword) {

      Alert.alert(
        'Passwords do not match',
        'Please make sure both passwords are the same.'
      );

      return;
    }


    try {

      setLoading(true);



      await registerUser(
        cleanEmail,
        password,
        'A0'
      );



      await loginUser(
        cleanEmail,
        password
      );



      navigation.replace('Level', {
  afterLevelSelection: onLogin,
});





    } catch (error) {

      console.log(
        'REGISTER ERROR:',
        error
      );


      Alert.alert(
        'Create Account Error',
        error?.message ||
          'Unable to create your account. Please try again.'
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >

      <View style={styles.header}>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Create your account
        </Text>


        <Text
          style={[
            styles.subtitle,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          Start your Spanish journey.
        </Text>

      </View>


      <View style={styles.form}>

        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Email
        </Text>


        <TextInput
          style={[
            styles.input,
            {
              backgroundColor:
                colors.card,

              borderColor:
                colors.border,

              color:
                colors.text,
            },
          ]}
          placeholder="Enter your email"
          placeholderTextColor={
            colors.textLight
          }
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />


        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Password
        </Text>


        <TextInput
          style={[
            styles.input,
            {
              backgroundColor:
                colors.card,

              borderColor:
                colors.border,

              color:
                colors.text,
            },
          ]}
          placeholder="At least 8 characters"
          placeholderTextColor={
            colors.textLight
          }
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />


        <Text
          style={[
            styles.label,
            {
              color: colors.text,
            },
          ]}
        >
          Confirm password
        </Text>


        <TextInput
          style={[
            styles.input,
            {
              backgroundColor:
                colors.card,

              borderColor:
                colors.border,

              color:
                colors.text,
            },
          ]}
          placeholder="Enter your password again"
          placeholderTextColor={
            colors.textLight
          }
          secureTextEntry
          value={confirmPassword}
          onChangeText={
            setConfirmPassword
          }
          editable={!loading}
        />


        <Pressable
          style={[
            styles.registerButton,
            {
              backgroundColor:
                colors.primary,
              opacity:
                loading ? 0.6 : 1,
            },
          ]}
          onPress={handleRegister}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              color={colors.white}
            />

          ) : (

            <Text
              style={[
                styles.registerButtonText,
                {
                  color: colors.white,
                },
              ]}
            >
              Create Account
            </Text>

          )}

        </Pressable>


        <Pressable
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
          disabled={loading}
        >

          <Text
            style={[
              styles.backText,
              {
                color:
                  colors.primary,
              },
            ]}
          >
            Already have an account? Log in
          </Text>

        </Pressable>

      </View>

    </SafeAreaView>

  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 22,
  },


  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },


  title: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
  },


  subtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },


  form: {
    gap: 9,
  },


  label: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },


  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 8,
  },


  registerButton: {
    height: 56,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },


  registerButtonText: {
    fontSize: 15,
    fontWeight: '900',
  },


  backButton: {
    alignItems: 'center',
    marginTop: 22,
  },


  backText: {
    fontSize: 13,
    fontWeight: '800',
  },

});