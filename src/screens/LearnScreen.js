import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../Context/ThemeContext';
import {
  generateCourse,
} from '../data/lessonGenerator';

import {
  loadCourse,
  saveCourse,
} from '../data/courseStorage';

import {
  useProgress,
} from '../Context/ProgressContext';


export default function LearnScreen({
  navigation,
  route,
}) {
  const {colors}=useTheme()
  const styles=createStyles(colors)

  
  const {
    completedLessons,
    user
  } = useProgress();


  
  const level =user?.level ||
    route?.params?.level || 'A0';


  
  const [
    courseData,
    setCourseData,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);


  
  useEffect(() => {

    let mounted = true;


    async function loadOrGenerateCourse() {

      try {

        setLoading(true);


        const savedCourse =
          await loadCourse(level);


        if (
          savedCourse &&
          Array.isArray(savedCourse) &&
          savedCourse.length > 0
        ) {

          if (mounted) {
            setCourseData(savedCourse);
          }

          return;

        }


        const newCourse =
          generateCourse(level);


        await saveCourse(
          level,
          newCourse
        );


        if (mounted) {
          setCourseData(newCourse);
        }


      } catch (error) {

        console.error(
          'COURSE ERROR:',
          error
        );


        if (mounted) {
          setCourseData([]);
        }


      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    }


    loadOrGenerateCourse();


    return () => {
      mounted = false;
    };

  }, [level]);


  
  if (loading) {

    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.loadingContainer}>

          <View style={styles.loadingIcon}>
            <Text style={styles.loadingEmoji}>
              🇪🇸
            </Text>
          </View>

          <Text style={styles.loadingTitle}>
            Preparing your course
          </Text>

          <Text style={styles.loadingText}>
            Building your {level} Spanish journey...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  
  if (
    !courseData ||
    courseData.length === 0
  ) {

    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.loadingContainer}>

          <View style={styles.loadingIcon}>
            <Text style={styles.loadingEmoji}>
              📚
            </Text>
          </View>

          <Text style={styles.loadingTitle}>
            No lessons available
          </Text>

          <Text style={styles.loadingText}>
            We couldn't find vocabulary for {level}.
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  
  const allLessons =
    courseData.flatMap(
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


  const overallProgress =
    totalLessons > 0
      ? completedLessonCount / totalLessons
      : 0;


  const progressPercent =
    Math.round(
      overallProgress * 100
    );


  const nextLesson =
    allLessons.find(
      lesson =>
        !completedLessons.includes(
          lesson.id
        )
    );


  
  function openLesson(lesson) {

    navigation.navigate(
      'Lesson',
      {
        lesson,
      }
    );

  }


  
  function openUnit(unit) {

    navigation.navigate(
      'Unit',
      {
        unit,
      }
    );

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

          <View style={styles.headerText}>

            <Text style={styles.eyebrow}>
              YOUR LEARNING PATH
            </Text>

            <Text style={styles.title}>
              Learn Spanish
            </Text>

            <Text style={styles.subtitle}>
              Build your Spanish step by step.
            </Text>

          </View>


          <View style={styles.levelPill}>

            <Text style={styles.levelPillText}>
              {level}
            </Text>

          </View>

        </View>


        
        <View style={styles.overallCard}>

          <View style={styles.overallTop}>

            <View style={styles.overallLeft}>

              <View style={styles.overallIcon}>
                <Text style={styles.overallEmoji}>
                  🎯
                </Text>
              </View>

              <View>

                <Text style={styles.overallTitle}>
                  Course progress
                </Text>

                <Text style={styles.overallSubtitle}>
                  {completedLessonCount} of {totalLessons} lessons
                </Text>

              </View>

            </View>


            <Text style={styles.overallPercent}>
              {progressPercent}%
            </Text>

          </View>


          <View style={styles.overallProgressBackground}>

            <View
              style={[
                styles.overallProgressFill,
                {
                  width:
                    `${progressPercent}%`,
                },
              ]}
            />

          </View>


          <View style={styles.overallBottom}>

            <Text style={styles.overallBottomText}>
              {progressPercent === 100
                ? 'Course completed 🎉'
                : nextLesson
                  ? 'Keep going — you are doing great!'
                  : 'Start your journey today'}
            </Text>

            <Text style={styles.overallLevel}>
              {level} Spanish
            </Text>

          </View>

        </View>


        {nextLesson && (

          <View style={styles.nextSection}>

            <View style={styles.sectionHeader}>

              <Text style={styles.sectionTitle}>
                Continue Learning
              </Text>

              <Text style={styles.sectionAccent}>
                NEXT
              </Text>

            </View>


            <Pressable
              onPress={() =>
                openLesson(nextLesson)
              }
              style={({ pressed }) => [
                styles.nextCard,
                pressed && styles.cardPressed,
              ]}
            >

              <View style={styles.nextIcon}>

                <Text style={styles.nextEmoji}>
                  📖
                </Text>

              </View>


              <View style={styles.nextInfo}>

                <Text style={styles.nextLabel}>
                  UP NEXT
                </Text>

                <Text
                  style={styles.nextTitle}
                  numberOfLines={1}
                >
                  {nextLesson.title}
                </Text>

                <Text
                  style={styles.nextDescription}
                  numberOfLines={2}
                >
                  {nextLesson.description}
                </Text>


                <View style={styles.nextMeta}>

                  <Text style={styles.nextMetaText}>
                    ⏱ {nextLesson.duration}
                  </Text>

                  <Text style={styles.metaDivider}>
                    •
                  </Text>

                  <Text style={styles.nextMetaText}>
                    ⭐ {nextLesson.xp} XP
                  </Text>

                </View>

              </View>


              <View style={styles.nextArrow}>

                <Text style={styles.nextArrowText}>
                  →
                </Text>

              </View>

            </Pressable>

          </View>

        )}


        
        {!nextLesson && (

          <View style={styles.completeCard}>

            <View style={styles.completeIcon}>
              <Text style={styles.completeEmoji}>
                🏆
              </Text>
            </View>

            <Text style={styles.completeTitle}>
              Amazing work!
            </Text>

            <Text style={styles.completeText}>
              You've completed your entire {level} course.
              Keep practicing to maintain your Spanish.
            </Text>

          </View>

        )}


       
        <View style={styles.courseHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              Your Course
            </Text>

            <Text style={styles.courseSubtitle}>
              Follow the path from start to finish
            </Text>

          </View>

        </View>


       
        {courseData.map(
          (unit, unitIndex) => {

            const lessons =
              unit.lessons || [];


            const completedCount =
              lessons.filter(
                lesson =>
                  completedLessons.includes(
                    lesson.id
                  )
              ).length;


            const progress =
              lessons.length > 0
                ? completedCount /
                  lessons.length
                : 0;


            const unitPercent =
              Math.round(
                progress * 100
              );


            const unitComplete =
              completedCount ===
              lessons.length &&
              lessons.length > 0;


            return (

              <View
                key={unit.id}
                style={styles.unitSection}
              >

                
                <Pressable
                  onPress={() =>
                    openUnit(unit)
                  }
                  style={({ pressed }) => [
                    styles.unitCard,
                    pressed && styles.cardPressed,
                  ]}
                >

                  <View style={styles.unitTop}>

                    <View style={styles.unitNumber}>

                      <Text style={styles.unitNumberText}>
                        {unitIndex + 1}
                      </Text>

                    </View>


                    <View style={styles.unitInfo}>

                      <Text style={styles.unitLabel}>
                        UNIT {unitIndex + 1}
                      </Text>

                      <Text
                        style={styles.unitTitle}
                        numberOfLines={1}
                      >
                        {unit.title}
                      </Text>

                    </View>


                    <View
                      style={[
                        styles.unitStatus,
                        unitComplete &&
                          styles.unitStatusComplete,
                      ]}
                    >

                      <Text
                        style={[
                          styles.unitStatusText,
                          unitComplete &&
                            styles.unitStatusTextComplete,
                        ]}
                      >
                        {unitComplete
                          ? '✓'
                          : `${completedCount}/${lessons.length}`}
                      </Text>

                    </View>

                  </View>


                  <View style={styles.unitProgressRow}>

                    <View style={styles.unitProgressBackground}>

                      <View
                        style={[
                          styles.unitProgressFill,
                          {
                            width:
                              `${unitPercent}%`,
                          },
                        ]}
                      />

                    </View>


                    <Text style={styles.unitPercent}>
                      {unitPercent}%
                    </Text>

                  </View>


                  <View style={styles.unitBottom}>

                    <Text style={styles.unitProgressText}>
                      {completedCount === 0
                        ? 'Ready to begin'
                        : unitComplete
                          ? 'Unit completed'
                          : `${completedCount} of ${lessons.length} completed`}
                    </Text>


                    <Text style={styles.unitArrow}>
                      →
                    </Text>

                  </View>

                </Pressable>


                
                <View style={styles.lessonsContainer}>

                  {lessons.map(
                    (lesson, index) => {

                      const completed =
                        completedLessons.includes(
                          lesson.id
                        );


                      const isNext =
                        nextLesson?.id ===
                        lesson.id;


                      return (

                        <Pressable
                          key={lesson.id}
                          onPress={() =>
                            openLesson(lesson)
                          }
                          style={({ pressed }) => [
                            styles.lessonCard,

                            completed &&
                              styles.lessonCompleted,

                            isNext &&
                              styles.lessonNext,

                            pressed &&
                              styles.cardPressed,
                          ]}
                        >

                          
                          <View
                            style={[
                              styles.lessonNumber,

                              completed &&
                                styles.lessonNumberCompleted,

                              isNext &&
                                styles.lessonNumberNext,
                            ]}
                          >

                            <Text
                              style={[
                                styles.lessonNumberText,

                                completed &&
                                  styles.lessonNumberTextCompleted,

                                isNext &&
                                  styles.lessonNumberTextNext,
                              ]}
                            >
                              {completed
                                ? '✓'
                                : index + 1}
                            </Text>

                          </View>


                          
                          <View style={styles.lessonInfo}>

                            <View style={styles.lessonTitleRow}>

                              <Text
                                style={styles.lessonTitle}
                                numberOfLines={1}
                              >
                                {lesson.title}
                              </Text>


                              {isNext && (

                                <View style={styles.nextBadge}>

                                  <Text style={styles.nextBadgeText}>
                                    NEXT
                                  </Text>

                                </View>

                              )}

                            </View>


                            <Text
                              style={styles.lessonDescription}
                              numberOfLines={2}
                            >
                              {lesson.description}
                            </Text>


                            <View style={styles.lessonMeta}>

                              <Text style={styles.lessonMetaText}>
                                ⏱ {lesson.duration}
                              </Text>

                              <View style={styles.metaDot} />


                              <Text style={styles.lessonMetaText}>
                                ⭐ {lesson.xp} XP
                              </Text>

                            </View>

                          </View>


                          
                          <Text
                            style={[
                              styles.lessonArrow,
                              completed &&
                                styles.lessonArrowCompleted,
                            ]}
                          >
                            →
                          </Text>

                        </Pressable>

                      );

                    }
                  )}

                </View>

              </View>

            );

          }
        )}


        
        <View style={styles.footer}>

          <Text style={styles.footerEmoji}>
            🇪🇸
          </Text>

          <Text style={styles.footerTitle}>
            ¡Sigue adelante!
          </Text>

          <Text style={styles.footerText}>
            Little by little, your Spanish gets better.
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
    paddingTop: 18,
    paddingBottom: 110,
  },

  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  headerText: {
    flex: 1,
    paddingRight: 15,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: 5,
  },

  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.7,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },

  levelPill: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    minWidth: 52,
    alignItems: 'center',
  },

  levelPillText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
  },

  
  overallCard: {
    backgroundColor: colors.primary,
    borderRadius: 26,
    padding: 20,
    marginBottom: 27,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  overallTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  overallLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  overallIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  overallEmoji: {
    fontSize: 23,
  },

  overallTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.white,
  },

  overallSubtitle: {
    fontSize: 12,
    color: colors.heroTextSecondary,
    marginTop: 3,
  },

  overallPercent: {
    fontSize: 25,
    fontWeight: '900',
    color: colors.white,
  },

  overallProgressBackground: {
    height: 9,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderRadius: 10,
    marginTop: 19,
    overflow: 'hidden',
  },

  overallProgressFill: {
    height: '100%',
    backgroundColor: colors.yellow,
    borderRadius: 10,
  },

  overallBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 11,
  },

  overallBottomText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: colors.heroTextSecondary,
  },

  overallLevel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.heroTextSecondary,
    marginLeft: 10,
  },

  
  nextSection: {
    marginBottom: 27,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
  },

  sectionAccent: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
  },

  
  nextCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  nextIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  nextEmoji: {
    fontSize: 27,
  },

  nextInfo: {
    flex: 1,
  },

  nextLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1.2,
    marginBottom: 3,
  },

  nextTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },

  nextDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    marginTop: 3,
  },

  nextMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  nextMetaText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  metaDivider: {
    fontSize: 10,
    color: colors.textLight,
    marginHorizontal: 6,
  },

  nextArrow: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  nextArrowText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },

  
  completeCard: {
    backgroundColor: colors.yellowSoft,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginBottom: 28,
  },

  completeIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  completeEmoji: {
    fontSize: 29,
  },

  completeTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.text,
  },

  completeText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },

  
  courseHeader: {
    marginBottom: 14,
  },

  courseSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  
  unitSection: {
    marginBottom: 26,
  },

  unitCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 9,
  },

  unitTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  unitNumber: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  unitNumberText: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.primary,
  },

  unitInfo: {
    flex: 1,
  },

  unitLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: colors.primary,
    marginBottom: 3,
  },

  unitTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },

  unitStatus: {
    minWidth: 48,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 9,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  unitStatusComplete: {
    backgroundColor: colors.greenSoft,
  },

  unitStatusText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textSecondary,
  },

  unitStatusTextComplete: {
    color: colors.green,
    fontSize: 16,
  },

  unitProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
  },

  unitProgressBackground: {
    flex: 1,
    height: 7,
    backgroundColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
  },

  unitProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  unitPercent: {
    width: 38,
    textAlign: 'right',
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
  },

  unitBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  unitProgressText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  unitArrow: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
  },

  
  lessonsContainer: {
    paddingLeft: 8,
  },

  lessonCard: {
    backgroundColor: colors.card,
    borderRadius: 19,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },

  lessonCompleted: {
    backgroundColor: colors.surfaceSoft,
  },

  lessonNext: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },

  lessonNumber: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  lessonNumberCompleted: {
    backgroundColor: colors.green,
  },

  lessonNumberNext: {
    backgroundColor: colors.primary,
  },

  lessonNumberText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
  },

  lessonNumberTextCompleted: {
    color: colors.white,
    fontSize: 17,
  },

  lessonNumberTextNext: {
    color: colors.white,
  },

  lessonInfo: {
    flex: 1,
    minWidth: 0,
  },

  lessonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  lessonTitle: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },

  nextBadge: {
    backgroundColor: colors.redSoft,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 7,
  },

  nextBadgeText: {
    fontSize: 7,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.7,
  },

  lessonDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    marginTop: 3,
  },

  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  lessonMetaText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textLight,
    marginHorizontal: 7,
  },

  lessonArrow: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginLeft: 8,
  },

  lessonArrowCompleted: {
    color: colors.green,
  },

  
  footer: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 25,
  },

  footerEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },

  footerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },

  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
  },

  loadingIcon: {
    width: 86,
    height: 86,
    borderRadius: 30,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  loadingEmoji: {
    fontSize: 42,
  },

  loadingTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },

  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 20,
  },

  
  cardPressed: {
    opacity: 0.86,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});