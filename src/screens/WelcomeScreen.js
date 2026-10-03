import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../Context/ThemeContext';


export default function WelcomeScreen({ navigation }) {
  const {colors}=useTheme()
  const styles= createStyles(colors)
  return (
    <SafeAreaView style={styles.container}>

      
      <View style={styles.backgroundCircleTop} />
      <View style={styles.backgroundCircleBottom} />


     
      <View style={styles.content}>


        <View style={styles.badge}>

          <View style={styles.badgeDot} />

          <Text style={styles.badgeText}>
            SPANISH LEARNING
          </Text>

        </View>



        <View style={styles.logoWrapper}>

          <View style={styles.logoOuter}>

            <View style={styles.logoInner}>

              <Text style={styles.logoEmoji}>
                🇪🇸
              </Text>

            </View>

          </View>

        </View>



        <Text style={styles.title}>
          ¡Hola!
        </Text>


        <Text style={styles.titleAccent}>
          Learn Spanish with confidence.
        </Text>



        <Text style={styles.subtitle}>
          Build real vocabulary, practice every day,
          and improve step by step.
        </Text>


        
        <View style={styles.features}>


          <View style={styles.feature}>

            <View
              style={[
                styles.featureIconContainer,
                styles.featureIconWarm,
              ]}
            >

              <Text style={styles.featureIcon}>
                📚
              </Text>

            </View>

            <View style={styles.featureContent}>

              <Text style={styles.featureTitle}>
                Real vocabulary
              </Text>

              <Text style={styles.featureDescription}>
                Learn useful Spanish words
              </Text>

            </View>

            <Text style={styles.featureCheck}>
              ✓
            </Text>

          </View>



          <View style={styles.feature}>

            <View
              style={[
                styles.featureIconContainer,
                styles.featureIconYellow,
              ]}
            >

              <Text style={styles.featureIcon}>
                🎯
              </Text>

            </View>

            <View style={styles.featureContent}>

              <Text style={styles.featureTitle}>
                Learn at your level
              </Text>

              <Text style={styles.featureDescription}>
                Progress from beginner to advanced
              </Text>

            </View>

            <Text style={styles.featureCheck}>
              ✓
            </Text>

          </View>



          <View style={styles.feature}>

            <View
              style={[
                styles.featureIconContainer,
                styles.featureIconGreen,
              ]}
            >

              <Text style={styles.featureIcon}>
                🔥
              </Text>

            </View>

            <View style={styles.featureContent}>

              <Text style={styles.featureTitle}>
                Build your streak
              </Text>

              <Text style={styles.featureDescription}>
                Stay consistent every day
              </Text>

            </View>

            <Text style={styles.featureCheck}>
              ✓
            </Text>

          </View>

        </View>

      </View>


      
      <View style={styles.bottom}>

        <Text style={styles.bottomText}>
          Your Spanish journey starts here
        </Text>


        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() =>
            navigation.navigate('Auth')
          }
        >

          <Text style={styles.buttonText}>
            Get Started
          </Text>

          <View style={styles.buttonArrowContainer}>

            <Text style={styles.buttonArrow}>
              →
            </Text>

          </View>

        </Pressable>


        <Text style={styles.footer}>
          Choose your Spanish level next
        </Text>

      </View>

    </SafeAreaView>
  );
}



const createStyles = (colors) => ({
  
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 22,
    overflow: 'hidden',
  },

  
  backgroundCircleTop: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.redSoft,
    top: -120,
    right: -80,
    opacity: 0.65,
  },

  backgroundCircleBottom: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.yellowSoft,
    bottom: -100,
    left: -80,
    opacity: 0.6,
  },

  
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },

  
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    marginBottom: 22,
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: colors.primary,
  },

  
  logoWrapper: {
    marginBottom: 18,
  },

  logoOuter: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoInner: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  logoEmoji: {
    fontSize: 54,
  },

  
  title: {
    fontSize: 50,
    lineHeight: 56,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1.5,
  },

  titleAccent: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 5,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 330,
    marginTop: 12,
  },

  
  features: {
    width: '100%',
    marginTop: 24,
    gap: 9,
  },

  feature: {
    width: '100%',
    minHeight: 63,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  featureIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  featureIconWarm: {
    backgroundColor: colors.redSoft,
  },

  featureIconYellow: {
    backgroundColor: colors.yellowSoft,
  },

  featureIconGreen: {
    backgroundColor: colors.greenSoft,
  },

  featureIcon: {
    fontSize: 20,
  },

  featureContent: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },

  featureDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },

  featureCheck: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.green,
    marginLeft: 8,
  },

  
  bottom: {
    paddingBottom: 12,
    paddingTop: 10,
  },

  bottomText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 9,
  },

  
  button: {
    height: 58,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingLeft: 22,
    paddingRight: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  buttonText: {
    flex: 1,
    textAlign: 'center',
    marginLeft: 35,
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  buttonArrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonArrow: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },

  
  footer: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.textLight,
    marginTop: 8,
  },
});