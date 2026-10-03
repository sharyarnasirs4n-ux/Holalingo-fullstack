import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useState } from 'react';

import { useProgress } from '../Context/ProgressContext';

import { getToken } from '../services/authStorage';

import { useTheme } from '../Context/ThemeContext';
const API_URL = 'https://holalingo-backend.onrender.com';

const LEVELS = [
  'A0',
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
];

export default function EditProfileScreen({
  navigation,
}) {
  const { colors } = useTheme();
       const styles = createStyles(colors);
const { user, updateUser } = useProgress();
  const [name, setName] = useState(
    user?.name || ''
  );

  const [level, setLevel] = useState(
    user?.level || 'A0'
  );

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert(
        'Name required',
        'Please enter your name.'
      );
      return;
    }

    try {
      setSaving(true);

      const token = await getToken();

      if (!token) {
        throw new Error(
          'You are not logged in.'
        );
      }

      const response = await fetch(
        `${API_URL}/auth/profile`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: trimmedName,
            level: level,
          }),
        }
      );

      const data = await response.json();

      console.log(
        'UPDATE PROFILE RESPONSE:',
        data
      );

      if (!response.ok) {
        throw new Error(
          data.detail ||
          'Failed to update profile'
        );
      }
      updateUser(data)

      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );

    } catch (error) {
      console.log(
        'UPDATE PROFILE ERROR:',
        error
      );

      Alert.alert(
        'Update Failed',
        error.message ||
          'Something went wrong.'
      );

    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
      >


        <View style={styles.header}>
          <Pressable
            onPress={() =>
              navigation.goBack()
            }
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <Text style={styles.title}>
            Edit Profile
          </Text>

          <View
            style={styles.headerSpacer}
          />
        </View>



        <View style={styles.section}>
          <Text style={styles.label}>
            Name
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={
              colors.textLight
            }
            style={styles.input}
            autoCapitalize="words"
            maxLength={100}
          />
        </View>



        <View style={styles.section}>
          <Text style={styles.label}>
            Learning Level
          </Text>

          <Text style={styles.description}>
            Choose the Spanish level you
            are currently learning.
          </Text>

          <View style={styles.levelGrid}>
            {LEVELS.map((item) => {
              const selected =
                level === item;

              return (
                <Pressable
                  key={item}
                  onPress={() =>
                    setLevel(item)
                  }
                  style={[
                    styles.levelButton,
                    selected &&
                      styles.levelButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.levelText,
                      selected &&
                        styles.levelTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>



        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={[
            styles.saveButton,
            saving &&
              styles.saveButtonDisabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator
              color={colors.white}
            />
          ) : (
            <Text style={styles.saveText}>
              Save Changes
            </Text>
          )}
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}


const createStyles = (colors) => ({
  
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },

  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 35,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  backText: {
    fontSize: 36,
    color: colors.text,
    lineHeight: 40,
  },

  headerSpacer: {
    width: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },

  
  section: {
    marginBottom: 30,
  },

  label: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },

  
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },

  
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  levelButton: {
    width: 70,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },

  levelButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },

  levelTextSelected: {
    color: colors.white,
  },

  
  saveButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
});