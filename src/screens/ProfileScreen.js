import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { removeToken } from '../services/authStorage';
import { useProgress } from '../Context/ProgressContext';
import { useTheme } from '../Context/ThemeContext';


export default function ProfileScreen({ navigation ,onLogout,isLoggedIn}) {

  const {
    user,
    xp,
    completedLessons,
    streak,
    studyDates,
  } = useProgress();
const {
  colors,
  isDark,
  toggleTheme,
} = useTheme();

const styles = createStyles(colors);
  
  const userName =
  user?.name ||
  user?.email?.split('@')[0] ||
  'Guest';

const userInitial =
  userName.charAt(0).toUpperCase();

const currentLevel =
  user?.level || 'A0';


  
  const lessonsCompleted =
    completedLessons?.length || 0;

  const daysStudied =
    studyDates?.length || 0;


  
  function handleEditProfile() {
  navigation.navigate('EditProfile');
}


  function handleSettings() {
  navigation.navigate('Settings');
}


  function handleNotifications() {

   navigation.navigate("Notifications")

  }


  function handleLanguage() {
  navigation.navigate('LearningLanguage');
}

function handleAccountInformation() {
  navigation.navigate('AccountInformation');
}

function handleAchievements() {
  navigation.navigate('Achievements');
}
function handleFavoriteWords() {
  navigation.navigate('FavoriteWords');
}

function handleLogout() {
  Alert.alert(
    'Log out',
    'Are you sure you want to log out?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await onLogout();

            console.log(
              'PROFILE: LOGOUT SUCCESS'
            );

          } catch (error) {
            console.log(
              'PROFILE: LOGOUT ERROR:',
              error
            );

            Alert.alert(
              'Logout Error',
              'Unable to log out.'
            );
          }
        },
      },
    ]
  );
}

