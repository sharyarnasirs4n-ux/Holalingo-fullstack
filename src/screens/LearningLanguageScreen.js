import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEffect, useState } from 'react';

import { useTheme } from '../Context/ThemeContext';

const STORAGE_KEY = 'holalingo_learning_language';

const LANGUAGES = [
  {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    available: true,
  },
  {
    id: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    available: false,
  },
  {
    id: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    available: false,
  },
  {
    id: 'italian',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    available: false,
  },
];

export default function LearningLanguageScreen({
  navigation,
}) {
  const {colors,isDark,toggleTheme}=useTheme()
  const styles=createStyles(colors)
  const [selectedLanguage, setSelectedLanguage] =
    useState('spanish');

  useEffect(() => {
    loadLanguage();
  }, []);

  async function loadLanguage() {
    try {
      const savedLanguage =
        await AsyncStorage.getItem(STORAGE_KEY);

      if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
      }
    } catch (error) {
      console.log(
        'LOAD LANGUAGE ERROR:',
        error
      );
    }
  }

  async function selectLanguage(language) {
    if (!language.available) {
      return;
    }

    try {
      setSelectedLanguage(language.id);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        language.id
      );
    } catch (error) {
      console.log(
        'SAVE LANGUAGE ERROR:',
        error
      );
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
      >

        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Learning Language
          </Text>

          <View style={styles.headerSpacer} />
        </View>


        <View style={styles.intro}>
          <Text style={styles.title}>
            What do you want to learn?
          </Text>

          <Text style={styles.subtitle}>
            Choose the language you are currently
            learning.
          </Text>
        </View>


        <View style={styles.languageList}>
          {LANGUAGES.map((language) => {
            const isSelected =
              selectedLanguage === language.id;

            return (
              <Pressable
                key={language.id}
                onPress={() =>
                  selectLanguage(language)
                }
                disabled={!language.available}
                style={[
                  styles.languageCard,
                  isSelected &&
                    styles.selectedCard,
                  !language.available &&
                    styles.disabledCard,
                ]}
              >
                <View style={styles.flagContainer}>
                  <Text style={styles.flag}>
                    {language.flag}
                  </Text>
                </View>

                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>
                    {language.name}
                  </Text>

                  <Text style={styles.nativeName}>
                    {language.nativeName}
                  </Text>

                  {!language.available && (
                    <Text style={styles.comingSoon}>
                      Coming soon
                    </Text>
                  )}
                </View>

                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Text style={styles.check}>
                      ✓
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>


        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>
            🇪🇸
          </Text>

          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>
              Spanish is your active course
            </Text>

            <Text style={styles.infoDescription}>
              Your lessons, vocabulary, progress,
              and streak are currently connected
              to Spanish.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles=(colors)=>({
  safeArea: {
    flex: 1,
    backgroundColor: colors.card,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    fontSize: 32,
    lineHeight: 34,
    color: colors.text,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },

  headerSpacer: {
    width: 42,
  },

  intro: {
    marginBottom: 24,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textLight,
  },

  languageList: {
    gap: 12,
  },

  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },

  disabledCard: {
    opacity: 0.55,
  },

  flagContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  flag: {
    fontSize: 28,
  },

  languageInfo: {
    flex: 1,
  },

  languageName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },

  nativeName: {
    fontSize: 14,
    color: colors.textLight,
  },

  comingSoon: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 5,
  },

  checkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  check: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },

  infoCard: {
    flexDirection: 'row',
    marginTop: 28,
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.background,
  },

  infoIcon: {
    fontSize: 28,
    marginRight: 14,
  },

  infoText: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },

  infoDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textLight,
  },
});