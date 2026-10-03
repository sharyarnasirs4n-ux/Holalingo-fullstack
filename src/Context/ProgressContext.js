import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../services/api';
import { getToken } from '../services/authStorage';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'spanish_progress';

const API_URL = 'https://holalingo-backend.onrender.com';

export function ProgressProvider({ children }) {

  
 const [user,setUser]=useState(null)
  const [xp, setXp] = useState(0);

  const [completedLessons, setCompletedLessons] =
    useState([]);

  const [streak, setStreak] =
    useState(0);

  const [studyDates, setStudyDates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);


  

  useEffect(() => {

    loadProgress();

  }, []);


  const loadProgress=async()=> {

    try {

      

      const currentUser = await getCurrentUser();


      if (currentUser) {

  console.log(
    'LOGGED IN USER:',
    currentUser
  );

  setUser(currentUser);
  setIsLoggedIn(true);

        

        const token =
          await getToken();


        if (!token) {
          throw new Error('No access token');
        }


        const response =
          await fetch(
            `${API_URL}/progress`,
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        if (!response.ok) {

          throw new Error(
            'Failed to load backend progress'
          );

        }


        const data =
          await response.json();


        console.log(
          'BACKEND PROGRESS:',
          data
        );


        setXp(
          data.xp ?? 0
        );


        setStreak(
          data.streak ?? 0
        );


        
const lessonsResponse =
  await fetch(
    `${API_URL}/progress/lessons`,
    {
      method: 'GET',

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );


if (!lessonsResponse.ok) {

  throw new Error(
    'Failed to load completed lessons'
  );

}


const lessonsData =
  await lessonsResponse.json();


console.log(
  'BACKEND COMPLETED LESSONS:',
  lessonsData
);


setCompletedLessons(
  lessonsData.completed_lessons ?? []
);



const studyDatesResponse =
  await fetch(
    `${API_URL}/progress/study-dates`,
    {
      method: 'GET',

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );


if (!studyDatesResponse.ok) {

  throw new Error(
    'Failed to load study dates'
  );

}


const studyDatesData =
  await studyDatesResponse.json();


console.log(
  'BACKEND STUDY DATES:',
  studyDatesData
);


setStudyDates(
  studyDatesData.study_dates ?? []
);


      } else {

       
        console.log(
          'GUEST USER - LOADING LOCAL PROGRESS'
        );


        setIsLoggedIn(false);
        setUser(null)


        const savedProgress =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );


        if (savedProgress) {

          const data =
            JSON.parse(
              savedProgress
            );


          setXp(
            data.xp ?? 0
          );


          setCompletedLessons(
            data.completedLessons ?? []
          );


          setStreak(
            data.streak ?? 0
          );


          setStudyDates(
            data.studyDates ?? []
          );

        }

      }

    } catch (error) {

      console.log(
        'ERROR LOADING PROGRESS:',
        error
      );

    } finally {

      setLoading(false);

    }

  }


  
  useEffect(() => {

    if (
      !loading &&
      !isLoggedIn
    ) {

      saveGuestProgress();

    }

  }, [
    xp,
    completedLessons,
    streak,
    studyDates,
    loading,
    isLoggedIn,
  ]);


  async function saveGuestProgress() {

    try {

      const data = {

        xp,

        completedLessons,

        streak,

        studyDates,

      };


      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

    } catch (error) {

      console.log(
        'Error saving guest progress:',
        error
      );

    }

  }


  

  function getToday() {

    const today =
      new Date();

    return today
      .toISOString()
      .split('T')[0];

  }


  

  function calculateStreak(
    dates
  ) {

    if (!dates.length) {
      return 0;
    }


    const sortedDates =
      [...dates].sort(
        (a, b) =>
          new Date(b) -
          new Date(a)
      );


    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );


    const latestDate =
      new Date(
        sortedDates[0]
      );

    latestDate.setHours(
      0,
      0,
      0,
      0
    );


    const difference =
      Math.floor(
        (
          today -
          latestDate
        ) /
        (
          1000 *
          60 *
          60 *
          24
        )
      );


    if (difference > 1) {

      return 0;

    }


    let currentStreak = 0;


    let checkDate =
      new Date(
        latestDate
      );


    for (const date of sortedDates) {

      const current =
        new Date(date);

      current.setHours(
        0,
        0,
        0,
        0
      );


      const differenceFromExpected =
        Math.floor(
          (
            checkDate -
            current
          ) /
          (
            1000 *
            60 *
            60 *
            24
          )
        );


      if (
        differenceFromExpected === 0
      ) {

        currentStreak++;

        checkDate.setDate(
          checkDate.getDate() - 1
        );

      } else {

        break;

      }

    }


    return currentStreak;

  }


 

async function completeLesson(
  lessonId,
  lessonXP,
  learnedWords = []
) {

  

  if (isLoggedIn) {

    try {

      const token =
        await getToken();


      if (!token) {

        throw new Error(
          'No access token'
        );

      }


      const response =
        await fetch(
          `${API_URL}/progress/lesson?lesson_id=${encodeURIComponent(
            lessonId
          )}&xp_earned=${lessonXP}`,
          {
            method: 'POST',

            headers: {
              Authorization:
                `Bearer ${token}`,

              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify(
                learnedWords
              ),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          'Failed to complete lesson'
        );

      }


      console.log(
        'BACKEND LESSON COMPLETION:',
        data
      );


      
      setXp(
        data.xp ?? 0
      );


      setStreak(
        data.streak ?? 0
      );


      setCompletedLessons(
        previous => {

          if (
            previous.includes(
              lessonId
            )
          ) {

            return previous;

          }


          return [
            ...previous,
            lessonId,
          ];

        }
      );


      return data.new_achievements ?? [];


    } catch (error) {

      console.log(
        'BACKEND LESSON ERROR:',
        error
      );

      return [];

    }

  }


  
  if (
    completedLessons.includes(
      lessonId
    )
  ) {

    return [];

  }


  setCompletedLessons(
    previous => [
      ...previous,
      lessonId,
    ]
  );


  setXp(
    previous =>
      previous + lessonXP
  );


  const today =
    getToday();


  setStudyDates(
    previousDates => {

      if (
        previousDates.includes(
          today
        )
      ) {

        return previousDates;

      }


      const updatedDates = [
        ...previousDates,
        today,
      ];


      const newStreak =
        calculateStreak(
          updatedDates
        );


      setStreak(
        newStreak
      );


      return updatedDates;

    }
  );


  return [];

}

function updateUser(updatedUser) {
  setUser(updatedUser);
}

function updateXp(newXp) {
  setXp(newXp);
}

  

  




  const value = {
  user,
  xp,
  completedLessons,
  streak,
  studyDates,
  completeLesson,
  updateUser,
  updateXp,
  loading,
  isLoggedIn,
};
  
  return (

    <ProgressContext.Provider
      value={value}
    >

      {children}

    </ProgressContext.Provider>

  );

}



export function useProgress() {

  return useContext(
    ProgressContext
  );

}