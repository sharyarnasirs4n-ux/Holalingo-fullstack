import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import quotes from "../data/quotes.json";
import { getToken } from '../services/authStorage';

import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../Context/ThemeContext';
import ProgressBar from '../components/ProgressBar';
import StatCard from '../components/StatCard';

import { useProgress } from '../Context/ProgressContext';
import { loadCourse } from '../data/courseStorage';
import { TouchableOpacity } from 'react-native';

const API_URL = 'https://holalingo-backend.onrender.com';


export default function HomeScreen({ route, navigation }) {
const {colors}=useTheme()
const styles=createStyles(colors)
  
  const [dailyQuote, setDailyQuote] = useState(null);


  useEffect(() => {

    if (!quotes || quotes.length === 0) {
      return;
    }


   
    const today = new Date();

    const dateSeed =
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate();


    const quoteIndex =
      dateSeed % quotes.length;


    setDailyQuote(
      quotes[quoteIndex]
    );

  }, []);


  
  const [achievements, setAchievements] =
    useState([]);

  const [loadingAchievements, setLoadingAchievements] =
    useState(true);


  useEffect(() => {

    loadAchievements();

  }, []);


  async function loadAchievements() {

    try {

      setLoadingAchievements(true);


      const token =
        await getToken();


      if (!token) {
        return;
      }


      const response =
        await fetch(
          `${API_URL}/achievements/`,
          {
            method: 'GET',

            headers: {
              Authorization:
                `Bearer ${token}`,

              'Content-Type':
                'application/json',
            },
          }
        );


      if (!response.ok) {

        throw new Error(
          `Failed to load achievements: ${response.status}`
        );

      }


      const data =
        await response.json();


      console.log(
        'HOME ACHIEVEMENTS:',
        data
      );


      setAchievements(
        data.achievements || []
      );


    } catch (error) {

      console.log(
        'Error loading home achievements:',
        error
      );


    } finally {

      setLoadingAchievements(false);

    }

  }


  
  const {
    user,
    xp,
    completedLessons,
    streak,
  } = useProgress();


  
  const level =
  user?.level ||
  route?.params?.level ||
  'A0';

  
  const [course, setCourse] =
    useState(null);

  const [loadingCourse, setLoadingCourse] =
    useState(true);


  
  useEffect(() => {

    loadCurrentCourse();

  }, [level]);


  async function loadCurrentCourse() {

    try {

      setLoadingCourse(true);

      const savedCourse =
        await loadCourse(level);

      setCourse(savedCourse);

    } catch (error) {

      console.log(
        'Error loading course:',
        error
      );

    } finally {

      setLoadingCourse(false);

    }

  }


  
  const units =
    course || [];


  const allLessons =
    units.flatMap(
      unit => unit.lessons || []
    );


  const totalLessons =
    allLessons.length;


  
  const completedLessonCount =
    allLessons.filter(
      lesson =>
        completedLessons.includes(
          lesson.id
        )
    ).length;


  
  const progressPercent =
    totalLessons > 0
      ? Math.round(
          (
            completedLessonCount /
            totalLessons
          ) * 100
        )
      : 0;


  
  const nextLesson =
    allLessons.find(
      lesson =>
        !completedLessons.includes(
          lesson.id
        )
    ) || null;


  
  let nextUnit = null;


  if (nextLesson) {

    nextUnit =
      units.find(
        unit =>
          unit.lessons?.some(
            lesson =>
              lesson.id ===
              nextLesson.id
          )
      );

  }


  
  function openNextLesson() {

    if (!nextLesson) {
      return;
    }

    navigation.navigate(
      'Learn',
      {
        screen: 'Lesson',
        params: {
          lesson: nextLesson,
        },
      }
    );

  }


  function openCourse() {

    if (!nextUnit) {
      return;
    }

    navigation.navigate(
      'Learn',
      {
        screen: 'Unit',
        params: {
          unit: nextUnit,
        },
      }
    );

  }


  function openVocabulary() {

    navigation.navigate(
      'Practice',
      {
        screen: 'VocabularyPractice',
        params: {
          level,
        },
      }
    );

  }


  function openQuiz() {

    navigation.navigate(
      'Practice',
      {
        screen: 'QuizPractice',
        params: {
          level,
        },
      }
    );

  }
function openAchievements() {

  navigation.navigate(
    'Achievements'
  );

}

  
  const dailyGoalText =
    nextLesson
      ? 'Continue your Spanish journey today.'
      : 'Amazing! You completed this course.';


  
  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        
        <View style={styles.header}>

          <View style={styles.headerText}>

            <Text style={styles.greeting}>
              ¡Hola! 👋
            </Text>

            <Text style={styles.subtitle}>
              Ready for your Spanish practice?
            </Text>

          </View>


          <Pressable
            style={({ pressed }) => [
              styles.avatar,
              pressed && styles.avatarPressed,
            ]}
            onPress={() =>
              navigation.navigate('Profile')
            }
          >

            <Text style={styles.avatarText}>
              S
            </Text>

          </Pressable>

        </View>


        
        <View style={styles.levelPill}>

          <View style={styles.levelDot} />

          <Text style={styles.levelPillText}>
            {level} Spanish
          </Text>

          <Text style={styles.levelPillArrow}>
            →
          </Text>

        </View>


        
        <View style={styles.goalCard}>

          <View style={styles.goalTop}>

            <View style={styles.goalIconContainer}>

              <Text style={styles.goalIcon}>
                🎯
              </Text>

            </View>


            <View style={styles.goalTitleContainer}>

              <Text style={styles.goalTitle}>
                Today's Practice
              </Text>

              <Text style={styles.goalSubtitle}>
                Keep your learning habit going
              </Text>

            </View>

          </View>


          <View style={styles.goalBottom}>

            <Text style={styles.goalText}>
              {dailyGoalText}
            </Text>


            {nextLesson ? (

              <Pressable
                style={({ pressed }) => [
                  styles.goalButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={openNextLesson}
              >

                <Text style={styles.goalButtonText}>
                  Start
                </Text>

              </Pressable>

            ) : null}

          </View>

        </View>


        
        <View style={styles.stats}>

          <StatCard
            icon="🔥"
            value={String(streak)}
            label="Day streak"
          />

          <StatCard
            icon="⭐"
            value={String(xp)}
            label="Total XP"
          />

          <StatCard
            icon="📚"
            value={String(completedLessonCount)}
            label="Lessons"
          />

        </View>


        
        <View style={styles.sectionHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              Continue Learning
            </Text>

            <Text style={styles.sectionSubtitle}>
              Pick up where you left off
            </Text>

          </View>

        </View>


        {loadingCourse ? (

          <View style={styles.loadingCard}>

            <Text style={styles.loadingIcon}>
              📚
            </Text>

            <Text style={styles.loadingText}>
              Loading your course...
            </Text>

          </View>

        ) : nextLesson ? (

          <Pressable
            style={({ pressed }) => [
              styles.lessonCard,
              pressed && styles.cardPressed,
            ]}
            onPress={openNextLesson}
          >


            <View style={styles.lessonIcon}>

              <Text style={styles.lessonEmoji}>
                📖
              </Text>

            </View>



            <View style={styles.lessonInfo}>

              <View style={styles.lessonMetaRow}>

                <Text style={styles.lessonLevel}>
                  {level}
                </Text>

                <View style={styles.metaDot} />

                <Text style={styles.lessonNumber}>
                  Lesson {nextLesson.lessonNumber}
                </Text>

              </View>


              <Text
                style={styles.lessonTitle}
                numberOfLines={2}
              >
                {nextLesson.title}
              </Text>


              <View style={styles.lessonDetails}>

                <Text style={styles.lessonDetail}>
                  ⏱ {nextLesson.duration}
                </Text>

                <Text style={styles.lessonDetail}>
                  ⭐ {nextLesson.xp} XP
                </Text>

              </View>

            </View>



            <View style={styles.lessonArrow}>

              <Text style={styles.arrow}>
                →
              </Text>

            </View>

          </Pressable>

        ) : (

          <View style={styles.completeCard}>

            <Text style={styles.completeEmoji}>
              🎉
            </Text>

            <View style={styles.completeInfo}>

              <Text style={styles.completeTitle}>
                Course Complete!
              </Text>

              <Text style={styles.completeText}>
                You completed all {level} lessons.
              </Text>

            </View>

          </View>

        )}


        
        <View style={styles.sectionHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              Your Spanish Journey
            </Text>

            <Text style={styles.sectionSubtitle}>
              Track your progress
            </Text>

          </View>

        </View>


        <Pressable
          style={({ pressed }) => [
            styles.courseCard,
            pressed && styles.cardPressed,
          ]}
          onPress={openCourse}
        >

          <View style={styles.courseTop}>

            <View style={styles.courseIcon}>

              <Text style={styles.courseEmoji}>
                🇪🇸
              </Text>

            </View>


            <View style={styles.courseInfo}>

              <Text style={styles.courseTitle}>
                {level} Spanish
              </Text>

              <Text style={styles.courseSubtitle}>
                {completedLessonCount} of {totalLessons} lessons
              </Text>

            </View>


            <Text style={styles.coursePercent}>
              {progressPercent}%
            </Text>

          </View>


          <View style={styles.progressWrapper}>

            <ProgressBar
              progress={progressPercent}
            />

          </View>


          <View style={styles.courseBottom}>

            <Text style={styles.courseHint}>
              Keep progressing
            </Text>

            <Text style={styles.courseArrow}>
              →
            </Text>

          </View>

        </Pressable>


   
<TouchableOpacity
  style={styles.dailyChallengeCard}
  onPress={() => navigation.navigate('DailyChallenge')}
>
  <View style={styles.dailyChallengeIcon}>
    <Text style={styles.dailyChallengeEmoji}>
      🧠
    </Text>
  </View>

  <View style={styles.dailyChallengeContent}>
    <Text style={styles.dailyChallengeTitle}>
      Daily Challenge
    </Text>

    <Text style={styles.dailyChallengeDescription}>
      Test your Spanish skills and earn XP
    </Text>
  </View>

  <Text style={styles.dailyChallengeArrow}>
    →
  </Text>
</TouchableOpacity>




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


{loadingAchievements ? (

  <View style={styles.achievementLoadingCard}>

    <Text style={styles.achievementLoadingText}>
      Loading achievements...
    </Text>

  </View>

) : (

  <View style={styles.achievementCard}>

    {achievements
      .slice(0, 3)
      .map((achievement) => {

        const current =
          achievement.progress?.current ?? 0;

        const target =
          achievement.progress?.target ?? 1;

        const progress =
          target > 0
            ? Math.min(
                current / target,
                1
              )
            : 0;


        return (

          <View
            key={achievement.code}
            style={styles.achievementRow}
          >

            <View
              style={[
                styles.achievementIconBox,
                !achievement.unlocked &&
                  styles.achievementIconBoxLocked,
              ]}
            >

              <Text
                style={[
                  styles.achievementIcon,
                  !achievement.unlocked &&
                    styles.achievementIconLocked,
                ]}
              >
                {achievement.icon}
              </Text>

            </View>


            <View style={styles.achievementInfo}>

              <View style={styles.achievementTitleRow}>

                <Text
                  style={styles.achievementName}
                  numberOfLines={1}
                >
                  {achievement.name}
                </Text>

                {achievement.unlocked ? (

                  <Text style={styles.achievementUnlocked}>
                    ✓
                  </Text>

                ) : null}

              </View>


              <Text
                style={styles.achievementDescription}
                numberOfLines={1}
              >
                {achievement.description}
              </Text>


              {!achievement.unlocked ? (

                <View style={styles.achievementProgressArea}>

                  <View style={styles.achievementProgressTrack}>

                    <View
                      style={[
                        styles.achievementProgressFill,
                        {
                          width: `${progress * 100}%`,
                        },
                      ]}
                    />

                  </View>


                  <Text style={styles.achievementProgressText}>
                    {current} / {target}
                  </Text>

                </View>

              ) : (

                <Text style={styles.achievementEarnedText}>
                  Unlocked
                </Text>

              )}

            </View>

          </View>

        );

      })}


    <Pressable
      style={({ pressed }) => [
        styles.viewAchievementsButton,
        pressed && styles.cardPressed,
      ]}
      onPress={openAchievements}
    >

      <Text style={styles.viewAchievementsText}>
        View all achievements
      </Text>

      <Text style={styles.viewAchievementsArrow}>
        →
      </Text>

    </Pressable>

  </View>

)}

        {dailyQuote && (

          <View style={styles.quoteCard}>


            <View style={styles.quoteHeader}>

              <View style={styles.quoteIcon}>

                <Text style={styles.quoteIconText}>
                  ✦
                </Text>

              </View>

              <Text style={styles.quoteLabel}>
                DAILY INSPIRATION
              </Text>

            </View>



            <Text style={styles.quoteMark}>
              “
            </Text>



            <Text style={styles.quoteText}>
              {dailyQuote.quote}
            </Text>



            {dailyQuote.author ? (

              <View style={styles.quoteAuthorRow}>

                <View style={styles.authorLine} />

                <Text style={styles.quoteAuthor}>
                  {dailyQuote.author}
                </Text>

              </View>

            ) : null}

          </View>

        )}


        


        
        <View style={styles.sectionHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              Practice
            </Text>

            <Text style={styles.sectionSubtitle}>
              Strengthen what you've learned
            </Text>

          </View>

        </View>


        <View style={styles.practiceRow}>


          <Pressable
            style={({ pressed }) => [
              styles.practiceCard,
              pressed && styles.cardPressed,
            ]}
            onPress={openVocabulary}
          >

            <View style={[
              styles.practiceIcon,
              styles.practiceIconOrange,
            ]}>

              <Text style={styles.practiceEmoji}>
                🧠
              </Text>

            </View>


            <Text style={styles.practiceTitle}>
              Vocabulary
            </Text>


            <Text style={styles.practiceText}>
              Practice your Spanish words
            </Text>


            <View style={styles.practiceArrow}>

              <Text style={styles.practiceArrowText}>
                →
              </Text>

            </View>

          </Pressable>



          <Pressable
            style={({ pressed }) => [
              styles.practiceCard,
              pressed && styles.cardPressed,
            ]}
            onPress={openQuiz}
          >

            <View style={[
              styles.practiceIcon,
              styles.practiceIconYellow,
            ]}>

              <Text style={styles.practiceEmoji}>
                🎯
              </Text>

            </View>


            <Text style={styles.practiceTitle}>
              Quick Quiz
            </Text>


            <Text style={styles.practiceText}>
              Test what you know
            </Text>


            <View style={styles.practiceArrow}>

              <Text style={styles.practiceArrowText}>
                →
              </Text>

            </View>

          </Pressable>

        </View>


        
        <View style={styles.bottomMessage}>

          <Text style={styles.bottomEmoji}>
            🔥
          </Text>

          <Text style={styles.bottomText}>
            Consistency beats intensity.
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>

  );

}



const createStyles = (colors) => ({
  
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 55,
  },

  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    fontSize: 29,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },

  avatarPressed: {
    transform: [
      {
        scale: 0.94,
      },
    ],
  },

  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
  },

  
  levelPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginBottom: 18,
  },

  levelDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginRight: 7,
  },

  levelPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
  },

  levelPillArrow: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 7,
  },

  
  goalCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 19,
    marginBottom: 18,

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },

  goalTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  goalIconContainer: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  goalIcon: {
    fontSize: 24,
  },

  goalTitleContainer: {
    flex: 1,
  },

  goalTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
  },

  goalSubtitle: {
    color: colors.heroTextSecondary,
    fontSize: 12,
    marginTop: 3,
  },

  goalBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },

  goalText: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    paddingRight: 10,
  },

  goalButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 12,
  },

  goalButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },

  
  stats: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 30,
  },

  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 3,
  },

  
  lessonCard: {
    backgroundColor: colors.card,
    borderRadius: 21,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 30,
  },

  cardPressed: {
    transform: [
      {
        scale: 0.985,
      },
    ],
    opacity: 0.92,
  },

  lessonIcon: {
    width: 57,
    height: 57,
    borderRadius: 17,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  lessonEmoji: {
    fontSize: 27,
  },

  lessonInfo: {
    flex: 1,
    minWidth: 0,
  },

  lessonMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  lessonLevel: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textLight,
    marginHorizontal: 6,
  },

  lessonNumber: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },

  lessonTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    color: colors.text,
  },

  lessonDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    gap: 12,
  },

  lessonDetail: {
    fontSize: 10.5,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  lessonArrow: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  arrow: {
    fontSize: 19,
    color: colors.primary,
    fontWeight: '900',
  },

  
  loadingCard: {
    backgroundColor: colors.card,
    borderRadius: 21,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 30,
  },

  loadingIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  
  courseCard: {
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 30,
  },

  courseTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  courseIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  courseEmoji: {
    fontSize: 23,
  },

  courseInfo: {
    flex: 1,
  },

  courseTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },

  courseSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  coursePercent: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.primary,
  },

  progressWrapper: {
    marginTop: 18,
  },

  courseBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 11,
  },

  courseHint: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  courseArrow: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '900',
  },

  
  completeCard: {
    backgroundColor: colors.yellowSoft,
    borderRadius: 21,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  completeEmoji: {
    fontSize: 34,
    marginRight: 14,
  },

  completeInfo: {
    flex: 1,
  },

  completeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },

  completeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  
  practiceRow: {
    flexDirection: 'row',
    gap: 11,
  },

  practiceCard: {
    flex: 1,
    minHeight: 174,
    backgroundColor: colors.card,
    borderRadius: 21,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  practiceIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  practiceIconOrange: {
    backgroundColor: colors.redSoft,
  },

  practiceIconYellow: {
    backgroundColor: colors.yellowSoft,
  },

  practiceEmoji: {
    fontSize: 23,
  },

  practiceTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },

  practiceText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 5,
    lineHeight: 17,
  },

  practiceArrow: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  practiceArrowText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
  },

  
  bottomMessage: {
    alignItems: 'center',
    marginTop: 34,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  bottomEmoji: {
    fontSize: 20,
    marginBottom: 5,
  },

  bottomText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '700',
  },

  
  buttonPressed: {
    opacity: 0.85,
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  
  quoteCard: {
    backgroundColor: colors.infoBackground,
    borderRadius: 23,
    padding: 20,
    marginBottom: 30,

    borderWidth: 1,
    borderColor: colors.infoBorder,

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },

  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  quoteIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,

    backgroundColor: colors.yellowSoft,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 9,
  },

  quoteIconText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },

  quoteLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: colors.primary,
  },

  quoteMark: {
    fontSize: 48,
    lineHeight: 45,
    height: 38,

    fontWeight: '900',
    color: colors.yellow,
  },

  quoteText: {
    fontSize: 17,
    lineHeight: 26,

    fontWeight: '700',
    color: colors.text,

    marginTop: 1,
  },

  quoteAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 17,
  },

  authorLine: {
    width: 22,
    height: 1,

    backgroundColor: colors.yellow,
    marginRight: 8,
  },

  quoteAuthor: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
  },

  
  achievementCard: {
    backgroundColor: colors.card,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 30,
    overflow: 'hidden',
  },

  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 14,
  },

  achievementIconBox: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  achievementIconBoxLocked: {
    backgroundColor: colors.surfaceSoft,
  },

  achievementIcon: {
    fontSize: 22,
  },

  achievementIconLocked: {
    opacity: 0.45,
  },

  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },

  achievementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  achievementName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
    color: colors.text,
  },

  achievementUnlocked: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.green,
    marginLeft: 6,
  },

  achievementDescription: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginTop: 3,
  },

  achievementProgressArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  achievementProgressTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },

  achievementProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  achievementProgressText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.textSecondary,
    marginLeft: 8,
  },

  achievementEarnedText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.green,
    marginTop: 5,
  },

  viewAchievementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 13,
  },

  viewAchievementsText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: colors.primary,
  },

  viewAchievementsArrow: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary,
    marginLeft: 7,
  },

  achievementLoadingCard: {
    backgroundColor: colors.card,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    alignItems: 'center',
    marginBottom: 30,
  },

  achievementLoadingText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  
  dailyChallengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellowSoft,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  dailyChallengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    marginRight: 12,
  },

  dailyChallengeEmoji: {
    fontSize: 26,
  },

  dailyChallengeContent: {
    flex: 1,
  },

  dailyChallengeTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },

  dailyChallengeDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  dailyChallengeArrow: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
});