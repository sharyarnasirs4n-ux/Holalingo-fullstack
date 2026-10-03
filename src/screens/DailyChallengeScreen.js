import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useProgress } from '../Context/ProgressContext';
import { getToken } from '../services/authStorage';
import { useTheme } from '../Context/ThemeContext';
const API_URL = 'https://holalingo-backend.onrender.com';

export default function DailyChallengeScreen() {
  const { colors } = useTheme();
     const styles = createStyles(colors);
  const [challenge, setChallenge] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [answers, setAnswers] = useState({});
const [result, setResult] = useState(null);
const {updateXp}=useProgress()
  useEffect(() => {
    loadChallenge();
  }, []);

 const loadChallenge=async()=> {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();

      if (!token) {
        throw new Error('No access token');
      }

      const response = await fetch(
        `${API_URL}/daily-challenge`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          'Failed to load daily challenge'
        );
      }

      setChallenge(data);

    } catch (error) {
      console.log(
        'DAILY CHALLENGE ERROR:',
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);
    }
  }
  
const selectAnswer=(questionId, option)=> {
  setAnswers(previous => ({
    ...previous,
    [questionId]: option,
  }));
}
const submitChallenge=async()=> {
  if (
    Object.keys(answers).length !==
    challenge.questions.length
  ) {
    setError(
      'Please answer all questions before submitting.'
    );

    return;
  }

  try {
    setError(null);

    const token = await getToken();

    if (!token) {
      throw new Error('No access token');
    }

    const response = await fetch(
      `${API_URL}/daily-challenge/complete?challenge_id=${challenge.id}`,
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(answers),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
        'Failed to submit challenge'
      );
    }

    console.log(
  'DAILY CHALLENGE RESULT:',
  data
);
setResult(data)

updateXp(data.total_xp);

setChallenge(previous => ({
  ...previous,
  completed: true,
}));

  } catch (error) {
    console.log(
      'DAILY CHALLENGE SUBMIT ERROR:',
      error
    );

    setError(error.message);
  }
}



  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading today's challenge...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Something went wrong
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadChallenge}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!challenge) {
    return null;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >


      <View style={styles.header}>
        <Text style={styles.emoji}>
          🧠
        </Text>

        <Text style={styles.title}>
          {challenge.title}
        </Text>

        <Text style={styles.description}>
          {challenge.description}
        </Text>

        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>
            +{challenge.xp_reward} XP
          </Text>
        </View>
      </View>



      {challenge.completed && (
  <View style={styles.resultCard}>

    <Text style={styles.resultEmoji}>
      🏆
    </Text>

    <Text style={styles.resultTitle}>
      Challenge Complete!
    </Text>

    {result ? (
      <>
        <Text style={styles.resultScore}>
          {result.score} / {result.total_questions}
        </Text>

        <Text style={styles.resultSubtitle}>
          {result.score === result.total_questions
            ? 'Perfect score! 🎉'
            : result.score >= 3
            ? 'Great job! Keep going!'
            : 'Good effort! Keep practicing!'}
        </Text>

        <View style={styles.resultXp}>
          <Text style={styles.resultXpText}>
            +{result.xp_earned} XP
          </Text>
        </View>
      </>
    ) : (
      <Text style={styles.resultSubtitle}>
        You have already completed today's challenge.
      </Text>
    )}

  </View>
)}



      {!challenge.completed &&
        challenge.questions.map(
          (question, index) => (
            <View
              key={question.id}
              style={styles.questionCard}
            >

              <Text style={styles.questionNumber}>
                QUESTION {index + 1}
              </Text>

              <Text style={styles.question}>
                {question.question}
              </Text>


              {question.options.map(
  (option) => {

    const isSelected =
      answers[question.id] === option;

    return (
      <TouchableOpacity
        key={option}
        style={[
          styles.option,
          isSelected &&
            styles.selectedOption,
        ]}
        onPress={() =>
          selectAnswer(
            question.id,
            option
          )
        }
      >
        <Text
          style={[
            styles.optionText,
            isSelected &&
              styles.selectedOptionText,
          ]}
        >
          {option}
        </Text>
      </TouchableOpacity>
    );
  }
)}

            </View>
          )
        )}
        {!challenge.completed && (
  <TouchableOpacity
    style={styles.submitButton}
    onPress={submitChallenge}
  >
    <Text style={styles.submitButtonText}>
      Submit Challenge
    </Text>
  </TouchableOpacity>
)}

    </ScrollView>
  );
}


const createStyles = (colors) => ({
  
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },

  
  errorTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },

  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },

  retryText: {
    color: colors.white,
    fontWeight: '800',
  },

  
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  emoji: {
    fontSize: 42,
    marginBottom: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
  },

  description: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  
  xpBadge: {
    marginTop: 14,
    backgroundColor: colors.yellowSoft,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  xpText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.yellow,
  },

  
  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greenSoft,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },

  completedEmoji: {
    fontSize: 28,
    marginRight: 12,
  },

  completedTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.green,
  },

  completedText: {
    marginTop: 3,
    fontSize: 12,
    color: colors.textSecondary,
  },

  
  questionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  questionNumber: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.primary,
    marginBottom: 8,
  },

  question: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 14,
    lineHeight: 24,
  },

  
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    backgroundColor: colors.background,
  },

  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  selectedOption: {
    backgroundColor: colors.yellowSoft,
    borderColor: colors.primary,
    borderWidth: 2,
  },

  selectedOptionText: {
    color: colors.text,
    fontWeight: '900',
  },

  
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },

  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },

  
  resultCard: {
    backgroundColor: colors.yellowSoft,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  resultEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },

  resultTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },

  resultScore: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 14,
  },

  resultSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },

  resultXp: {
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  resultXpText: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.yellow,
  },
});