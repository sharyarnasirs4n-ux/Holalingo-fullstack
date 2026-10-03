
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { getFavorites,deleteFavorite,addFavorite } from '../services/api';
import { useProgress } from '../Context/ProgressContext';
import { useTheme } from '../Context/ThemeContext';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useAudioPlayer } from 'expo-audio';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function LessonScreen({
  route,
  navigation,
}) {
  const {colors}=useTheme()
    const styles=createStyles(colors)
  const { lesson } = route.params;

  const { completeLesson } =
    useProgress();

  const content = lesson;
  


  
  const [currentStep, setCurrentStep] =
    useState(0);
    const [speechEnabled,setSpeechEnabled]=useState(true)
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
   const [soundEffects, setSoundEffects] = useState(true);
  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [showResult, setShowResult] =
    useState(false);

  const [correctAnswers, setCorrectAnswers] =
    useState(0);

  const [completed, setCompleted] =
    useState(false);

const [newAchievements, setNewAchievements] = useState([]);
const [favorites, setFavorites] = useState([]);
const [favoriteLoading, setFavoriteLoading] = useState(false);
const clickSound = useAudioPlayer(
  require('../../assets/sounds/click.mp3')
);

const correctSound = useAudioPlayer(
  require('../../assets/sounds/correct.mp3')
);

const wrongSound = useAudioPlayer(
  require('../../assets/sounds/wrong.mp3')
);
useEffect(() => {

  async function loadFavorites() {

    try {

      const savedFavorites =
        await getFavorites();

      setFavorites(savedFavorites);

    } catch (error) {

      console.log(
        'Failed to load favorites:',
        error
      );

    }

  }

  loadFavorites();

}, []);
useFocusEffect(
  useCallback(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(
          'holalingo_settings'
        );

        if (saved) {
          const data = JSON.parse(saved);

          setSpeechEnabled(data.speech ?? true);
          setHapticsEnabled(data.haptics ?? true);
          setSoundEffects(data.soundEffects ?? true)
        }
      } catch (e) {
        console.log('Failed to load settings:', e);
      }
    };

    loadSettings();
  }, [])
);


  if (!content || !content.steps) {

    return (
      <View style={styles.errorContainer}>

        <Text style={styles.errorEmoji}>
          📚
        </Text>

        <Text style={styles.errorTitle}>
          Lesson unavailable
        </Text>

        <Text style={styles.errorText}>
          We couldn't load this lesson.
        </Text>

      </View>
    );

  }


  const step =
    content.steps[currentStep];


  if (!step) {

    return (
      <View style={styles.errorContainer}>

        <Text style={styles.errorEmoji}>
          😕
        </Text>

        <Text style={styles.errorTitle}>
          Something went wrong
        </Text>

        <Text style={styles.errorText}>
          This lesson step could not be loaded.
        </Text>

      </View>
    );

  }


  const isLastStep =
    currentStep ===
    content.steps.length - 1;


  const isQuestionStep =
    step.type === 'quiz' ||
    step.type === 'listen' ||
    step.type === 'sentence';


  
  function handleSpeak() {

    if (!speechEnabled||!step.spanish) {
      return;
    }

    Speech.stop();

    Speech.speak(
      step.spanish,
      {
        language: 'es-ES',
        rate: 0.4,
        pitch: 1.0,
      }
    );

  }
  async function handleFavorite() {

  if (step.type !== 'learn') {
    return;
  }

  if (favoriteLoading) {
    return;
  }

  setFavoriteLoading(true);

  try {

    const existingFavorite =
      favorites.find(
        favorite =>
          favorite.word === step.word
      );

   
    if (existingFavorite) {

      await deleteFavorite(
        existingFavorite.id
      );

      setFavorites(
        previous =>
          previous.filter(
            favorite =>
              favorite.id !==
              existingFavorite.id
          )
      );

      return;
    }

   
    const newFavorite =
      await addFavorite({

        word: step.word,

        translation:
          step.english,

        example_1:
          step.example || null,

        example_2:
          step.example2 || null,

        example_translation_1:
          step.exampleTranslation || null,

        example_translation_2:
          step.exampleTranslation2 || null,

        level:
          step.level || null,

      });

    setFavorites(
      previous => [
        ...previous,
        newFavorite,
      ]
    );

  } catch (error) {

    console.log(
      'Favorite error:',
      error
    );

  } finally {

    setFavoriteLoading(false);

  }

}


 
  async function handleAnswer(answer) {
  if (showResult) {
    return;
  }

  if (hapticsEnabled) {
    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
  }

  if (soundEffects) {
    if (answer === step.answer) {
      correctSound.seekTo(0);
      correctSound.play();
    } else {
      wrongSound.seekTo(0);
      wrongSound.play();
    }
  }

  setSelectedAnswer(answer);
  setShowResult(true);
}