const handleLogin=()=>{
  navigation.navigate("Auth")
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

          <View>

            <Text style={styles.eyebrow}>
              HOLA LINGO
            </Text>

            <Text style={styles.title}>
              Your Profile
            </Text>

          </View>


          <View style={styles.headerFlag}>

            <Text style={styles.headerFlagText}>
              🇪🇸
            </Text>

          </View>

        </View>


        <Text style={styles.subtitle}>
          Your Spanish journey, all in one place.
        </Text>


       
        <View style={styles.profileHero}>


          <View style={styles.heroCircleOne} />

          <View style={styles.heroCircleTwo} />


          <View style={styles.profileHeroContent}>

            <View style={styles.avatarWrapper}>

              <View style={styles.avatar}>

                <Text style={styles.avatarText}>
                  {userInitial}
                </Text>

              </View>


              <View style={styles.onlineDot} />

            </View>


            <View style={styles.profileInfo}>

              <Text style={styles.userName}>
                {userName}
              </Text>

              <Text style={styles.userSubtitle}>
                Spanish learner
              </Text>


              <View style={styles.levelBadge}>

                <Text style={styles.levelBadgeIcon}>
                  🌱
                </Text>

                <Text style={styles.levelBadgeText}>
                  {currentLevel} • Beginner
                </Text>

              </View>

            </View>


            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.editButtonPressed,
              ]}
              onPress={handleEditProfile}
            >

              <Text style={styles.editButtonText}>
                Edit
              </Text>

            </Pressable>

          </View>



          <View style={styles.heroBottom}>

            <View style={styles.heroBottomText}>

              <Text style={styles.heroProgressLabel}>
                Your progress
              </Text>

              <Text style={styles.heroProgressValue}>
                Keep learning every day ✨
              </Text>

            </View>


            <Text style={styles.heroProgressPercent}>
              {lessonsCompleted > 0 ? 'ACTIVE' : 'START'}
            </Text>

          </View>

        </View>


        
        <View style={styles.sectionHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              Learning Overview
            </Text>

            <Text style={styles.sectionSubtitle}>
              Your activity at a glance
            </Text>

          </View>

        </View>


        <View style={styles.statsGrid}>



          <View style={styles.statCard}>

            <View style={styles.statTopRow}>

              <View
                style={[
                  styles.statIconBox,
                  styles.xpIconBox,
                ]}
              >

                <Text style={styles.statIcon}>
                  ⭐
                </Text>

              </View>

              <Text style={styles.statSmallLabel}>
                XP
              </Text>

            </View>


            <Text style={styles.statNumber}>
              {xp}
            </Text>

            <Text style={styles.statLabel}>
              Total XP
            </Text>

          </View>



          <View style={styles.statCard}>

            <View style={styles.statTopRow}>

              <View
                style={[
                  styles.statIconBox,
                  styles.streakIconBox,
                ]}
              >

                <Text style={styles.statIcon}>
                  🔥
                </Text>

              </View>

              <Text style={styles.statSmallLabel}>
                DAYS
              </Text>

            </View>


            <Text style={styles.statNumber}>
              {streak}
            </Text>

            <Text style={styles.statLabel}>
              Day streak
            </Text>

          </View>



          <View style={styles.statCard}>

            <View style={styles.statTopRow}>

              <View
                style={[
                  styles.statIconBox,
                  styles.lessonIconBox,
                ]}
              >

                <Text style={styles.statIcon}>
                  📚
                </Text>

              </View>

              <Text style={styles.statSmallLabel}>
                DONE
              </Text>

            </View>


            <Text style={styles.statNumber}>
              {lessonsCompleted}
            </Text>

            <Text style={styles.statLabel}>
              Lessons
            </Text>

          </View>



          <View style={styles.statCard}>

            <View style={styles.statTopRow}>

              <View
                style={[
                  styles.statIconBox,
                  styles.calendarIconBox,
                ]}
              >

                <Text style={styles.statIcon}>
                  📅
                </Text>

              </View>

              <Text style={styles.statSmallLabel}>
                ACTIVE
              </Text>

            </View>


            <Text style={styles.statNumber}>
              {daysStudied}
            </Text>

            <Text style={styles.statLabel}>
              Study days
            </Text>

          </View>

        </View>
       
<View style={styles.sectionHeader}>

  <View>

    <Text style={styles.sectionTitle}>
      Achievements
    </Text>

    <Text style={styles.sectionSubtitle}>
      Celebrate your Spanish progress
    </Text>

  </View>

</View>


<Pressable
  style={({ pressed }) => [
    styles.achievementCard,
    pressed && styles.achievementCardPressed,
  ]}
  onPress={handleAchievements}
>

  <View style={styles.achievementIconBox}>

    <Text style={styles.achievementIcon}>
      🏆
    </Text>

  </View>


  <View style={styles.achievementInfo}>

    <Text style={styles.achievementTitle}>
      Your Achievements
    </Text>

    <Text style={styles.achievementSubtitle}>
      Earn badges as you learn Spanish
    </Text>

  </View>


  <View style={styles.achievementArrowBox}>

    <Text style={styles.achievementArrow}>
      →
    </Text>

  </View>

</Pressable>

<View style={styles.sectionHeader}>

  <View>

    <Text style={styles.sectionTitle}>
      Saved Vocabulary
    </Text>

    <Text style={styles.sectionSubtitle}>
      Review the Spanish words you've saved
    </Text>

  </View>

</View>


<Pressable
  style={({ pressed }) => [
    styles.favoriteWordsCard,
    pressed && styles.favoriteWordsCardPressed,
  ]}
  onPress={handleFavoriteWords}
>

  <View style={styles.favoriteWordsIconBox}>

    <Text style={styles.favoriteWordsIcon}>
      ⭐
    </Text>

  </View>


  <View style={styles.favoriteWordsInfo}>

    <Text style={styles.favoriteWordsTitle}>
      Favorite Words
    </Text>

    <Text style={styles.favoriteWordsSubtitle}>
      Review and practice your saved vocabulary
    </Text>

  </View>


  <View style={styles.favoriteWordsArrowBox}>

    <Text style={styles.favoriteWordsArrow}>
      →
    </Text>

  </View>

</Pressable>

        
        <View style={styles.sectionHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              Current Course
            </Text>

            <Text style={styles.sectionSubtitle}>
              Continue where you left off
            </Text>

          </View>

        </View>


        <Pressable
          style={({ pressed }) => [
            styles.courseCard,
            pressed && styles.courseCardPressed,
          ]}
          onPress={() =>
            navigation?.navigate?.('Home')
          }
        >


          <View style={styles.courseDecorationOne} />

          <View style={styles.courseDecorationTwo} />


          <View style={styles.courseTopRow}>

            <View style={styles.courseIcon}>

              <Text style={styles.courseEmoji}>
                🇪🇸
              </Text>

            </View>


            <View style={styles.courseLevelPill}>

              <Text style={styles.courseLevelText}>
                {currentLevel}
              </Text>

            </View>

          </View>


          <Text style={styles.courseTitle}>
            Spanish
          </Text>


          <Text style={styles.courseSubtitle}>
            {currentLevel} Beginner
          </Text>


          <Text style={styles.courseDescription}>
            Build your vocabulary, understand everyday
            Spanish, and become more confident.
          </Text>


          <View style={styles.courseBottom}>

            <Text style={styles.courseAction}>
              Continue learning
            </Text>

            <View style={styles.courseArrow}>

              <Text style={styles.courseArrowText}>
                →
              </Text>

            </View>

          </View>

        </Pressable>


        
        <View style={styles.sectionHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              Preferences
            </Text>

            <Text style={styles.sectionSubtitle}>
              Customize your learning experience
            </Text>

          </View>

        </View>


        <View style={styles.settingsCard}>



          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              pressed && styles.settingRowPressed,
            ]}
            onPress={handleLanguage}
          >

            <View
              style={[
                styles.settingIconBox,
                styles.languageIconBox,
              ]}
            >

              <Text style={styles.settingIcon}>
                🌎
              </Text>

            </View>


            <View style={styles.settingInfo}>

              <Text style={styles.settingTitle}>
                Learning Language
              </Text>

              <Text style={styles.settingSubtitle}>
                Spanish 🇪🇸
              </Text>

            </View>


            <View style={styles.settingArrowBox}>

              <Text style={styles.settingArrow}>
                →
              </Text>

            </View>

          </Pressable>


          <View style={styles.divider} />



          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              pressed && styles.settingRowPressed,
            ]}
            onPress={handleNotifications}
          >

            <View
              style={[
                styles.settingIconBox,
                styles.notificationIconBox,
              ]}
            >

              <Text style={styles.settingIcon}>
                🔔
              </Text>

            </View>


            <View style={styles.settingInfo}>

              <Text style={styles.settingTitle}>
                Notifications
              </Text>

              <Text style={styles.settingSubtitle}>
                Manage learning reminders
              </Text>

            </View>


            <View style={styles.settingArrowBox}>

              <Text style={styles.settingArrow}>
                →
              </Text>

            </View>

          </Pressable>


          <View style={styles.divider} />



          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              pressed && styles.settingRowPressed,
            ]}
            onPress={handleSettings}
          >

            <View
              style={[
                styles.settingIconBox,
                styles.settingsIconBox,
              ]}
            >

              <Text style={styles.settingIcon}>
                ⚙️
              </Text>

            </View>


            <View style={styles.settingInfo}>

              <Text style={styles.settingTitle}>
                Settings
              </Text>

              <Text style={styles.settingSubtitle}>
                App preferences and options
              </Text>

            </View>


            <View style={styles.settingArrowBox}>

              <Text style={styles.settingArrow}>
                →
              </Text>

            </View>

          </Pressable>

        </View>


        
        <View style={styles.sectionHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              Account
            </Text>

            <Text style={styles.sectionSubtitle}>
              Manage your account
            </Text>

          </View>

        </View>


        <View style={styles.accountCard}>



          <Pressable
            style={({ pressed }) => [
              styles.accountRow,
              pressed && styles.accountRowPressed,
            ]}
            onPress={handleAccountInformation}
          >

            <View style={styles.accountIconBox}>

              <Text style={styles.accountIcon}>
                👤
              </Text>

            </View>


            <View style={styles.accountInfo}>

              <Text style={styles.accountText}>
                Account information
              </Text>

              <Text style={styles.accountSubtext}>
                Profile details and personal information
              </Text>

            </View>


            <Text style={styles.settingArrow}>
              →
            </Text>

          </Pressable>


          <View style={styles.divider} />



          <Pressable
            style={({ pressed }) => [
              styles.accountRow,
              pressed && styles.logoutPressed,
            ]}
            onPress={isLoggedIn? handleLogout:handleLogin}
          >

            <View style={styles.logoutIconBox}>

              <Text style={styles.accountIcon}>
                🚪
              </Text>

            </View>


            <View style={styles.accountInfo}>

              <Text style={styles.logoutText}>
                {isLoggedIn ? "Logout":"Login"}
              </Text>

              <Text style={styles.logoutSubtext}>
              { isLoggedIn? "Sign out of this device":"Sign in to device"}
              </Text>

            </View>

          </Pressable>

        </View>


        
        <View style={styles.footer}>

          <View style={styles.footerLogo}>

            <Text style={styles.footerLogoText}>
              🇪🇸
            </Text>

          </View>


          <Text style={styles.appName}>
            HolaLingo
          </Text>


          <Text style={styles.appTagline}>
            Learn Spanish. One day at a time.
          </Text>


          <View style={styles.versionBadge}>

            <Text style={styles.appVersion}>
              Version 1.0.0
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
    paddingBottom: 120,
  },


  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    color: colors.primary,
    marginBottom: 5,
  },


  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.7,
  },


  headerFlag: {
  width: 44,
  height: 44,
  borderRadius: 15,
  backgroundColor: colors.card,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: colors.border,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.04,
  shadowRadius: 5,
  elevation: 1,
},


  headerFlagText: {
    fontSize: 22,
  },


  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginTop: 7,
    marginBottom: 24,
  },


  
  profileHero: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: 18,
    marginBottom: 30,
    overflow: 'hidden',

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 5,
  },


  heroCircleOne: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    right: -70,
    top: -70,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },


  heroCircleTwo: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    left: -55,
    bottom: -55,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },


  profileHeroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  avatarWrapper: {
    position: 'relative',
  },


  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
  },


  avatarText: {
    fontSize: 27,
    fontWeight: '900',
    color: colors.primary,
  },


  onlineDot: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#66C77A',
    right: 0,
    bottom: 2,
    borderWidth: 3,
    borderColor: colors.primary,
  },


  profileInfo: {
    flex: 1,
    marginLeft: 14,
    minWidth: 0,
  },


  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
  },


  userSubtitle: {
    fontSize: 12,
    color: colors.heroTextSecondary,
    marginTop: 2,
  },


  levelBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9,
    marginTop: 7,
  },


  levelBadgeIcon: {
    fontSize: 11,
    marginRight: 4,
  },


  levelBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
  },


  editButton: {
    backgroundColor: colors.white,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginLeft: 8,
  },


  editButtonPressed: {
    opacity: 0.8,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },


  editButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.primary,
  },


  heroBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },


  heroBottomText: {
    flex: 1,
  },


  heroProgressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.heroTextSecondary,
    letterSpacing: 0.4,
  },


  heroProgressValue: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '700',
    marginTop: 3,
  },


  heroProgressPercent: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 1,
    backgroundColor: 'rgba(255,255,255,0.13)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },


  
  sectionHeader: {
    marginBottom: 12,
  },


  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.text,
  },


  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },


  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 29,
  },


  statCard: {
    width: '48.2%',
    backgroundColor: colors.card,
    borderRadius: 21,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.025,
    shadowRadius: 5,
    elevation: 1,
  },


  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  statIconBox: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },


  xpIconBox: {
    backgroundColor: colors.yellowSoft,
  },


  streakIconBox: {
    backgroundColor: colors.redSoft,
  },


  lessonIconBox: {
    backgroundColor: colors.blueSoft,
  },


  calendarIconBox: {
    backgroundColor: colors.greenSoft,
  },


  statIcon: {
    fontSize: 19,
  },


  statSmallLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: colors.textLight,
  },


  statNumber: {
    fontSize: 27,
    lineHeight: 31,
    fontWeight: '900',
    color: colors.text,
    marginTop: 12,
  },


  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },


  
  courseCard: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 19,
    marginBottom: 30,
    overflow: 'hidden',

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },


  courseCardPressed: {
    opacity: 0.94,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },


  courseDecorationOne: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    right: -95,
    top: -85,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },


  courseDecorationTwo: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    left: -45,
    bottom: -45,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },


  courseTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  courseIcon: {
    width: 57,
    height: 57,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },


  courseEmoji: {
    fontSize: 29,
  },


  courseLevelPill: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },


  courseLevelText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
  },


  courseTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
    marginTop: 17,
  },


  courseSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.heroTextSecondary,
    marginTop: 2,
  },


  courseDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.heroTextSecondary,
    marginTop: 9,
    maxWidth: 320,
  },


  courseBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },


  courseAction: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.white,
  },


  courseArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },


  courseArrowText: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.primary,
  },


  
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 30,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.025,
    shadowRadius: 6,
    elevation: 1,
  },


  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 72,
  },


  settingRowPressed: {
    backgroundColor: colors.pressed,
  },


  settingIconBox: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },


  languageIconBox: {
    backgroundColor: colors.yellowSoft,
  },


  notificationIconBox: {
    backgroundColor: colors.redSoft,
  },


  settingsIconBox: {
    backgroundColor: colors.purpleSoft,
  },


  settingIcon: {
    fontSize: 20,
  },


  settingInfo: {
    flex: 1,
    marginLeft: 13,
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
  },


  settingArrowBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor:colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },


  settingArrow: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textLight,
  },


  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 70,
  },


  
  accountCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 30,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.025,
    shadowRadius: 6,
    elevation: 1,
  },


  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 14,
    minHeight: 70,
  },


  accountRowPressed: {
    backgroundColor: colors.pressed,
  },


  logoutPressed: {
    backgroundColor: colors.dangerPressed,
  },


  accountIconBox: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },


  logoutIconBox: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },


  accountIcon: {
    fontSize: 19,
  },


  accountInfo: {
    flex: 1,
    marginLeft: 13,
  },


  accountText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },


  accountSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },


  logoutText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.danger,
  },


  logoutSubtext: {
    fontSize: 11,
    color: colors.dangerSecondary,
    marginTop: 3,
  },


  
  footer: {
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 20,
  },


  footerLogo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },


  footerLogoText: {
    fontSize: 24,
  },


  appName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },


  appTagline: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },


  versionBadge: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 9,
  },


  appVersion: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textLight,
  },
achievementCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.card,
  borderRadius: 22,
  borderWidth: 1,
  borderColor: colors.border,
  paddingVertical: 15,
  paddingHorizontal: 14,
  marginBottom: 30,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.025,
  shadowRadius: 6,
  elevation: 1,
},

achievementCardPressed: {
  backgroundColor: colors.pressed,
  transform: [
    {
      scale: 0.985,
    },
  ],
},

achievementIconBox: {
  width: 48,
  height: 48,
  borderRadius: 15,
  backgroundColor: colors.yellowSoft,
  alignItems: 'center',
  justifyContent: 'center',
},

achievementIcon: {
  fontSize: 24,
},

achievementInfo: {
  flex: 1,
  marginLeft: 13,
},

achievementTitle: {
  fontSize: 14,
  fontWeight: '800',
  color: colors.text,
},

achievementSubtitle: {
  fontSize: 11,
  color: colors.textSecondary,
  marginTop: 3,
},

achievementArrowBox: {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: '#F8F4F1',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 8,
},

achievementArrow: {
  fontSize: 17,
  fontWeight: '800',
  color: colors.textLight,
},

favoriteWordsCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.card,
  borderRadius: 22,
  borderWidth: 1,
  borderColor: colors.border,
  paddingVertical: 15,
  paddingHorizontal: 14,
  marginBottom: 30,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.025,
  shadowRadius: 6,
  elevation: 1,
},


favoriteWordsCardPressed: {
  backgroundColor: colors.pressed,
  transform: [
    {
      scale: 0.985,
    },
  ],
},


favoriteWordsIconBox: {
  width: 48,
  height: 48,
  borderRadius: 15,
  backgroundColor: colors.yellowSoft,
  alignItems: 'center',
  justifyContent: 'center',
},


favoriteWordsIcon: {
  fontSize: 24,
},


favoriteWordsInfo: {
  flex: 1,
  marginLeft: 13,
},


favoriteWordsTitle: {
  fontSize: 14,
  fontWeight: '800',
  color: colors.text,
},


favoriteWordsSubtitle: {
  fontSize: 11,
  color: colors.textSecondary,
  marginTop: 3,
},


favoriteWordsArrowBox: {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: colors.surfaceSoft,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 8,
},


favoriteWordsArrow: {
  fontSize: 17,
  fontWeight: '800',
  color: colors.textLight,
},

});