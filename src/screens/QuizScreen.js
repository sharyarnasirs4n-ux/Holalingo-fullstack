import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import { useEffect, useState } from 'react';

import { useTheme } from '../Context/ThemeContext';
import { loadCourse } from '../data/courseStorage';

import { useProgress } from '../Context/ProgressContext';


const QUESTIONS_PER_QUIZ = 15;
export default function QuizPracticeScreen({route}) {
const {colors}=useTheme()
const styles=createStyles(colors)
  const {
    completedLessons,
  } = useProgress();

const level=route?.params?.level ||"A0"  

  const [course, setCourse] = useState([]);

  const [loading, setLoading] = useState(true);


 
  const [questions, setQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);


  
  useEffect(() => {

    loadQuizData();

  }, []);


  async function loadQuizData() {

    try {

      setLoading(true);


      
      const savedCourse =
        await loadCourse(level);


      if (!savedCourse) {

        setCourse([]);

        return;

      }


      setCourse(savedCourse);


     
      const allLessons =
        savedCourse.flatMap(
          unit => unit.lessons || []
        );


      
      const completed =
        allLessons.filter(
          lesson =>
            completedLessons.includes(
              lesson.id
            )
        );


     
      const lessonsForQuiz =
        completed.length > 0
          ? completed
          : allLessons;


     
      const quizQuestions =
        lessonsForQuiz.flatMap(
          lesson => {

            const quizSteps =
              (lesson.steps || []).filter(
                step =>
                  step.type === 'quiz'
              );


            return quizSteps.map(
              step => ({

                question:
                  step.question,

                options:
                  step.options,

                answer:
                  step.answer,

                lessonId:
                  lesson.id,

              })
            );

          }
        );


     
      const selectedQuestions =
        quizQuestions
          .sort(() => Math.random() - 0.5)
          .slice(
            0,
            QUESTIONS_PER_QUIZ
          );


      setQuestions(
        selectedQuestions
      );

    } catch (error) {

      console.log(
        'Quiz loading error:',
        error
      );

    } finally {

      setLoading(false);

    }

  }


  
  function selectAnswer(answer) {

    if (selectedAnswer !== null) {
      return;
    }


    setSelectedAnswer(answer);


    const question =
      questions[currentQuestion];


    if (
      answer === question.answer
    ) {

      setScore(
        previous => previous + 1
      );

    }

  }


  
  function nextQuestion() {

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        previous => previous + 1
      );

      setSelectedAnswer(null);

    } else {

      setFinished(true);

    }

  }


  
  if (loading) {

    return (

      <View style={styles.center}>

        <Text style={styles.loadingEmoji}>
          🧠
        </Text>

        <Text style={styles.loadingTitle}>
          Preparing your quiz...
        </Text>

        <Text style={styles.loadingText}>
          Finding questions from your course
        </Text>

      </View>

    );

  }


  
  if (
    questions.length === 0
  ) {

    return (

      <View style={styles.center}>

        <Text style={styles.loadingEmoji}>
          📚
        </Text>

        <Text style={styles.loadingTitle}>
          No quiz questions yet
        </Text>

        <Text style={styles.loadingText}>
          Complete some lessons first and come back
          here to practice.
        </Text>

      </View>

    );

  }


 
  if (finished) {

    return (

      <ScrollView
        contentContainerStyle={styles.resultContainer}
      >

        <Text style={styles.resultEmoji}>
          🎉
        </Text>

        <Text style={styles.resultTitle}>
          Quiz Complete!
        </Text>

        <Text style={styles.resultScore}>
          {score} / {questions.length}
        </Text>

        <Text style={styles.resultText}>

          {score === questions.length
            ? 'Perfect! Excellent work! 🔥'
            : score >= questions.length / 2
              ? 'Good job! Keep practicing! 💪'
              : 'Keep learning and try again! 📚'}

        </Text>


        <Pressable
          style={styles.button}
          onPress={() => {

            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setScore(0);
            setFinished(false);

            loadQuizData();

          }}
        >

          <Text style={styles.buttonText}>
            Try Again
          </Text>

        </Pressable>

      </ScrollView>

    );

  }


  
  const question =
    questions[currentQuestion];


  const questionNumber =
    currentQuestion + 1;


  const progress =
    (questionNumber /
      questions.length) *
    100;


  
  return (

    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >

      
      <Text style={styles.eyebrow}>
        QUICK QUIZ
      </Text>


      <View style={styles.headerRow}>

        <Text style={styles.counter}>
          Question {questionNumber} of {questions.length}
        </Text>

        <Text style={styles.score}>
          ⭐ {score}
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


     
      <View style={styles.questionCard}>

        <Text style={styles.questionLabel}>
          QUESTION
        </Text>

        <Text style={styles.question}>
          {question.question}
        </Text>

      </View>


     
      <Text style={styles.answerTitle}>
        Choose the correct answer
      </Text>


      {question.options.map(
        (option, index) => {

          const isSelected =
            selectedAnswer === option;

          const isCorrect =
            option === question.answer;


          let optionStyle =
            styles.option;


          if (
            selectedAnswer !== null &&
            isCorrect
          ) {

            optionStyle =
              [
                styles.option,
                styles.correctOption,
              ];

          } else if (
            isSelected &&
            !isCorrect
          ) {

            optionStyle =
              [
                styles.option,
                styles.wrongOption,
              ];

          }


          return (

            <Pressable
              key={index}
              style={optionStyle}
              onPress={() =>
                selectAnswer(option)
              }
            >

              <View style={styles.optionLetter}>

                <Text
                  style={styles.optionLetterText}
                >
                  {String.fromCharCode(
                    65 + index
                  )}
                </Text>

              </View>


              <Text style={styles.optionText}>
                {option}
              </Text>


              {selectedAnswer !== null &&
                isCorrect && (

                  <Text style={styles.resultIcon}>
                    ✓
                  </Text>

                )}


              {selectedAnswer === option &&
                !isCorrect && (

                  <Text style={styles.resultIcon}>
                    ✕
                  </Text>

                )}

            </Pressable>

          );

        }
      )}


      
      {selectedAnswer !== null && (

        <Pressable
          style={styles.nextButton}
          onPress={nextQuestion}
        >

          <Text style={styles.nextButtonText}>

            {currentQuestion ===
              questions.length - 1
              ? 'Finish Quiz'
              : 'Next Question'}

          </Text>

        </Pressable>

      )}

    </ScrollView>

  );

}



const createStyles = (colors) => ({
  content: {
    padding: 24,
    paddingBottom: 50,
    backgroundColor: colors.background,
    flexGrow: 1,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  loadingEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },

  loadingTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },

  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primary,
    marginTop: 15,
    marginBottom: 12,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  counter: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },

  score: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },

  progressBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 14,
    marginBottom: 25,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  
  questionCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 25,
  },

  questionLabel: {
    color: colors.heroTextSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  question: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 31,
  },

 
  answerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },

  option: {
    minHeight: 64,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionLetter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  optionLetterText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
  },

  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    fontWeight: '600',
  },

  correctOption: {
    borderColor: colors.green,
    backgroundColor: colors.greenSoft,
  },

  wrongOption: {
    borderColor: colors.error,
    backgroundColor: colors.redSoft,
  },

  resultIcon: {
    fontSize: 20,
    fontWeight: '900',
    marginLeft: 8,
    color: colors.text,
  },

  
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 10,
  },

  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },

  
  resultContainer: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resultEmoji: {
    fontSize: 70,
    marginBottom: 20,
  },

  resultTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.text,
  },

  resultScore: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 15,
  },

  resultText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 50,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});