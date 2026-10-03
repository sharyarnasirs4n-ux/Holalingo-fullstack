import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';

import {
  getFavorites,
  deleteFavorite,
} from '../services/api';

import { useTheme } from '../Context/ThemeContext';

import { useFocusEffect } from '@react-navigation/native';


export default function FavoriteWordsScreen({ navigation }) {

  const { colors } = useTheme();

  const styles = createStyles(colors);

  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);


  
  const loadFavorites = useCallback(async () => {

    try {

      setLoading(true);

      const savedFavorites =
        await getFavorites();

      setFavorites(savedFavorites);

    } catch (error) {

      console.log(
        'FAVORITES SCREEN LOAD ERROR:',
        error
      );

      Alert.alert(
        'Error',
        'Unable to load your favorite words.'
      );

    } finally {

      setLoading(false);

    }

  }, []);


  
  useFocusEffect(
    useCallback(() => {

      loadFavorites();

    }, [loadFavorites])
  );


  
  function speakWord(word) {

    Speech.stop();

    Speech.speak(word, {
      language: 'es-ES',
      rate: 0.65,
    });

  }


  
  function handleDelete(favorite) {

    Alert.alert(
      'Remove favorite?',
      `Remove "${favorite.word}" from your favorite words?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Remove',
          style: 'destructive',

          onPress: async () => {

            try {

              setDeletingId(favorite.id);

              await deleteFavorite(
                favorite.id
              );

              setFavorites(
                previous =>
                  previous.filter(
                    item =>
                      item.id !== favorite.id
                  )
              );

            } catch (error) {

              console.log(
                'DELETE FAVORITE ERROR:',
                error
              );

              Alert.alert(
                'Error',
                'Unable to remove this word.'
              );

            } finally {

              setDeletingId(null);

            }

          },
        },
      ]
    );

  }


  
  if (loading) {

    return (

      <SafeAreaView
        style={styles.container}
        edges={['top']}
      >

        <View style={styles.loadingContainer}>

          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading your favorite words...
          </Text>

        </View>

      </SafeAreaView>

    );

  }


  
  return (

    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >

      
      <View style={styles.header}>

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => navigation.goBack()}
        >

          <Text style={styles.backText}>
            ‹
          </Text>

        </Pressable>


        <View style={styles.headerCenter}>

          <Text style={styles.headerEyebrow}>
            HOLA LINGO
          </Text>

          <Text style={styles.headerTitle}>
            Favorite Words
          </Text>

        </View>


        <View style={styles.countBadge}>

          <Text style={styles.countNumber}>
            {favorites.length}
          </Text>

        </View>

      </View>


      
      {favorites.length === 0 ? (

        <View style={styles.emptyContainer}>

          <View style={styles.emptyIconCircle}>

            <Text style={styles.emptyIcon}>
              ☆
            </Text>

          </View>


          <Text style={styles.emptyTitle}>
            No favorite words yet
          </Text>


          <Text style={styles.emptyText}>
            When you find a Spanish word you want
            to remember, tap the ☆ button during
            a lesson to save it here.
          </Text>


          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.startButtonPressed,
            ]}
            onPress={() => navigation.navigate('Home')}
          >

            <Text style={styles.startButtonText}>
              Start Learning
            </Text>

            <Text style={styles.startButtonArrow}>
              →
            </Text>

          </Pressable>

        </View>

      ) : (

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >

          
          <View style={styles.introCard}>

            <View style={styles.introIcon}>

              <Text>
                ⭐
              </Text>

            </View>

            <View style={styles.introContent}>

              <Text style={styles.introTitle}>
                Your saved vocabulary
              </Text>

              <Text style={styles.introText}>
                Review the words you've saved while
                learning Spanish.
              </Text>

            </View>

          </View>


          
          <Text style={styles.sectionTitle}>
            {favorites.length === 1
              ? '1 saved word'
              : `${favorites.length} saved words`}
          </Text>


          
          {favorites.map((favorite) => (

            <View
              key={favorite.id}
              style={styles.wordCard}
            >


              <View style={styles.wordTopRow}>

                <View style={styles.wordInfo}>

                  <Text style={styles.spanishWord}>
                    {favorite.word}
                  </Text>

                  <Text style={styles.translation}>
                    {favorite.translation}
                  </Text>

                </View>


                <View style={styles.actions}>


                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      pressed &&
                        styles.actionButtonPressed,
                    ]}
                    onPress={() =>
                      speakWord(
                        favorite.word
                      )
                    }
                  >

                    <Text style={styles.actionIcon}>
                      🔊
                    </Text>

                  </Pressable>



                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.deleteButton,
                      pressed &&
                        styles.deleteButtonPressed,
                    ]}
                    onPress={() =>
                      handleDelete(favorite)
                    }
                    disabled={
                      deletingId === favorite.id
                    }
                  >

                    {deletingId === favorite.id ? (

                      <ActivityIndicator
                        size="small"
                        color={colors.danger}
                      />

                    ) : (

                      <Text
                        style={styles.actionIcon}
                      >
                        🗑️
                      </Text>

                    )}

                  </Pressable>

                </View>

              </View>



              {favorite.level && (

                <View style={styles.levelBadge}>

                  <Text style={styles.levelText}>
                    {favorite.level}
                  </Text>

                </View>

              )}



              {favorite.example_1 && (

                <View style={styles.exampleBox}>

                  <Text style={styles.exampleLabel}>
                    Example
                  </Text>

                  <Text style={styles.exampleSpanish}>
                    {favorite.example_1}
                  </Text>

                  {favorite.example_translation_1 && (

                    <Text style={styles.exampleEnglish}>
                      {favorite.example_translation_1}
                    </Text>

                  )}

                </View>

              )}


              {favorite.example_2 && (

                <View style={styles.secondExample}>

                  <Text style={styles.exampleSpanish}>
                    {favorite.example_2}
                  </Text>

                  {favorite.example_translation_2 && (

                    <Text style={styles.exampleEnglish}>
                      {favorite.example_translation_2}
                    </Text>

                  )}

                </View>

              )}

            </View>

          ))}


          <View style={styles.bottomMessage}>

            <Text style={styles.bottomEmoji}>
              📚
            </Text>

            <Text style={styles.bottomText}>
              Keep practicing these words to make
              them part of your Spanish vocabulary.
            </Text>

          </View>

        </ScrollView>

      )}

    </SafeAreaView>

  );

}



const createStyles = (colors) =>
  StyleSheet.create({

    
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },


    content: {
      paddingHorizontal: 22,
      paddingTop: 8,
      paddingBottom: 110,
    },


    
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },


    backButton: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },


    backButtonPressed: {
      backgroundColor: colors.pressed,
      transform: [
        {
          scale: 0.95,
        },
      ],
    },


    backText: {
      fontSize: 32,
      lineHeight: 34,
      color: colors.text,
      marginTop: -3,
    },


    headerCenter: {
      flex: 1,
      marginLeft: 13,
    },


    headerEyebrow: {
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1.5,
      color: colors.primary,
    },


    headerTitle: {
      fontSize: 20,
      fontWeight: '900',
      color: colors.text,
      marginTop: 2,
    },


    countBadge: {
      minWidth: 38,
      height: 38,
      paddingHorizontal: 9,
      borderRadius: 13,
      backgroundColor: colors.yellowSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },


    countNumber: {
      fontSize: 14,
      fontWeight: '900',
      color: colors.text,
    },


    
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
    },


    loadingText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 12,
    },


    
    introCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      padding: 15,
      marginBottom: 22,
    },


    introIcon: {
      width: 45,
      height: 45,
      borderRadius: 14,
      backgroundColor: colors.yellowSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },


    introContent: {
      flex: 1,
      marginLeft: 12,
    },


    introTitle: {
      fontSize: 14,
      fontWeight: '900',
      color: colors.text,
    },


    introText: {
      fontSize: 11,
      lineHeight: 17,
      color: colors.textSecondary,
      marginTop: 3,
    },


    
    sectionTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.text,
      marginBottom: 12,
    },


    
    wordCard: {
      backgroundColor: colors.card,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 12,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.025,
      shadowRadius: 6,
      elevation: 1,
    },


    wordTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },


    wordInfo: {
      flex: 1,
      paddingRight: 10,
    },


    spanishWord: {
      fontSize: 23,
      fontWeight: '900',
      color: colors.text,
    },


    translation: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 3,
    },


    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },


    actionButton: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: colors.blueSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },


    actionButtonPressed: {
      opacity: 0.7,
      transform: [
        {
          scale: 0.94,
        },
      ],
    },


    deleteButton: {
      backgroundColor: colors.redSoft,
    },


    deleteButtonPressed: {
      backgroundColor: colors.dangerPressed,
    },


    actionIcon: {
      fontSize: 17,
    },


    
    levelBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surfaceSoft,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 5,
      marginTop: 12,
    },


    levelText: {
      fontSize: 9,
      fontWeight: '900',
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },


    
    exampleBox: {
      backgroundColor: colors.infoBackground,
      borderWidth: 1,
      borderColor: colors.infoBorder,
      borderRadius: 15,
      padding: 12,
      marginTop: 13,
    },


    exampleLabel: {
      fontSize: 9,
      fontWeight: '900',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.7,
      marginBottom: 6,
    },


    exampleSpanish: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '700',
      color: colors.text,
    },


    exampleEnglish: {
      fontSize: 11,
      lineHeight: 17,
      color: colors.textSecondary,
      marginTop: 4,
    },


    secondExample: {
      backgroundColor: colors.surfaceSoft,
      borderRadius: 15,
      padding: 12,
      marginTop: 8,
    },


    
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 35,
      paddingBottom: 80,
    },


    emptyIconCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: colors.yellowSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },


    emptyIcon: {
      fontSize: 42,
      color: colors.primary,
    },


    emptyTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: colors.text,
      textAlign: 'center',
    },


    emptyText: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 9,
    },


    startButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 15,
      paddingHorizontal: 20,
      paddingVertical: 13,
      marginTop: 22,
    },


    startButtonPressed: {
      backgroundColor: colors.primaryDark,
      transform: [
        {
          scale: 0.97,
        },
      ],
    },


    startButtonText: {
      fontSize: 13,
      fontWeight: '900',
      color: colors.white,
    },


    startButtonArrow: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.white,
      marginLeft: 9,
    },


   
    bottomMessage: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceSoft,
      borderRadius: 16,
      padding: 13,
      marginTop: 5,
    },


    bottomEmoji: {
      fontSize: 18,
      marginRight: 10,
    },


    bottomText: {
      flex: 1,
      fontSize: 10,
      lineHeight: 16,
      color: colors.textSecondary,
    },

  });