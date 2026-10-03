import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { updateProfile } from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useTheme } from '../Context/ThemeContext';


const LEVELS = [
  {
    level: 'A0',
    emoji: '🌱',
    title: 'Absolute Beginner',
    description: 'I know little or no Spanish',
  },

  {
    level: 'A1',
    emoji: '🙂',
    title: 'Beginner',
    description: 'I know some basic Spanish',
  },

  {
    level: 'A2',
    emoji: '📚',
    title: 'Elementary',
    description: 'I understand simple everyday Spanish',
  },

  {
    level: 'B1',
    emoji: '🚀',
    title: 'Intermediate',
    description: 'I can handle basic conversations',
  },

  {
    level: 'B2',
    emoji: '🎯',
    title: 'Upper Intermediate',
    description: 'I understand more complex Spanish',
  },

  {
    level: 'C1',
    emoji: '🧠',
    title: 'Advanced',
    description: 'I can communicate fluently',
  },

  {
    level: 'C2',
    emoji: '🏆',
    title: 'Proficient',
    description: 'I can use Spanish with confidence',
  },
];



export default function LevelScreen({
  navigation,
  route,
}) {

const { colors } = useTheme();
const styles = createStyles(colors);

const afterLevelSelection =
  route?.params?.afterLevelSelection;
  const [saving, setSaving] = useState(false);
async function selectLevel(level) {

  if (saving) {
    return;
  }

  try {

    if (afterLevelSelection) {

      setSaving(true);

      await updateProfile({
        level,
      });

      afterLevelSelection();

      return;
    }

    navigation.navigate('Main', {
      level,
    });

  } catch (error) {

    console.log(
      'LEVEL UPDATE ERROR:',
      error
    );

    Alert.alert(
      'Unable to save level',
      error?.message ||
        'We could not save your level. Please try again.'
    );

  } finally {

    setSaving(false);

  }

}


  
  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >


        
        <View style={styles.brandRow}>

          <View style={styles.brandBadge}>

            <Text style={styles.brandIcon}>
              🇪🇸
            </Text>

            <Text style={styles.brandText}>
              HOLA LINGO
            </Text>

          </View>

        </View>


        
        <View style={styles.header}>

          <Text style={styles.eyebrow}>
            LET'S GET STARTED
          </Text>


          <Text style={styles.title}>
            What's your Spanish level?
          </Text>


          <Text style={styles.subtitle}>
            Choose the level that feels right for you.
            You can change it anytime.
          </Text>

        </View>


      
        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Choose your level
          </Text>

          <Text style={styles.sectionCount}>
            {LEVELS.length} levels
          </Text>

        </View>


        <View style={styles.options}>

          {LEVELS.map((item, index) => (

            <Pressable
              key={item.level}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={() =>
                selectLevel(item.level)
              }
            >

            
              <View style={styles.numberContainer}>

                <Text style={styles.number}>
                  {String(index + 1).padStart(2, '0')}
                </Text>

              </View>


            
              <View style={styles.emojiContainer}>

                <Text style={styles.optionEmoji}>
                  {item.emoji}
                </Text>

              </View>


             
              <View style={styles.optionInfo}>

                <View style={styles.levelRow}>

                  <View style={styles.levelBadge}>

                    <Text style={styles.level}>
                      {item.level}
                    </Text>

                  </View>


                  <Text style={styles.optionTitle}>
                    {item.title}
                  </Text>

                </View>


                <Text style={styles.optionText}>
                  {item.description}
                </Text>

              </View>


            
              <View style={styles.arrowContainer}>

                <Text style={styles.arrow}>
                  →
                </Text>

              </View>

            </Pressable>

          ))}

        </View>


        
        <View style={styles.helpCard}>

          <View style={styles.helpIconContainer}>

            <Text style={styles.helpIcon}>
              💡
            </Text>

          </View>


          <View style={styles.helpContent}>

            <Text style={styles.helpTitle}>
              Not sure which level?
            </Text>


            <Text style={styles.helpText}>
              Start lower. It's better to build a
              strong foundation and move up later.
            </Text>

          </View>

        </View>


        <View style={styles.footerRow}>

          <Text style={styles.footerIcon}>
            ⚙️
          </Text>

          <Text style={styles.footer}>
            You can change your level later in Profile.
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
    paddingTop: 8,
    paddingBottom: 45,
  },

  
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.card,

    borderWidth: 1,
    borderColor: colors.border,

    paddingHorizontal: 13,
    paddingVertical: 8,

    borderRadius: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.025,
    shadowRadius: 5,
    elevation: 1,
  },

  brandIcon: {
    fontSize: 13,
    marginRight: 6,
  },

  brandText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: colors.primary,
  },

  
  header: {
    marginBottom: 25,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.8,
    color: colors.primary,
    marginBottom: 9,
  },

  title: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.6,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
    marginTop: 11,
    maxWidth: 365,
  },

  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.text,
  },

  sectionCount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
  },

  
  options: {
    gap: 10,
  },

  option: {
    minHeight: 78,

    backgroundColor: colors.card,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: colors.border,

    paddingVertical: 13,
    paddingHorizontal: 11,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 6,
    elevation: 1,
  },

  optionPressed: {
    backgroundColor: colors.pressed,
    borderColor: colors.primary,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  
  numberContainer: {
    width: 26,
    alignItems: 'center',
    marginRight: 4,
  },

  number: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 0.3,
  },

  
  emojiContainer: {
    width: 50,
    height: 50,

    borderRadius: 16,

    backgroundColor: colors.redSoft,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  optionEmoji: {
    fontSize: 25,
  },

  
  optionInfo: {
    flex: 1,
    minWidth: 0,
  },

  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',

    flexWrap: 'wrap',

    paddingRight: 3,
  },

  levelBadge: {
    backgroundColor: colors.redSoft,

    borderRadius: 7,

    paddingHorizontal: 7,
    paddingVertical: 3,

    marginRight: 7,
  },

  level: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.6,
  },

  optionTitle: {
    flexShrink: 1,

    fontSize: 14,
    lineHeight: 18,

    fontWeight: '800',

    color: colors.text,
  },

  optionText: {
    fontSize: 11.5,
    lineHeight: 16,

    color: colors.textSecondary,

    marginTop: 4,

    paddingRight: 4,
  },

  
  arrowContainer: {
    width: 35,
    height: 35,

    borderRadius: 18,

    backgroundColor: colors.redSoft,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 7,
  },

  arrow: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.primary,

    marginTop: -1,
  },

  
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: colors.yellowSoft,

    borderRadius: 20,

    padding: 15,

    marginTop: 20,

    borderWidth: 1,
    borderColor: colors.border,
  },

  helpIconContainer: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: colors.yellowSoft,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  helpIcon: {
    fontSize: 20,
  },

  helpContent: {
    flex: 1,
  },

  helpTitle: {
    fontSize: 13,
    fontWeight: '900',

    color: colors.text,

    marginBottom: 3,
  },

  helpText: {
    fontSize: 12,
    lineHeight: 18,

    color: colors.textSecondary,

    paddingRight: 3,
  },

  
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 15,
  },

  footerIcon: {
    fontSize: 11,
    marginRight: 5,
  },

  footer: {
    textAlign: 'center',

    fontSize: 11,

    color: colors.textLight,
  },
});