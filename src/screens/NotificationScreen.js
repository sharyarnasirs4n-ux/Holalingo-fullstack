import {
  Alert,
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

import * as Notifications from 'expo-notifications';

import { useTheme } from '../Context/ThemeContext';
const NOTIFICATIONS_KEY =
  'holalingo_notifications';

export default function NotificationsScreen({
  navigation,
}) {
  const {colors}=useTheme()
  const styles=createStyles(colors)

  const [dailyReminder, setDailyReminder] =
    useState(false);

  const [streakReminder, setStreakReminder] =
    useState(true);

  const [lessonReminder, setLessonReminder] =
    useState(true);

  const [reminderTime, setReminderTime] =
    useState('19:00');


  
  useEffect(() => {

    loadSettings();

  }, []);


  async function loadSettings() {

    try {

      const saved =
        await AsyncStorage.getItem(
          NOTIFICATIONS_KEY
        );

      if (!saved) {
        return;
      }

      const data =
        JSON.parse(saved);

      setDailyReminder(
        data.dailyReminder ?? false
      );

      setStreakReminder(
        data.streakReminder ?? true
      );

      setLessonReminder(
        data.lessonReminder ?? true
      );

      setReminderTime(
        data.reminderTime ?? '19:00'
      );

    } catch (error) {

      console.log(
        'ERROR LOADING NOTIFICATION SETTINGS:',
        error
      );

    }

  }


  
  async function saveSettings(
    settings
  ) {

    try {

      await AsyncStorage.setItem(
        NOTIFICATIONS_KEY,
        JSON.stringify(settings)
      );

    } catch (error) {

      console.log(
        'ERROR SAVING NOTIFICATION SETTINGS:',
        error
      );

    }

  }


  
  async function requestPermission() {

    const {
      status,
    } =
      await Notifications.getPermissionsAsync();

    if (status === 'granted') {
      return true;
    }

    const result =
      await Notifications.requestPermissionsAsync();

    return result.status === 'granted';

  }


  
  async function toggleDailyReminder(
    value
  ) {

    if (value) {

      const granted =
        await requestPermission();

      if (!granted) {

        Alert.alert(
          'Notifications Disabled',
          'Please enable notifications in your device settings to receive study reminders.'
        );

        return;

      }

      await scheduleDailyReminder();

    } else {

      await cancelDailyReminder();

    }

    setDailyReminder(value);

    await saveSettings({
      dailyReminder: value,
      streakReminder,
      lessonReminder,
      reminderTime,
    });

  }


  
  async function scheduleDailyReminder() {

    await cancelDailyReminder();

    const [
      hour,
      minute,
    ] =
      reminderTime
        .split(':')
        .map(Number);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🇪🇸 Time to practice Spanish!',
        body: 'Keep your HolaLingo streak going.',
        sound: 'default',
      },

      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    console.log(
      'DAILY REMINDER SCHEDULED:',
      reminderTime
    );

  }


  
  async function cancelDailyReminder() {

    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduled) {

      if (
        notification.content?.title ===
        '🇪🇸 Time to practice Spanish!'
      ) {

        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );

      }

    }

  }


  
  async function toggleStreakReminder(
    value
  ) {

    setStreakReminder(value);

    await saveSettings({
      dailyReminder,
      streakReminder: value,
      lessonReminder,
      reminderTime,
    });

  }


  
  async function toggleLessonReminder(
    value
  ) {

    setLessonReminder(value);

    await saveSettings({
      dailyReminder,
      streakReminder,
      lessonReminder: value,
      reminderTime,
    });

  }


  
  function changeReminderTime() {

    Alert.alert(
      'Reminder Time',
      'Choose your daily study reminder time.',
      [
        {
          text: '18:00',
          onPress: () =>
            updateReminderTime('18:00'),
        },
        {
          text: '19:00',
          onPress: () =>
            updateReminderTime('19:00'),
        },
        {
          text: '20:00',
          onPress: () =>
            updateReminderTime('20:00'),
        },
        {
          text: '21:00',
          onPress: () =>
            updateReminderTime('21:00'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );

  }


  async function updateReminderTime(
    time
  ) {

    setReminderTime(time);

    await saveSettings({
      dailyReminder,
      streakReminder,
      lessonReminder,
      reminderTime: time,
    });

    if (dailyReminder) {

      const granted =
        await requestPermission();

      if (granted) {
        await scheduleDailyReminder();
      }

    }

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
            Notifications
          </Text>


          <View style={styles.headerSpacer} />

        </View>


        <Text style={styles.subtitle}>
          Stay motivated and keep your Spanish
          learning streak alive.
        </Text>



        <Text style={styles.sectionTitle}>
          Study Reminders
        </Text>


        <View style={styles.card}>


          <View style={styles.settingRow}>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                📚
              </Text>
            </View>


            <View style={styles.info}>

              <Text style={styles.settingTitle}>
                Daily Study Reminder
              </Text>

              <Text style={styles.settingSubtitle}>
                Get reminded to practice Spanish every day
              </Text>

            </View>


            <Switch
              value={dailyReminder}
              onValueChange={
                toggleDailyReminder
              }
              trackColor={{
                false: colors.switchOff,
                true: colors.primary,
              }}
            />

          </View>


          <View style={styles.divider} />



          <Pressable
            style={({ pressed }) => [
              styles.timeRow,
              pressed &&
                styles.timeRowPressed,
            ]}
            onPress={changeReminderTime}
            disabled={!dailyReminder}
          >

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                🕐
              </Text>
            </View>


            <View style={styles.info}>

              <Text
                style={[
                  styles.settingTitle,
                  !dailyReminder &&
                    styles.disabledText,
                ]}
              >
                Reminder Time
              </Text>

              <Text
                style={[
                  styles.settingSubtitle,
                  !dailyReminder &&
                    styles.disabledText,
                ]}
              >
                Choose when HolaLingo reminds you
              </Text>

            </View>


            <View style={styles.timeBadge}>

              <Text
                style={[
                  styles.timeText,
                  !dailyReminder &&
                    styles.disabledText,
                ]}
              >
                {reminderTime}
              </Text>

            </View>

          </Pressable>

        </View>



        <Text style={styles.sectionTitle}>
          Motivation
        </Text>


        <View style={styles.card}>


          <View style={styles.settingRow}>

            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                🔥
              </Text>
            </View>


            <View style={styles.info}>

              <Text style={styles.settingTitle}>
                Streak Reminders
              </Text>

              <Text style={styles.settingSubtitle}>
                Get reminders to protect your learning streak
              </Text>

            </View>


            <Switch
              value={streakReminder}
              onValueChange={
                toggleStreakReminder
              }
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
                🎯
              </Text>
            </View>


            <View style={styles.info}>

              <Text style={styles.settingTitle}>
                Lesson Reminders
              </Text>

              <Text style={styles.settingSubtitle}>
                Get reminders to continue unfinished lessons
              </Text>

            </View>


            <Switch
              value={lessonReminder}
              onValueChange={
                toggleLessonReminder
              }
              trackColor={{
                false: colors.switchOff,
                true: colors.primary,
              }}
            />

          </View>

        </View>



        <View style={styles.infoCard}>

          <Text style={styles.infoIcon}>
            💡
          </Text>

          <View style={styles.infoContent}>

            <Text style={styles.infoTitle}>
              Stay consistent
            </Text>

            <Text style={styles.infoText}>
              A few minutes of Spanish every day
              can make a big difference. Keep your
              streak alive!
            </Text>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>

  );

}



const createStyles=(colors)=>({

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
    lineHeight: 20,
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
    minHeight: 82,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    minHeight: 78,
  },

  timeRowPressed: {
    backgroundColor: colors.pressed,
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

  disabledText: {
    opacity: 0.45,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 72,
  },

  timeBadge: {
    backgroundColor: colors.timeBadge,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  timeText: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.text,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.infoBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    padding: 16,
    marginTop: 3,
  },

  infoIcon: {
    fontSize: 22,
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.text,
  },

  infoText: {
    fontSize: 11,
    lineHeight: 17,
    color: colors.textSecondary,
    marginTop: 4,
  },

});