function getLearnedWords() {
  const learnedWords = content.steps
    .filter(step => step.type === 'learn')
    .map(step => ({
      word: step.word,
      translation: step.english,
      example: step.example || null,
      example_translation:
        step.exampleTranslation || null,
      level: step.level || null,
    }));

  console.log(
    'LEARNED WORDS FROM LESSON:',
    JSON.stringify(learnedWords, null, 2)
  );

  console.log(
    'TOTAL LEARNED WORDS FROM LESSON:',
    learnedWords.length
  );

  return learnedWords;
}
  
  async function handleContinue() {

   
    if (isQuestionStep) {

      if (!showResult) {
        return;
      }


      const answerIsCorrect =
        selectedAnswer === step.answer;


      const newCorrectAnswers =
        answerIsCorrect
          ? correctAnswers + 1
          : correctAnswers;


      setCorrectAnswers(
        newCorrectAnswers
      );


      
if (isLastStep) {

  const learnedWords =
  getLearnedWords();

const unlocked =
  await completeLesson(
    lesson.id,
    lesson.xp,
    learnedWords
  );

setNewAchievements(unlocked);

setCompleted(true);
  return;

}

      
      setCurrentStep(
        currentStep + 1
      );

      setSelectedAnswer(null);

      setShowResult(false);

      return;

    }


    
    if (!isLastStep) {

      setCurrentStep(
        currentStep + 1
      );

    }

  }


  
  if (completed) {

    const totalQuestions =
      content.steps.filter(
        item =>
          item.type === 'quiz' ||
          item.type === 'listen' ||
          item.type === 'sentence'
      ).length;


    const accuracy =
      totalQuestions > 0
        ? Math.round(
            (correctAnswers /
              totalQuestions) *
              100
          )
        : 100;


    const wordsLearned =
      content.steps.filter(
        item =>
          item.type === 'learn'
      ).length;


    return (
      <SafeAreaView style={styles.container}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.completionScroll
          }
        >

          
          <View style={styles.celebrationCircle}>

            <Text style={styles.celebration}>
              🎉
            </Text>

          </View>


          <Text style={styles.completionTitle}>
            Lesson Complete!
          </Text>


          <Text style={styles.completionSubtitle}>
            Excelente trabajo
          </Text>


          <Text style={styles.lessonName}>
            {lesson.title}
          </Text>
          
{newAchievements.length > 0 && (

  <View style={styles.achievementUnlockedCard}>

    <Text style={styles.achievementUnlockedEmoji}>
      🏆
    </Text>

    <View style={styles.achievementUnlockedContent}>

      <Text style={styles.achievementUnlockedLabel}>
        ACHIEVEMENT UNLOCKED
      </Text>

      {newAchievements.map((achievement) => (

        <View
          key={achievement.code}
          style={styles.unlockedAchievement}
        >

          <Text style={styles.unlockedAchievementIcon}>
            {achievement.icon}
          </Text>

          <View style={styles.unlockedAchievementInfo}>

            <Text style={styles.unlockedAchievementName}>
              {achievement.name}
            </Text>

            <Text style={styles.unlockedAchievementDescription}>
              {achievement.description}
            </Text>

          </View>

        </View>

      ))}

    </View>

  </View>

)}


         
          <View style={styles.summaryCard}>

            <View style={styles.summaryItem}>

              <Text style={styles.summaryIcon}>
                🎯
              </Text>

              <Text style={styles.summaryNumber}>
                {correctAnswers}/{totalQuestions}
              </Text>

              <Text style={styles.summaryLabel}>
                Correct
              </Text>

            </View>


            <View style={styles.summaryDivider} />


            <View style={styles.summaryItem}>

              <Text style={styles.summaryIcon}>
                📈
              </Text>

              <Text style={styles.summaryNumber}>
                {accuracy}%
              </Text>

              <Text style={styles.summaryLabel}>
                Accuracy
              </Text>

            </View>


            <View style={styles.summaryDivider} />


            <View style={styles.summaryItem}>

              <Text style={styles.summaryIcon}>
                📚
              </Text>

              <Text style={styles.summaryNumber}>
                {wordsLearned}
              </Text>

              <Text style={styles.summaryLabel}>
                Words
              </Text>

            </View>

          </View>


          
          <View style={styles.xpCard}>

            <View style={styles.xpIconCircle}>

              <Text style={styles.xpIcon}>
                ⭐
              </Text>

            </View>


            <View style={styles.xpInfo}>

              <Text style={styles.xpTitle}>
                XP earned
              </Text>

              <Text style={styles.xpSubtitle}>
                Keep going and build your streak!
              </Text>

            </View>


            <Text style={styles.xpNumber}>
              +{lesson.xp}
            </Text>

          </View>


         
          <View style={styles.motivationCard}>

            <Text style={styles.motivationEmoji}>
              🚀
            </Text>

            <View style={styles.motivationContent}>

              <Text style={styles.motivationTitle}>
                You're making progress!
              </Text>

              <Text style={styles.motivationText}>
                Every lesson gets you closer to
                speaking Spanish with confidence.
              </Text>

            </View>

          </View>

        </ScrollView>


        
        <View style={styles.bottomButtonContainer}>

          <Pressable
            style={styles.button}
            onPress={() =>
              navigation.goBack()
            }
          >

            <Text style={styles.buttonText}>
              Continue Learning
            </Text>

            <Text style={styles.buttonArrow}>
              →
            </Text>

          </Pressable>

        </View>

      </SafeAreaView>
    );

  }


  
  const progress =
    ((currentStep + 1) /
      content.steps.length) *
    100;


  return (
    <SafeAreaView style={styles.container}>

     
      <View style={styles.header}>

        <Pressable
          onPress={() =>
            navigation.goBack()
          }
          style={styles.backButton}
        >

          <Text style={styles.back}>
            ‹
          </Text>

        </Pressable>


        <View style={styles.headerCenter}>

          <Text style={styles.lessonHeaderTitle}>
            {lesson.title}
          </Text>


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

        </View>


        <Text style={styles.progressText}>
          {currentStep + 1}/{content.steps.length}
        </Text>

      </View>


      
      {step.type === 'learn' && (

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.learnScroll
          }
        >

          <View style={styles.content}>

            <View style={styles.newWordBadge}>

              <Text style={styles.newWordIcon}>
                ✨
              </Text>

              <Text style={styles.label}>
                NEW WORD
              </Text>

            </View>


            <View style={styles.wordRow}>

  <Text style={styles.spanish}>
    {step.spanish}
  </Text>

  <Pressable
    style={styles.favoriteButton}
    onPress={handleFavorite}
    disabled={favoriteLoading}
  >

    <Text style={styles.favoriteIcon}>
      {
        favorites.some(
          favorite =>
            favorite.word === step.word
        )
          ? '⭐'
          : '☆'
      }
    </Text>

  </Pressable>

</View>


            {step.pronunciation ? (

              <Text style={styles.pronunciation}>
                / {step.pronunciation} /
              </Text>

            ) : null}


            <Pressable
              style={styles.audioButton}
              onPress={handleSpeak}
            >

              <View style={styles.audioIconCircle}>

                <Text style={styles.audioIcon}>
                  🔊
                </Text>

              </View>

              <View>

                <Text style={styles.audioText}>
                  Listen
                </Text>

                <Text style={styles.audioSubtext}>
                  Spanish pronunciation
                </Text>

              </View>

            </Pressable>


            <Text style={styles.english}>
              {step.english}
            </Text>


            {step.example ? (

              <View style={styles.exampleBox}>

                <View style={styles.exampleHeader}>

                  <Text style={styles.exampleIcon}>
                    💬
                  </Text>

                  <Text style={styles.exampleLabel}>
                    EXAMPLE
                  </Text>

                </View>


                <Text style={styles.exampleSpanish}>
                  {step.example}
                </Text>


                {step.exampleTranslation ? (

                  <Text style={styles.exampleEnglish}>
                    {step.exampleTranslation}
                  </Text>

                ) : null}


                <Pressable
                  style={styles.exampleAudio}
                  onPress={() => {
                    if (!speechEnabled ||!step.example){
                      return
                    }

                    Speech.stop();

                    Speech.speak(
                      step.example,
                      {
                        language: 'es-ES',
                        rate: 0.4,
                        pitch: 1.0,
                      }
                    );

                  }}
                >

                  <Text style={styles.exampleAudioText}>
                    🔊 Hear example
                  </Text>

                </Pressable>

              </View>

            ) : null}


            {step.pronunciationTip ? (

              <View style={styles.tipBox}>

                <View style={styles.tipIconCircle}>

                  <Text style={styles.tipIcon}>
                    💡
                  </Text>

                </View>

                <View style={styles.tipContent}>

                  <Text style={styles.tipTitle}>
                    Pronunciation tip
                  </Text>

                  <Text style={styles.tipText}>
                    {step.pronunciationTip}
                  </Text>

                </View>

              </View>

            ) : null}

          </View>

        </ScrollView>

      )}


      
      {step.type === 'quiz' && (

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.questionScroll
          }
        >

          <View style={styles.quizContent}>

            <View style={styles.questionBadge}>

              <Text style={styles.questionBadgeText}>
                🎯 QUIZ
              </Text>

            </View>


            <Text style={styles.question}>
              {step.question}
            </Text>


            <View style={styles.options}>

              {step.options.map(
                (option, index) => {

                  const isSelected =
                    selectedAnswer === option;

                  const isCorrect =
                    option === step.answer;


                  let optionStyle =
                    styles.option;

                  let textStyle =
                    styles.optionText;


                  if (
                    showResult &&
                    isCorrect
                  ) {

                    optionStyle = [
                      styles.option,
                      styles.correctOption,
                    ];

                    textStyle = [
                      styles.optionText,
                      styles.correctText,
                    ];

                  }


                  if (
                    showResult &&
                    isSelected &&
                    !isCorrect
                  ) {

                    optionStyle = [
                      styles.option,
                      styles.wrongOption,
                    ];

                    textStyle = [
                      styles.optionText,
                      styles.wrongText,
                    ];

                  }


                  if (
                    !showResult &&
                    isSelected
                  ) {

                    optionStyle = [
                      styles.option,
                      styles.selectedOption,
                    ];

                  }


                  return (

                    <Pressable
                      key={`${option}-${index}`}
                      style={optionStyle}
                      onPress={() => {
  if (soundEffects) {
    clickSound.seekTo(0);
    clickSound.play();
  }

  handleAnswer(option);
}}
                    >

                      <View
                        style={[
                          styles.optionLetter,
                          !showResult &&
                            isSelected &&
                            styles.selectedLetter,
                          showResult &&
                            isCorrect &&
                            styles.correctLetter,
                          showResult &&
                            isSelected &&
                            !isCorrect &&
                            styles.wrongLetter,
                        ]}
                      >

                        <Text
                          style={[
                            styles.optionLetterText,
                            !showResult &&
                              isSelected &&
                              styles.selectedLetterText,
                            showResult &&
                              isCorrect &&
                              styles.correctLetterText,
                            showResult &&
                              isSelected &&
                              !isCorrect &&
                              styles.wrongLetterText,
                          ]}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </Text>

                      </View>


                      <Text style={textStyle}>
                        {option}
                      </Text>


                      {showResult &&
                        isCorrect && (

                          <Text style={styles.answerIcon}>
                            ✓
                          </Text>

                        )}


                      {showResult &&
                        isSelected &&
                        !isCorrect && (

                          <Text style={styles.answerIcon}>
                            ✕
                          </Text>

                        )}

                    </Pressable>

                  );

                }
              )}

            </View>


            {showResult &&
              renderResult(
                step,
                selectedAnswer,styles
              )}

          </View>

        </ScrollView>

      )}


      
      {step.type === 'listen' && (

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.questionScroll}
        >

          <View style={styles.quizContent}>

            <View style={styles.questionBadge}>

              <Text style={styles.questionBadgeText}>
                🔊 LISTEN
              </Text>

            </View>


            <Text style={styles.question}>
              {step.question}
            </Text>


            <Pressable
              style={styles.listenLargeButton}
              onPress={handleSpeak}
            >

              <View style={styles.listenCircle}>

                <Text style={styles.listenLargeIcon}>
                  🔊
                </Text>

              </View>

              <Text style={styles.listenLargeText}>
                Play Spanish
              </Text>

              <Text style={styles.listenLargeSubtext}>
                Tap to hear the pronunciation
              </Text>

            </Pressable>


            <View style={styles.options}>

              {step.options.map(
                (option, index) => {

                  const isSelected =
                    selectedAnswer === option;

                  const isCorrect =
                    option === step.answer;


                  return (

                    <Pressable
                      key={`${option}-${index}`}
                      style={[
                        styles.option,

                        !showResult &&
                          isSelected &&
                          styles.selectedOption,

                        showResult &&
                          isCorrect &&
                          styles.correctOption,

                        showResult &&
                          isSelected &&
                          !isCorrect &&
                          styles.wrongOption,
                      ]}
                      onPress={() => {
  if (soundEffects) {
    clickSound.seekTo(0);
    clickSound.play();
  }

  handleAnswer(option);
}}
                    >

                      <View
                        style={[
                          styles.optionLetter,

                          !showResult &&
                            isSelected &&
                            styles.selectedLetter,

                          showResult &&
                            isCorrect &&
                            styles.correctLetter,

                          showResult &&
                            isSelected &&
                            !isCorrect &&
                            styles.wrongLetter,
                        ]}
                      >

                        <Text
                          style={[
                            styles.optionLetterText,

                            !showResult &&
                              isSelected &&
                              styles.selectedLetterText,

                            showResult &&
                              isCorrect &&
                              styles.correctLetterText,

                            showResult &&
                              isSelected &&
                              !isCorrect &&
                              styles.wrongLetterText,
                          ]}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </Text>

                      </View>

                      <Text
                        style={[
                          styles.optionText,

                          showResult &&
                            isCorrect &&
                            styles.correctText,

                          showResult &&
                            isSelected &&
                            !isCorrect &&
                            styles.wrongText,
                        ]}
                      >
                        {option}
                      </Text>

                      {showResult &&
                        isCorrect && (

                          <Text style={styles.answerIcon}>
                            ✓
                          </Text>

                        )}

                      {showResult &&
                        isSelected &&
                        !isCorrect && (

                          <Text style={styles.answerIcon}>
                            ✕
                          </Text>

                        )}

                    </Pressable>

                  );

                }
              )}

            </View>


            {showResult &&
              renderResult(
                step,
                selectedAnswer,styles
              )}

          </View>

        </ScrollView>

      )}


      
      {step.type === 'sentence' && (

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.questionScroll}
        >

          <View style={styles.quizContent}>

            <View style={styles.questionBadge}>

              <Text style={styles.questionBadgeText}>
                💬 SENTENCE
              </Text>

            </View>


            <Text style={styles.question}>
              {step.question}
            </Text>


            <View style={styles.sentenceCard}>

              <View style={styles.sentenceTop}>

                <Text style={styles.sentenceLabel}>
                  SPANISH
                </Text>

                <Pressable
                  style={styles.smallAudioButton}
                  onPress={handleSpeak}
                >

                  <Text style={styles.smallAudioText}>
                    🔊
                  </Text>

                </Pressable>

              </View>


              <Text style={styles.sentenceSpanish}>
                {step.spanish}
              </Text>


              <Pressable
                style={styles.sentenceAudio}
                onPress={handleSpeak}
              >

                <Text style={styles.sentenceAudioText}>
                  🔊 Listen to sentence
                </Text>

              </Pressable>

            </View>


            <View style={styles.options}>

              {step.options.map(
                (option, index) => {

                  const isSelected =
                    selectedAnswer === option;

                  const isCorrect =
                    option === step.answer;


                  return (

                    <Pressable
                      key={`${option}-${index}`}
                      style={[
                        styles.option,

                        !showResult &&
                          isSelected &&
                          styles.selectedOption,

                        showResult &&
                          isCorrect &&
                          styles.correctOption,

                        showResult &&
                          isSelected &&
                          !isCorrect &&
                          styles.wrongOption,
                      ]}
                      onPress={() => {
  if (soundEffects) {
    clickSound.seekTo(0);
    clickSound.play();
  }

  handleAnswer(option);
}}
                    >

                      <View
                        style={[
                          styles.optionLetter,

                          !showResult &&
                            isSelected &&
                            styles.selectedLetter,

                          showResult &&
                            isCorrect &&
                            styles.correctLetter,

                          showResult &&
                            isSelected &&
                            !isCorrect &&
                            styles.wrongLetter,
                        ]}
                      >

                        <Text
                          style={[
                            styles.optionLetterText,

                            !showResult &&
                              isSelected &&
                              styles.selectedLetterText,

                            showResult &&
                              isCorrect &&
                              styles.correctLetterText,

                            showResult &&
                              isSelected &&
                              !isCorrect &&
                              styles.wrongLetterText,
                          ]}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </Text>

                      </View>

                      <Text
                        style={[
                          styles.optionText,

                          showResult &&
                            isCorrect &&
                            styles.correctText,

                          showResult &&
                            isSelected &&
                            !isCorrect &&
                            styles.wrongText,
                        ]}
                      >
                        {option}
                      </Text>

                      {showResult &&
                        isCorrect && (

                          <Text style={styles.answerIcon}>
                            ✓
                          </Text>

                        )}

                      {showResult &&
                        isSelected &&
                        !isCorrect && (

                          <Text style={styles.answerIcon}>
                            ✕
                          </Text>

                        )}

                    </Pressable>

                  );

                }
              )}

            </View>


            {showResult &&
              renderResult(
                step,
                selectedAnswer,styles
              )}

          </View>

        </ScrollView>

      )}


      
      <View style={styles.bottomButtonContainer}>

        <Pressable
          style={[
            styles.button,

            isQuestionStep &&
              !showResult &&
              styles.disabledButton,
          ]}
          disabled={
            isQuestionStep &&
            !showResult
          }
          onPress={handleContinue}
        >

          <Text style={styles.buttonText}>

            {isLastStep
              ? 'Finish Lesson'
              : 'Continue'}

          </Text>


          <Text style={styles.buttonArrow}>
            →
          </Text>

        </Pressable>

      </View>

    </SafeAreaView>
  );

}



