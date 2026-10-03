import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../Context/ThemeContext';
const SETTINGS_KEY = 'holalingo_settings';

export default function SettingsScreen({ navigation }) {
  const {colors,isDark,toggleTheme,}=useTheme()
  const styles=createStyles(colors)

  const [soundEffects, setSoundEffects] = useState(true);
  const [speech, setSpeech] = useState(true);
  const [haptics, setHaptics] = useState(true);

  
  useEffect(() => {

    loadSettings();

  }, []);


  async function loadSettings() {

    try {

      const saved =
        await AsyncStorage.getItem(
          SETTINGS_KEY
        );

      if (!saved) {
        return;
      }

      const data =
        JSON.parse(saved);

      setSoundEffects(
        data.soundEffects ?? true
      );

      setSpeech(
        data.speech ?? true
      );

      setHaptics(
        data.haptics ?? true
      );

    } catch (error) {

      console.log(
        'ERROR LOADING SETTINGS:',
        error
      );

    }

  }


  
  async function saveSettings(updatedSettings) {

    try {

      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(updatedSettings)
      );

    } catch (error) {

      console.log(
        'ERROR SAVING SETTINGS:',
        error
      );

    }

  }


  function toggleSoundEffects(value) {

    setSoundEffects(value);

    saveSettings({
      soundEffects: value,
      speech,
      haptics,
    });

  }


  function toggleSpeech(value) {

    setSpeech(value);

    saveSettings({
      soundEffects,
      speech: value,
      haptics,
    });

  }


  function toggleHaptics(value) {

    setHaptics(value);

    saveSettings({
      soundEffects,
      speech,
      haptics: value,
    });

  }


  
  return (

    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
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
            Settings
          </Text>


          <View style={styles.headerSpacer} />

        </View>


        <Text style={styles.subtitle}>
          Customize your HolaLingo experience.
        </Text>



        <Text style={styles.sectionTitle}>
          Learning
        </Text>

        <View style={styles.card}>


          <View style={styles.settingRow}>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                🗣️
              </Text>
            </View>

            <View style={styles.info}>

              <Text style={styles.settingTitle}>
                Pronunciation & Speech
              </Text>

              <Text style={styles.settingSubtitle}>
                Play Spanish pronunciation during lessons
              </Text>

            </View>

            <Switch
              value={speech}
              onValueChange={toggleSpeech}
              trackColor={{
                false: colors.switchOff,
                true: colors.primary,
              }}
            />

          </View>


          <View style={styles.divider} />



          <View style={styles.settingRow}>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                🔊
              </Text>
            </View>

            <View style={styles.info}>

              <Text style={styles.settingTitle}>
                Sound Effects
              </Text>

              <Text style={styles.settingSubtitle}>
                Play sounds for quizzes and actions
              </Text>

            </View>

            <Switch
              value={soundEffects}
              onValueChange={toggleSoundEffects}
              trackColor={{
                false: colors.switchOff,
                true: colors.primary,
              }}
            />

          </View>

        </View>

<Text style={styles.sectionTitle}>
  Appearance
</Text>

<View style={styles.card}>

  <View style={styles.settingRow}>

    <View style={styles.iconBox}>
      <Text style={styles.icon}>
        {isDark ? '☀️' : '🌙'}
      </Text>
    </View>

    <View style={styles.info}>

      <Text style={styles.settingTitle}>
        Dark Mode
      </Text>

      <Text style={styles.settingSubtitle}>
        {isDark
          ? 'Use the light appearance'
          : 'Use the dark appearance'}
      </Text>

    </View>

    <Switch
      value={isDark}
      onValueChange={toggleTheme}
      trackColor={{
        false: colors.switchOff,
        true: colors.primary,
      }}
      thumbColor={colors.white}
    />

  </View>

</View>








        <Text style={styles.sectionTitle}>
          Device
        </Text>

        <View style={styles.card}>


          <View style={styles.settingRow}>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                📳
              </Text>
            </View>

            <View style={styles.info}>

              <Text style={styles.settingTitle}>
                Haptic Feedback
              </Text>

              <Text style={styles.settingSubtitle}>
                Vibrate when interacting with the app
              </Text>

            </View>

            <Switch
              value={haptics}
              onValueChange={toggleHaptics}
              trackColor={{
                false: colors.switchOff,
                true: colors.primary,
              }}
            />

          </View>

        </View>



        <Text style={styles.sectionTitle}>
          About
        </Text>

        <View style={styles.card}>

          <View style={styles.aboutRow}>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                🇪🇸
              </Text>
            </View>

            <View style={styles.info}>

              <Text style={styles.settingTitle}>
                HolaLingo
              </Text>

              <Text style={styles.settingSubtitle}>
                Learn Spanish. One day at a time.
              </Text>

            </View>

            <Text style={styles.version}>
              1.0.0
            </Text>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>

  );

}



const createStyles = (colors) =>
  StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 100,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 10,
    marginTop: 8,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 25,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    minHeight: 78,
  },

  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 17,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.iconBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 20,
  },

  info: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  settingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },

  settingSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 72,
  },

  version: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textLight,
  },

});