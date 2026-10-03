
import { useEffect, useState } from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import RegisterScreen from './src/screens/RegisterScreen';
import AccountInformationScreen from './src/screens/AccountInformationScreen';
import LearningLanguageScreen from './src/screens/LearningLanguageScreen';
import PracticeNavigator from './src/navigation/PracticeNavigator';
import LearnNavigator from './src/navigation/LearnNavigator';
import EditProfileScreen from './src/screens/EditProfileScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LevelScreen from './src/screens/LevelScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';
import SettingsScreen from './src/screens/SettingScreen';
import NotificationsScreen from './src/screens/NotificationScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import DailyChallengeScreen from './src/screens/DailyChallengeScreen';
import FavoriteWordsScreen from './src/screens/FavoriteWordsScreen';
import {
  ThemeProvider,
  useTheme,
} from './src/Context/ThemeContext';

import {
  ProgressProvider,
  useProgress,
} from './src/Context/ProgressContext';

import {
  getToken,
  removeToken,
} from './src/services/authStorage';

import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



function MainTabs({
  route,
  onLogout,
  isLoggedIn,
}) {

  const { colors } = useTheme();
  const { user } = useProgress();

 
  const selectedLevel =
    isLoggedIn
      ? user?.level || 'A0'
      : route?.params?.level || 'A0';


  return (
    <Tab.Navigator

      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,

        tabBarStyle: {
          height: 75,
          paddingBottom: 8,
          paddingTop: 8,

          backgroundColor: colors.card,

          borderTopWidth: 1,
          borderTopColor: colors.border,

          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 5,

          shadowOffset: {
            width: 0,
            height: -2,
          },

          elevation: 8,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}

    >


      <Tab.Screen
        name="Home"
        component={HomeScreen}

        initialParams={{
          level: selectedLevel,
        }}

        options={{
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />



      <Tab.Screen
        name="Learn"

        children={() => (
          <LearnNavigator
            level={selectedLevel}
          />
        )}
      />



      <Tab.Screen
        name="Practice"

        children={() => (
          <PracticeNavigator
            level={selectedLevel}
          />
        )}

        options={{
          tabBarIcon: () => <Text>🧠</Text>,
        }}
      />



      <Tab.Screen
        name="Progress"
        component={ProgressScreen}

        options={{
          tabBarIcon: () => <Text>📊</Text>,
        }}
      />



      <Tab.Screen
        name="Profile"

        children={(props) => (
          <ProfileScreen
            {...props}
            onLogout={onLogout}
            isLoggedIn={isLoggedIn}
          />
        )}

        options={{
          tabBarIcon: () => <Text>👤</Text>,
        }}
      />

    </Tab.Navigator>
  );
}



function AppContent() {

  const { colors } = useTheme();

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);


  
  useEffect(() => {

    const checkLogin=async()=> {

      try {

        const token = await getToken();


        if (token) {

          console.log(
            'EXISTING ACCESS TOKEN FOUND'
          );

          setIsLoggedIn(true);

        } else {

          console.log(
            'NO ACCESS TOKEN - GUEST MODE'
          );

          setIsLoggedIn(false);

        }

      } catch (error) {

        console.log(
          'AUTH CHECK ERROR:',
          error
        );

        
        setIsLoggedIn(false);

      } finally {

        setIsLoading(false);

      }
    }


    checkLogin();

  }, []);


  
  function handleLogin() {

    console.log(
      'APP: LOGIN STATE CHANGED'
    );

    setIsLoggedIn(true);

  }
  function handleAccountDeleted() {
  console.log('APP: ACCOUNT DELETED');
  setIsLoggedIn(false);
}


  

  async function handleLogout() {

    try {

      await removeToken();

      console.log(
        'APP: LOGGED OUT'
      );

      setIsLoggedIn(false);

    } catch (error) {

      console.log(
        'APP: LOGOUT ERROR:',
        error
      );

      throw error;

    }
  }


  

  if (isLoading) {

    return (
      <View
        style={{
          flex: 1,

          justifyContent: 'center',

          alignItems: 'center',

          backgroundColor:
            colors.white,
        }}
      >

        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

      </View>
    );

  }


  
  return (

    <ProgressProvider
      key={
        isLoggedIn
          ? 'authenticated'
          : 'guest'
      }
    >

      <NavigationContainer>

        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >

         
          {isLoggedIn ? (

            <>

              <Stack.Screen
                name="Main"
              >

                {(props) => (
                  <MainTabs
                    {...props}
                    onLogout={handleLogout}
                    isLoggedIn={isLoggedIn}
                  />
                )}

              </Stack.Screen>


              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
              />


              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
              />


              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
              />


              <Stack.Screen
                name="LearningLanguage"
                component={LearningLanguageScreen}
              />


              <Stack.Screen name="AccountInformation">
  {(props) => (
    <AccountInformationScreen
      {...props}
      onAccountDeleted={handleAccountDeleted}
    />
  )}
</Stack.Screen>


              <Stack.Screen
                name="Achievements"
                component={AchievementsScreen}
              />


              <Stack.Screen
                name="DailyChallenge"
                component={DailyChallengeScreen}
              />
              <Stack.Screen
  name="FavoriteWords"
  component={FavoriteWordsScreen}
/>

            </>

          ) : (

           
            <>

              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
              />


              <Stack.Screen
                name="Auth"
              >

                {(props) => (
                  <AuthScreen
                    {...props}
                    onLogin={handleLogin}
                  />
                )}

              </Stack.Screen>
              <Stack.Screen
  name="Register"
>
  {(props) => (
    <RegisterScreen
      {...props}
      onLogin={handleLogin}
    />
  )}
</Stack.Screen>


              <Stack.Screen
                name="Level"
                component={LevelScreen}
              />


              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
              />


              

              <Stack.Screen
                name="Main"
              >

                {(props) => (
                  <MainTabs
                    {...props}
                    onLogout={handleLogout}
                    isLoggedIn={isLoggedIn}
                  />
                )}

              </Stack.Screen>

            </>

          )}

        </Stack.Navigator>

      </NavigationContainer>

    </ProgressProvider>
  );
}




export default function App() {

  return (

    <ThemeProvider>

      <AppContent />

    </ThemeProvider>

  );
}

