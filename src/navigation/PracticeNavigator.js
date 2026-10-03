import { View, Text } from 'react-native'
import React from 'react'
import PracticeScreen from '../screens/PracticeScreen'
import VocabularyPracticeScreen from '../screens/VocabularyPracticeScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import QuizScreen from '../screens/QuizScreen'



const Stack=createNativeStackNavigator()



const PracticeNavigator = ({level="A0"}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen
        name='PracticeHome'
        component={PracticeScreen}
        initialParams={{level,}}
        />
        <Stack.Screen name='VocabularyPractice' component={VocabularyPracticeScreen}/>
        <Stack.Screen  name='QuizPractice' component={QuizScreen}  />

    </Stack.Navigator>
  )
}

export default PracticeNavigator