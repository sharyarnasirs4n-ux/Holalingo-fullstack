import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';


import { useTheme } from '../Context/ThemeContext';
import { useProgress } from "../Context/ProgressContext";

export default function UnitScreen({ route, navigation }) {
  const { unit } = route.params;
const {colors}=useTheme()
const styles=createStyles(colors)
  const { completedLessons } = useProgress();

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >


        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ← Back
          </Text>
        </Pressable>



        <Text style={styles.emoji}>
          {unit.emoji}
        </Text>

        <Text style={styles.title}>
          {unit.title}
        </Text>

        <Text style={styles.description}>
          {unit.description}
        </Text>


        <View style={styles.divider} />



        <Text style={styles.sectionTitle}>
          Lessons
        </Text>

        {unit.lessons.map((lesson, index) => {

          const completed =
            completedLessons.includes(lesson.id);


          return (

            <Pressable
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() =>
                navigation.navigate('Lesson', {
  lesson,
})
              }
            >


              <View
                style={[
                  styles.number,
                  completed &&
                    styles.completedNumber,
                ]}
              >

                <Text style={styles.numberText}>
                  {completed
                    ? '✓'
                    : index + 1}
                </Text>

              </View>



              <View style={styles.lessonInfo}>

                <Text style={styles.lessonTitle}>
                  {lesson.title}
                </Text>

                <Text style={styles.lessonDescription}>
                  {lesson.description}
                </Text>

                <Text style={styles.lessonMeta}>
                  {lesson.duration} · {lesson.xp} XP
                </Text>

              </View>



              <Text style={styles.arrow}>
                →
              </Text>

            </Pressable>

          );

        })}

      </ScrollView>

    </View>
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

  backButton: {
    marginBottom: 25,
  },

  backText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },

  emoji: {
    fontSize: 50,
    marginBottom: 12,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },

  description: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 7,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 25,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 14,
  },

  lessonCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },

  number: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: colors.redSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  completedNumber: {
    backgroundColor: colors.greenSoft,
  },

  numberText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },

  lessonInfo: {
    flex: 1,
  },

  lessonTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  lessonDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  lessonMeta: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 7,
    fontWeight: '600',
  },

  arrow: {
    fontSize: 22,
    color: colors.primary,
    marginLeft: 8,
  },
});