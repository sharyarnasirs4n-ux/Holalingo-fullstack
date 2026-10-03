import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../theme/colors';
import { useProgress } from '../Context/ProgressContext';
import { useTheme } from '../Context/ThemeContext';
import quotes from "../data/quotes.json"

function getLocalDateString(date = new Date()) {

  const year = date.getFullYear();
  
  


  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;

}



function getLastSevenDays() {

  const days = [];

  const today = new Date();

  for (let i = 6; i >= 0; i--) {

    const date = new Date(today);

    date.setDate(
      today.getDate() - i
    );

    days.push({
      date,
      dateString:
        getLocalDateString(date),
    });

  }

  return days;

}


function getDayLetter(date) {

  return date
    .toLocaleDateString(
      'en-US',
      {
        weekday: 'short',
      }
    )
    .charAt(0);

}


function isToday(date) {

  return (
    getLocalDateString(date) ===
    getLocalDateString()
  );

}



export default function ProgressScreen() {
  const {colors}=useTheme()
  const styles= createStyles(colors)

  const {
    xp,
    completedLessons,
    streak,
    studyDates,
  } = useProgress();

const todayDate = getLocalDateString();

  const dateNumber =
    todayDate
      .split('-')
      .join('');
  
  const quoteIndex =
    Number(dateNumber) % quotes.length;

  const dailyQuote =
    quotes[quoteIndex];
  
  const safeCompletedLessons =
    completedLessons || [];

  const safeStudyDates =
    studyDates || [];

  const safeXP =
    xp || 0;

  const safeStreak =
    streak || 0;


  
  const lastSevenDays =
    getLastSevenDays();


  const studiedDays =
    lastSevenDays.filter(
      day =>
        safeStudyDates.includes(
          day.dateString
        )
    );


  const weeklyStudyCount =
    studiedDays.length;


  const weeklyPercentage =
    Math.round(
      (
        weeklyStudyCount /
        lastSevenDays.length
      ) * 100
    );


  const todayStudied =
    safeStudyDates.includes(
      getLocalDateString()
    );

        
  
  let motivationTitle =
    'Start your learning streak';

  let motivationText =
    'Complete a lesson today to start building your Spanish habit.';


  if (
    todayStudied &&
    safeStreak >= 7
  ) {

    motivationTitle =
      'Amazing consistency!';

    motivationText =
      `You have studied for ${safeStreak} days in a row. Keep the momentum going!`;

  }

  else if (
    todayStudied &&
    safeStreak > 1
  ) {

    motivationTitle =
      'Keep the streak alive!';

    motivationText =
      `You're on a ${safeStreak}-day streak. Come back tomorrow to continue it.`;

  }

  else if (todayStudied) {

    motivationTitle =
      'Great start!';

    motivationText =
      'You studied today. Come back tomorrow and keep building the habit.';

  }

  else if (safeStreak > 0) {

    motivationTitle =
      'Your streak is waiting';

    motivationText =
      'Complete a lesson today to keep your learning habit going.';

  }


  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

       
       
        <View style={styles.header}>

          <View>

            <Text style={styles.eyebrow}>
              YOUR JOURNEY
            </Text>

            <Text style={styles.title}>
              Progress
            </Text>

            <Text style={styles.subtitle}>
              Small steps every day lead to real progress.
            </Text>

          </View>

          <View style={styles.headerIcon}>

            <Text style={styles.headerIconText}>
              📊
            </Text>

          </View>

        </View>


        
        <View style={styles.streakCard}>

          <View style={styles.streakTopRow}>

            <View style={styles.streakFlame}>

              <Text style={styles.streakEmoji}>
                🔥
              </Text>

            </View>


            <View style={styles.streakBadge}>

              <Text style={styles.streakBadgeText}>
                {todayStudied
                  ? 'TODAY COMPLETE'
                  : 'KEEP GOING'}
              </Text>

            </View>

          </View>


          <View style={styles.streakMain}>

            <View>

              <Text style={styles.streakNumber}>
                {safeStreak}
              </Text>

              <Text style={styles.streakLabel}>
                day streak
              </Text>

            </View>


            <View style={styles.streakMessage}>

              <Text style={styles.streakMessageTitle}>

                {todayStudied
                  ? 'You showed up today ✓'
                  : 'Make today count'}

              </Text>


              <Text style={styles.streakMessageText}>

                {todayStudied
                  ? 'Come back tomorrow to keep your streak alive.'
                  : 'A short lesson is enough to keep your momentum.'}

              </Text>

            </View>

          </View>



          <View style={styles.streakFooter}>

            <View style={styles.streakFooterDot} />

            <Text style={styles.streakFooterText}>

              {safeStreak === 0
                ? 'Your first day starts today'
                : safeStreak === 1
                  ? 'You are building the habit'
                  : `${safeStreak} days of consistent learning`}

            </Text>

          </View>

        </View>


        
        <View style={styles.xpCard}>

          <View style={styles.xpIconContainer}>

            <Text style={styles.xpEmoji}>
              ⭐
            </Text>

          </View>


          <View style={styles.xpInfo}>

            <Text style={styles.xpNumber}>
              {safeXP}
            </Text>

            <Text style={styles.xpLabel}>
              Total XP
            </Text>

          </View>


          <View style={styles.xpRight}>

            <Text style={styles.xpRightTitle}>
              Keep earning
            </Text>

            <Text style={styles.xpRightText}>
              Complete lessons to earn more XP.
            </Text>

          </View>

        </View>
         
        <View style={styles.quoteCard}>

          <View style={styles.quoteHeader}>

            <View style={styles.quoteIconContainer}>

              <Text style={styles.quoteIcon}>
                ✨
              </Text>

            </View>

            <View>

              <Text style={styles.quoteEyebrow}>
                DAILY INSPIRATION
              </Text>

              <Text style={styles.quoteHeaderTitle}>
                A thought for today
              </Text>

            </View>

          </View>


          <Text style={styles.quoteMark}>
            “
          </Text>


          <Text style={styles.quoteText}>
            {dailyQuote?.quote}
          </Text>


          <View style={styles.quoteFooter}>

            <View style={styles.quoteLine} />

            <Text style={styles.quoteAuthor}>
              {dailyQuote?.author || 'Unknown'}
            </Text>

          </View>

        </View>



        
        <View style={styles.sectionHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              Your numbers
            </Text>

            <Text style={styles.sectionSubtitle}>
              Everything you've achieved so far
            </Text>

          </View>

        </View>


        <View style={styles.statsGrid}>



          <View style={styles.statCard}>

            <View
              style={[
                styles.statIconContainer,
                styles.statIconOrange,
              ]}
            >

              <Text style={styles.statEmoji}>
                📚
              </Text>

            </View>

            <Text style={styles.statNumber}>
              {safeCompletedLessons.length}
            </Text>

            <Text style={styles.statLabel}>
              Lessons completed
            </Text>

          </View>



          <View style={styles.statCard}>

            <View
              style={[
                styles.statIconContainer,
                styles.statIconYellow,
              ]}
            >

              <Text style={styles.statEmoji}>
                📅
              </Text>

            </View>

            <Text style={styles.statNumber}>
              {safeStudyDates.length}
            </Text>

            <Text style={styles.statLabel}>
              Study days
            </Text>

          </View>



          <View style={styles.statCard}>

            <View
              style={[
                styles.statIconContainer,
                styles.statIconRed,
              ]}
            >

              <Text style={styles.statEmoji}>
                🔥
              </Text>

            </View>

            <Text style={styles.statNumber}>
              {safeStreak}
            </Text>

            <Text style={styles.statLabel}>
              Current streak
            </Text>

          </View>
          


          <View style={styles.statCard}>

            <View
              style={[
                styles.statIconContainer,
                styles.statIconGreen,
              ]}
            >

              <Text style={styles.statEmoji}>
                ⭐
              </Text>

            </View>

            <Text style={styles.statNumber}>
              {safeXP}
            </Text>

            <Text style={styles.statLabel}>
              XP earned
            </Text>

          </View>

        </View>
       


        
        <View style={styles.sectionHeader}>

          <View>

            <Text style={styles.sectionTitle}>
              This week
            </Text>

            <Text style={styles.sectionSubtitle}>
              Your last 7 days of learning
            </Text>

          </View>


          <View style={styles.percentageBadge}>

            <Text style={styles.percentageText}>
              {weeklyPercentage}%
            </Text>

          </View>

        </View>


        <View style={styles.weekCard}>


          <View style={styles.weekSummary}>

            <View>

              <Text style={styles.weekSummaryTitle}>
                Weekly consistency
              </Text>

              <Text style={styles.weekSummaryText}>
                {weeklyStudyCount} of 7 days studied
              </Text>

            </View>


            <View style={styles.weekScore}>

              <Text style={styles.weekScoreNumber}>
                {weeklyStudyCount}
              </Text>

              <Text style={styles.weekScoreLabel}>
                days
              </Text>

            </View>

          </View>



          <View style={styles.weekProgressBackground}>

            <View
              style={[
                styles.weekProgressFill,
                {
                  width: `${weeklyPercentage}%`,
                },
              ]}
            />

          </View>



          <View style={styles.daysRow}>

            {lastSevenDays.map(
              day => {

                const studied =
                  safeStudyDates.includes(
                    day.dateString
                  );

                const today =
                  isToday(day.date);


                return (

                  <View
                    key={day.dateString}
                    style={styles.dayContainer}
                  >

                    <Text
                      style={[
                        styles.dayLetter,
                        today &&
                          styles.todayText,
                      ]}
                    >
                      {getDayLetter(
                        day.date
                      )}
                    </Text>


                    <View
                      style={[
                        styles.dayCircle,

                        studied &&
                          styles.dayStudied,

                        !studied &&
                          styles.dayMissed,

                        today &&
                          styles.dayToday,
                      ]}
                    >

                      <Text
                        style={[
                          styles.dayIcon,
                          studied &&
                            styles.dayIconStudied,
                        ]}
                      >
                        {studied
                          ? '✓'
                          : '·'}
                      </Text>

                    </View>


                    <Text
                      style={[
                        styles.dayNumber,
                        today &&
                          styles.todayText,
                      ]}
                    >
                      {day.date.getDate()}
                    </Text>

                  </View>

                );

              }
            )}

          </View>



          <View style={styles.legend}>

            <View style={styles.legendItem}>

              <View
                style={[
                  styles.legendDot,
                  styles.legendStudied,
                ]}
              />

              <Text style={styles.legendText}>
                Studied
              </Text>

            </View>


            <View style={styles.legendItem}>

              <View
                style={[
                  styles.legendDot,
                  styles.legendMissed,
                ]}
              />

              <Text style={styles.legendText}>
                Not studied
              </Text>

            </View>

          </View>

        </View>


        
        <View style={styles.insightCard}>

          <View style={styles.insightIconContainer}>

            <Text style={styles.insightEmoji}>
              📈
            </Text>

          </View>


          <View style={styles.insightContent}>

            <Text style={styles.insightTitle}>
              {weeklyStudyCount === 7
                ? 'Perfect week!'
                : weeklyStudyCount >= 5
                  ? 'Excellent consistency'
                  : weeklyStudyCount >= 3
                    ? 'Good progress'
                    : weeklyStudyCount > 0
                      ? 'You have started'
                      : 'Ready to begin?'}
            </Text>


            <Text style={styles.insightText}>

              {weeklyStudyCount === 7
                ? 'You studied every day this week. That is an excellent habit.'
                : weeklyStudyCount >= 5
                  ? 'You are building a strong learning routine. Keep going!'
                  : weeklyStudyCount >= 3
                    ? 'A little more consistency will make your progress even stronger.'
                    : weeklyStudyCount > 0
                      ? 'Keep showing up and turn those study days into a habit.'
                      : 'Complete a lesson today and start building your weekly progress.'}

            </Text>

          </View>

        </View>


       
        <View style={styles.motivationCard}>

          <View style={styles.motivationEmojiContainer}>

            <Text style={styles.motivationEmoji}>
              💪
            </Text>

          </View>


          <View style={styles.motivationContent}>

            <Text style={styles.motivationEyebrow}>
              KEEP MOVING
            </Text>

            <Text style={styles.motivationTitle}>
              {motivationTitle}
            </Text>

            <Text style={styles.motivationText}>
              {motivationText}
            </Text>

          </View>

        </View>


        
        <View style={styles.footer}>

          <Text style={styles.footerEmoji}>
            🇪🇸
          </Text>

          <Text style={styles.footerTitle}>
            Every day counts.
          </Text>

          <Text style={styles.footerText}>
            Keep learning Spanish, one step at a time.
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
    paddingBottom: 115,
  },

  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    color: colors.primary,
    marginBottom: 5,
  },

  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.7,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginTop: 5,
    maxWidth: 285,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },

  headerIconText: {
    fontSize: 23,
  },

  
  streakCard: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: 21,
    marginBottom: 13,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },

  streakTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  streakFlame: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  streakEmoji: {
    fontSize: 27,
  },

  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  streakBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.white,
  },

  streakMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 19,
  },

  streakNumber: {
    fontSize: 48,
    lineHeight: 51,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -1.5,
  },

  streakLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.heroTextSecondary,
    marginTop: 1,
  },

  streakMessage: {
    flex: 1,
    marginLeft: 22,
    paddingLeft: 18,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.2)',
  },

  streakMessageTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.white,
  },

  streakMessageText: {
    fontSize: 11,
    lineHeight: 17,
    color: colors.heroTextSecondary,
    marginTop: 4,
  },

  streakFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 19,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.13)',
  },

  streakFooterDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.yellow,
    marginRight: 8,
  },

  streakFooterText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.heroTextSecondary,
  },

  
  xpCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 29,
  },

  xpIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  xpEmoji: {
    fontSize: 24,
  },

  xpInfo: {
    minWidth: 75,
  },

  xpNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 27,
  },

  xpLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 2,
  },

  xpRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 12,
  },

  xpRightTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.text,
  },

  xpRightText: {
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 3,
    maxWidth: 150,
  },

  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.2,
  },

  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },

  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 29,
  },

  statCard: {
    width: '48.5%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },

  statIconContainer: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIconOrange: {
    backgroundColor: colors.redSoft,
  },

  statIconYellow: {
    backgroundColor: colors.yellowSoft,
  },

  statIconRed: {
    backgroundColor: colors.redSoft,
  },

  statIconGreen: {
    backgroundColor: colors.greenSoft,
  },

  statEmoji: {
    fontSize: 19,
  },

  statNumber: {
    fontSize: 25,
    fontWeight: '900',
    color: colors.text,
    marginTop: 11,
    letterSpacing: -0.5,
  },

  statLabel: {
    fontSize: 10.5,
    lineHeight: 15,
    color: colors.textSecondary,
    marginTop: 2,
  },

  
  percentageBadge: {
    backgroundColor: colors.redSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  percentageText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.primary,
  },

  
  weekCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
  },

  weekSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  weekSummaryTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },

  weekSummaryText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },

  weekScore: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.yellowSoft,
  },

  weekScoreNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 18,
  },

  weekScoreLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  weekProgressBackground: {
    height: 7,
    backgroundColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 18,
  },

  weekProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 21,
  },

  dayContainer: {
    alignItems: 'center',
  },

  dayLetter: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: 7,
  },

  todayText: {
    color: colors.primary,
  },

  dayCircle: {
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  dayStudied: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  dayMissed: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },

  dayToday: {
    borderWidth: 2,
  },

  dayIcon: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.textLight,
  },

  dayIconStudied: {
    color: colors.white,
  },

  dayNumber: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 6,
  },

  
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 19,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  legendStudied: {
    backgroundColor: colors.primary,
  },

  legendMissed: {
    backgroundColor: colors.border,
  },

  legendText: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  
  insightCard: {
    backgroundColor: colors.card,
    borderRadius: 21,
    padding: 17,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },

  insightIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  insightEmoji: {
    fontSize: 22,
  },

  insightContent: {
    flex: 1,
  },

  insightTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },

  insightText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.textSecondary,
    marginTop: 4,
  },

  
  motivationCard: {
    backgroundColor: colors.yellowSoft,
    borderRadius: 23,
    padding: 18,
    flexDirection: 'row',
    marginBottom: 25,
  },

  motivationEmojiContainer: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  motivationEmoji: {
    fontSize: 24,
  },

  motivationContent: {
    flex: 1,
  },

  motivationEyebrow: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: colors.primary,
    marginBottom: 3,
  },

  motivationTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },

  motivationText: {
    fontSize: 11.5,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 4,
  },

  
  footer: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 15,
  },

  footerEmoji: {
    fontSize: 24,
    marginBottom: 7,
  },

  footerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.text,
  },

  footerText: {
    fontSize: 10.5,
    color: colors.textLight,
    marginTop: 3,
  },

  
  quoteCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quoteIconContainer: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  quoteIcon: {
    fontSize: 21,
  },

  quoteEyebrow: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: colors.primary,
  },

  quoteHeaderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
    marginTop: 3,
  },

  quoteMark: {
    fontSize: 48,
    lineHeight: 45,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 13,
    marginBottom: -4,
  },

  quoteText: {
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.1,
  },

  quoteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
  },

  quoteLine: {
    width: 24,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginRight: 8,
  },

  quoteAuthor: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
  },
});