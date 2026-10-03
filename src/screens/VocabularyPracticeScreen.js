import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import { useEffect, useState } from 'react';


import { useTheme } from '../Context/ThemeContext';
import { loadCourse } from '../data/courseStorage';







export default function VocabularyPracticeScreen({
  navigation,route
}) {
  const {colors}=useTheme()
  const styles=createStyles(colors)
const level=route?.params?.level ||"A0"
  
  const [words, setWords] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [showAnswer, setShowAnswer] = useState(false);

  const [loading, setLoading] = useState(true);


  
  useEffect(() => {

    loadVocabulary();

  }, []);


  async function loadVocabulary() {

    try {

      const course =
        await loadCourse(level);


      if (!course) {

        setWords([]);

        return;

      }


     
      const lessons =
        course.flatMap(
          unit => unit.lessons || []
        );


      
      const allWords =
        lessons.flatMap(
          lesson => lesson.words || []
        );


      
      const uniqueWords = [
        ...new Map(
          allWords.map(
            word => [
              word.word,
              word,
            ]
          )
        ).values(),
      ];


      setWords(uniqueWords);

    } catch (error) {

      console.error(
        'Failed to load vocabulary:',
        error
      );

    } finally {

      setLoading(false);

    }

  }


  
  const currentWord =
    words[currentIndex];


  
  function nextWord() {

    if (
      currentIndex <
      words.length - 1
    ) {

      setCurrentIndex(
        previous => previous + 1
      );

      setShowAnswer(false);

    }

  }


  
  if (loading) {

    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.center}>

          <Text style={styles.loadingEmoji}>
            📚
          </Text>

          <Text style={styles.loadingTitle}>
            Loading vocabulary...
          </Text>

        </View>

      </SafeAreaView>
    );

  }


  
  if (!currentWord) {

    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.center}>

          <Text style={styles.loadingEmoji}>
            📚
          </Text>

          <Text style={styles.loadingTitle}>
            No vocabulary found
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }
          >

            <Text style={styles.backButtonText}>
              Go Back
            </Text>

          </Pressable>

        </View>

      </SafeAreaView>
    );

  }


 
  const progress =
    ((currentIndex + 1) /
      words.length) *
    100;


  
  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        
        <Pressable
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.backText}>
            ← Back
          </Text>

        </Pressable>


        <View style={styles.header}>

          <Text style={styles.eyebrow}>
            VOCABULARY PRACTICE
          </Text>

          <Text style={styles.title}>
            Review your Spanish
          </Text>

          <Text style={styles.counter}>
            {currentIndex + 1} / {words.length}
          </Text>

        </View>


       
        <View style={styles.progressBackground}>

          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
              },
            ]}
          />

        </View>


        
        <View style={styles.wordCard}>

          <Text style={styles.level}>
            {currentWord.level}
          </Text>


          <Text style={styles.spanishWord}>
            {currentWord.word}
          </Text>


          {showAnswer ? (

            <View style={styles.answerSection}>

              <Text style={styles.translation}>
                {currentWord.translation}
              </Text>


              {currentWord.example_1 ? (

                <View style={styles.exampleBox}>

                  <Text style={styles.exampleLabel}>
                    Example
                  </Text>

                  <Text style={styles.exampleSpanish}>
                    {currentWord.example_1}
                  </Text>


                  {currentWord.example_translation_1 && (

                    <Text style={styles.exampleEnglish}>
                      {currentWord.example_translation_1}
                    </Text>

                  )}

                </View>

              ) : null}

            </View>

          ) : (

            <Text style={styles.hiddenText}>
              Think of the meaning...
            </Text>

          )}

        </View>


        
        {!showAnswer ? (

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              setShowAnswer(true)
            }
          >

            <Text style={styles.primaryButtonText}>
              Show Answer
            </Text>

          </Pressable>

        ) : (

          <View style={styles.answerButtons}>

            <Pressable
              style={styles.practiceButton}
              onPress={nextWord}
            >

              <Text style={styles.practiceButtonText}>
                🔄 Need Practice
              </Text>

            </Pressable>


            <Pressable
              style={styles.knownButton}
              onPress={nextWord}
            >

              <Text style={styles.knownButtonText}>
                ✓ I Knew It
              </Text>

            </Pressable>

          </View>

        )}

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
    padding: 24,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: colors.background,
  },

  loadingEmoji: {
    fontSize: 55,
    marginBottom: 18,
  },

  loadingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },

  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },

  header: {
    marginTop: 28,
    marginBottom: 18,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primary,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginTop: 5,
  },

  counter: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 7,
  },

  progressBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 25,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  
  wordCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 30,
    minHeight: 330,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  level: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: 20,
  },

  spanishWord: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },

  hiddenText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 25,
  },

  
  answerSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 25,
  },

  translation: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },

  exampleBox: {
    width: '100%',
    marginTop: 25,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.infoBackground,
    borderWidth: 1,
    borderColor: colors.infoBorder,
  },

  exampleLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
  },

  exampleSpanish: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },

  exampleEnglish: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 7,
    lineHeight: 19,
  },

  
  primaryButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },

  
  answerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },

  practiceButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  practiceButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },

  knownButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  knownButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },

  
  backButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 15,
  },

  backButtonText: {
    color: colors.white,
    fontWeight: '800',
  },
});