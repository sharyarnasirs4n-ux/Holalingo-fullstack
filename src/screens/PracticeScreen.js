import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useProgress } from '../Context/ProgressContext';
import { useTheme } from '../Context/ThemeContext';
export default function PracticeScreen({
  route,
  navigation,
}) {

const { user } = useProgress();
const {colors}=useTheme()
  const styles=createStyles(colors)
const level =
  user?.level ||
  route?.params?.level ||
  'A0';
  function openVocabulary() {
    navigation.navigate('VocabularyPractice', {
      level,
    });
  }

  function openQuiz() {
    navigation.navigate('QuizPractice', {
      level,
    });
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        
        <View style={styles.header}>

          <View style={styles.eyebrowRow}>

            <View style={styles.eyebrowLine} />

            <Text style={styles.eyebrow}>
              PRACTICE
            </Text>

          </View>


          <Text style={styles.title}>
            Keep your Spanish{'\n'}
            <Text style={styles.titleAccent}>
              getting stronger. 🧠
            </Text>
          </Text>


          <Text style={styles.subtitle}>
            Review what you've learned, sharpen your skills,
            and make Spanish stick.
          </Text>



          <View style={styles.levelCard}>

            <View style={styles.levelIconCircle}>

              <Text style={styles.levelIcon}>
                🇪🇸
              </Text>

            </View>

            <View style={styles.levelInfo}>

              <Text style={styles.levelSmall}>
                CURRENT LEVEL
              </Text>

              <Text style={styles.levelTitle}>
                {level} Spanish
              </Text>

            </View>

            <View style={styles.levelArrow}>

              <Text style={styles.levelArrowText}>
                ✓
              </Text>

            </View>

          </View>

        </View>


       
        <View style={styles.sectionHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              Review
            </Text>

            <Text style={styles.sectionSubtitle}>
              Build confidence with what you know
            </Text>

          </View>

        </View>


        
        <Pressable
          style={({ pressed }) => [
            styles.vocabularyCard,
            pressed && styles.cardPressed,
          ]}
          onPress={openVocabulary}
        >


          <View style={styles.cardGlow} />

          <View style={styles.vocabularyTop}>

            <View style={styles.vocabularyIcon}>

              <Text style={styles.vocabularyEmoji}>
                📚
              </Text>

            </View>


            <View style={styles.availableBadge}>

              <View style={styles.availableDot} />

              <Text style={styles.availableText}>
                READY
              </Text>

            </View>

          </View>


          <Text style={styles.vocabularyTitle}>
            Vocabulary Review
          </Text>


          <Text style={styles.vocabularyDescription}>
            Revisit Spanish words from your course
            and strengthen your memory.
          </Text>


          <View style={styles.vocabularyBottom}>

            <View style={styles.reviewMeta}>

              <Text style={styles.reviewMetaIcon}>
                ✨
              </Text>

              <Text style={styles.reviewMetaText}>
                Smart review
              </Text>

            </View>


            <View style={styles.startButton}>

              <Text style={styles.startButtonText}>
                Start
              </Text>

              <Text style={styles.startButtonArrow}>
                →
              </Text>

            </View>

          </View>

        </Pressable>


        
        <View style={styles.sectionHeaderMore}>

          <Text style={styles.sectionTitle}>
            More Practice
          </Text>

          <Text style={styles.sectionSubtitle}>
            Challenge yourself in different ways
          </Text>

        </View>


        
        <Pressable
          style={({ pressed }) => [
            styles.practiceCard,
            pressed && styles.cardPressed,
          ]}
          onPress={openQuiz}
        >

          <View style={styles.practiceIconBox}>

            <Text style={styles.practiceIcon}>
              🎯
            </Text>

          </View>


          <View style={styles.practiceInfo}>

            <View style={styles.practiceTitleRow}>

              <Text style={styles.practiceTitle}>
                Quick Quiz
              </Text>

              <View style={styles.smallReadyBadge}>

                <Text style={styles.smallReadyText}>
                  READY
                </Text>

              </View>

            </View>


            <Text style={styles.practiceDescription}>
              Test your vocabulary with quick questions.
            </Text>


            <View style={styles.practiceActionRow}>

              <Text style={styles.practiceAction}>
                Start practicing
              </Text>

              <Text style={styles.practiceArrow}>
                →
              </Text>

            </View>

          </View>

        </Pressable>


        
        <View style={styles.practiceCardDisabled}>

          <View style={styles.practiceIconBoxListening}>

            <Text style={styles.practiceIcon}>
              🎧
            </Text>

          </View>


          <View style={styles.practiceInfo}>

            <View style={styles.practiceTitleRow}>

              <Text style={styles.practiceTitle}>
                Listening Practice
              </Text>

              <View style={styles.comingSoonBadge}>

                <Text style={styles.comingSoonText}>
                  SOON
                </Text>

              </View>

            </View>


            <Text style={styles.practiceDescription}>
              Train your ear and improve your understanding
              of spoken Spanish.
            </Text>


            <Text style={styles.lockedAction}>
              Coming soon
            </Text>

          </View>

        </View>


        
        <View style={styles.motivationCard}>

          <View style={styles.motivationIcon}>

            <Text style={styles.motivationEmoji}>
              💡
            </Text>

          </View>


          <View style={styles.motivationContent}>

            <Text style={styles.motivationTitle}>
              A little practice goes a long way
            </Text>

            <Text style={styles.motivationText}>
              Even a few minutes of review can help
              move words into your long-term memory.
            </Text>

          </View>

        </View>


       
        <Text style={styles.footer}>
          Keep practicing. Keep progressing. 🇪🇸
        </Text>

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
    paddingBottom: 45,
  },

  
  header: {
    marginTop: 12,
    marginBottom: 30,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  eyebrowLine: {
    width: 22,
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 8,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.8,
    color: colors.primary,
  },

  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.7,
  },

  titleAccent: {
    color: colors.primary,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginTop: 11,
    maxWidth: 355,
  },

  
  levelCard: {
    marginTop: 20,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.035,
    shadowRadius: 7,
    elevation: 1,
  },

  levelIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  levelIcon: {
    fontSize: 21,
  },

  levelInfo: {
    flex: 1,
  },

  levelSmall: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: colors.textLight,
    marginBottom: 2,
  },

  levelTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },

  levelArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  levelArrowText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.green,
  },

  
  sectionHeader: {
    marginBottom: 13,
  },

  sectionHeaderMore: {
    marginTop: 30,
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.text,
  },

  sectionSubtitle: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 3,
  },

  
  vocabularyCard: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 20,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  cardGlow: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    right: -45,
    top: -55,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  vocabularyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  vocabularyIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  vocabularyEmoji: {
    fontSize: 28,
  },

  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
  },

  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A9E6B7',
    marginRight: 6,
  },

  availableText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.white,
  },

  vocabularyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
    marginTop: 17,
  },

  vocabularyDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.heroTextSecondary,
    marginTop: 6,
    maxWidth: 320,
  },

  vocabularyBottom: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reviewMetaIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  reviewMetaText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.heroTextSecondary,
  },

  startButton: {
    minHeight: 40,
    paddingHorizontal: 15,
    borderRadius: 13,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  startButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.primary,
  },

  startButtonArrow: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.primary,
    marginLeft: 6,
    marginTop: -1,
  },

  
  practiceCard: {
    backgroundColor: colors.card,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 6,
    elevation: 1,
  },

  practiceCardDisabled: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    opacity: 0.78,
  },

  cardPressed: {
    transform: [
      {
        scale: 0.985,
      },
    ],
    borderColor: colors.primary,
    backgroundColor: colors.pressed,
  },

  practiceIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  practiceIconBoxListening: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  practiceIcon: {
    fontSize: 28,
  },

  practiceInfo: {
    flex: 1,
    minWidth: 0,
  },

  practiceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingRight: 2,
  },

  practiceTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    marginRight: 7,
    flexShrink: 1,
  },

  smallReadyBadge: {
    backgroundColor: colors.greenSoft,
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  smallReadyText: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: colors.green,
  },

  comingSoonBadge: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },

  comingSoonText: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: colors.textLight,
  },

  practiceDescription: {
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.textSecondary,
    marginTop: 5,
    paddingRight: 4,
  },

  practiceActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  practiceAction: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.primary,
  },

  practiceArrow: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary,
    marginLeft: 5,
    marginTop: -1,
  },

  lockedAction: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.textLight,
    marginTop: 8,
  },

  
  motivationCard: {
    marginTop: 19,
    backgroundColor: colors.yellowSoft,
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  motivationIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  motivationEmoji: {
    fontSize: 21,
  },

  motivationContent: {
    flex: 1,
  },

  motivationTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 3,
  },

  motivationText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.textSecondary,
  },

  
  footer: {
    textAlign: 'center',
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textLight,
    marginTop: 20,
  },
});