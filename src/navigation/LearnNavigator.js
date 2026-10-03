import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LearnScreen from '../screens/LearnScreen';
import UnitScreen from '../screens/UnitScreen';
import LessonScreen from '../screens/LessonScreen';

const Stack = createNativeStackNavigator();

export default function LearnNavigator({
  level = 'A0',
}) {  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen
  name="LearnHome"
  component={LearnScreen}
  initialParams={{
    level,
  }}
/>

      <Stack.Screen
        name="Unit"
        component={UnitScreen}
      />

      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
      />

    </Stack.Navigator>
  );
}