function renderResult(
  step,
  selectedAnswer ,styles
) {

  const correct =
    selectedAnswer === step.answer;


  return (

    <View
      style={[
        styles.resultBox,
        correct
          ? styles.correctBox
          : styles.wrongBox,
      ]}
    >

      <View
        style={[
          styles.resultIconCircle,
          correct
            ? styles.resultCorrectCircle
            : styles.resultWrongCircle,
        ]}
      >

        <Text style={styles.resultIconText}>
          {correct ? '✓' : '✕'}
        </Text>

      </View>


      <SafeAreaView style={styles.resultContent}>

        <Text style={styles.resultTitle}>

          {correct
            ? 'Correct!'
            : 'Not quite'}

        </Text>


        <Text style={styles.resultText}>

          {correct
            ? 'Great job! You got it right.'
            : `The correct answer was "${step.answer}".`}

        </Text>

      </SafeAreaView>

    </View>

  );

}

const createStyles = (colors) => ({

  
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  errorEmoji: {
    fontSize: 55,
    marginBottom: 18,
  },

  errorTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },

  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },

  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  back: {
    fontSize: 32,
    fontWeight: '400',
    color: colors.text,
    marginTop: -3,
  },

  headerCenter: {
    flex: 1,
    marginHorizontal: 12,
  },

  lessonHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 9,
  },

  progressBackground: {
    height: 7,
    backgroundColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  progressText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    minWidth: 38,
    textAlign: 'right',
  },

  
  learnScroll: {
    paddingBottom: 120,
  },

  
  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 120,
  },

  newWordBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.yellowSoft,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginBottom: 12,
  },

  newWordIcon: {
    fontSize: 13,
    marginRight: 6,
  },

  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: colors.primary,
  },

  
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  spanish: {
    fontSize: 39,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.8,
    flexShrink: 1,
  },

  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  favoriteIcon: {
    fontSize: 25,
  },

  pronunciation: {
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 7,
    fontStyle: 'italic',
  },

  
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 20,
  },

  audioIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  audioIcon: {
    fontSize: 20,
  },

  audioText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },

  audioSubtext: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },

  english: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 29,
  },

  
  exampleBox: {
    backgroundColor: colors.infoBackground,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: 20,
    padding: 17,
    marginTop: 24,
  },

  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  exampleIcon: {
    fontSize: 17,
    marginRight: 7,
  },

  exampleLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1.1,
  },

  exampleSpanish: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.text,
  },

  exampleEnglish: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },

  exampleAudio: {
    alignSelf: 'flex-start',
    marginTop: 13,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  exampleAudioText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },

  
  tipBox: {
    flexDirection: 'row',
    backgroundColor: colors.yellowSoft,
    borderRadius: 20,
    padding: 16,
    marginTop: 18,
  },

  tipIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  tipIcon: {
    fontSize: 20,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 4,
  },

  tipText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  
  questionScroll: {
    paddingBottom: 120,
  },

  quizContent: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 25,
  },

  questionBadge: {
    alignSelf: 'center',
    backgroundColor: colors.redSoft,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginBottom: 20,
  },

  questionBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.8,
  },

  question: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 25,
  },

  
  options: {
    gap: 11,
  },

  option: {
    minHeight: 62,
    backgroundColor: colors.card,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },

  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 11,
    lineHeight: 21,
  },

  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.pressed,
  },

  correctOption: {
    borderColor: colors.green,
    backgroundColor: colors.greenSoft,
  },

  wrongOption: {
    borderColor: colors.error,
    backgroundColor: colors.dangerPressed,
  },

  
  optionLetter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedLetter: {
    backgroundColor: colors.primary,
  },

  correctLetter: {
    backgroundColor: colors.green,
  },

  wrongLetter: {
    backgroundColor: colors.error,
  },

  optionLetterText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.textSecondary,
  },

  selectedLetterText: {
    color: colors.white,
  },

  correctLetterText: {
    color: colors.white,
  },

  wrongLetterText: {
    color: colors.white,
  },

  answerIcon: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    marginLeft: 8,
  },

  correctText: {
    color: colors.green,
  },

  wrongText: {
    color: colors.error,
  },

  
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 15,
    marginTop: 18,
    borderWidth: 1,
  },

  correctBox: {
    backgroundColor: colors.greenSoft,
    borderColor: colors.green,
  },

  wrongBox: {
    backgroundColor: colors.dangerPressed,
    borderColor: colors.error,
  },

  resultIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  resultCorrectCircle: {
    backgroundColor: colors.green,
  },

  resultWrongCircle: {
    backgroundColor: colors.error,
  },

  resultIconText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.white,
  },

  resultContent: {
    flex: 1,
  },

  resultTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },

  resultText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 3,
  },

  
  listenLargeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 25,
    marginBottom: 24,
  },

  listenCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  listenLargeIcon: {
    fontSize: 31,
  },

  listenLargeText: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },

  listenLargeSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  
  sentenceCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 23,
  },

  sentenceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },

  sentenceLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1.2,
  },

  smallAudioButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallAudioText: {
    fontSize: 17,
  },

  sentenceSpanish: {
    fontSize: 20,
    lineHeight: 29,
    fontWeight: '800',
    color: colors.text,
  },

  sentenceAudio: {
    alignSelf: 'flex-start',
    backgroundColor: colors.infoBackground,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginTop: 15,
  },

  sentenceAudioText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },

  
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  button: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  disabledButton: {
    backgroundColor: colors.switchOff,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.white,
  },

  buttonArrow: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    marginLeft: 10,
  },

  
  completionScroll: {
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 120,
  },

  celebrationCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.yellowSoft,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  celebration: {
    fontSize: 45,
  },

  completionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },

  completionSubtitle: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 6,
  },

  lessonName: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 7,
  },

  
  achievementUnlockedCard: {
    flexDirection: 'row',
    backgroundColor: colors.yellowSoft,
    borderRadius: 22,
    padding: 17,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.yellow,
  },

  achievementUnlockedEmoji: {
    fontSize: 30,
    marginRight: 13,
  },

  achievementUnlockedContent: {
    flex: 1,
  },

  achievementUnlockedLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 9,
  },

  unlockedAchievement: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  unlockedAchievementIcon: {
    fontSize: 25,
    marginRight: 10,
  },

  unlockedAchievementInfo: {
    flex: 1,
  },

  unlockedAchievementName: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },

  unlockedAchievementDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    marginTop: 2,
  },

  
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 18,
    marginTop: 20,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryIcon: {
    fontSize: 19,
    marginBottom: 5,
  },

  summaryNumber: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.text,
  },

  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 2,
  },

  summaryDivider: {
    width: 1,
    height: 42,
    backgroundColor: colors.border,
  },

  
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.redSoft,
    borderRadius: 22,
    padding: 16,
    marginTop: 15,
  },

  xpIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  xpIcon: {
    fontSize: 22,
  },

  xpInfo: {
    flex: 1,
  },

  xpTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },

  xpSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
  },

  xpNumber: {
    fontSize: 23,
    fontWeight: '900',
    color: colors.primary,
  },

  
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoBackground,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    padding: 17,
    marginTop: 15,
  },

  motivationEmoji: {
    fontSize: 28,
    marginRight: 13,
  },

  motivationContent: {
    flex: 1,
  },

  motivationTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },

  motivationText: {
    fontSize: 11,
    lineHeight: 17,
    color: colors.textSecondary,
    marginTop: 4,
  },

});