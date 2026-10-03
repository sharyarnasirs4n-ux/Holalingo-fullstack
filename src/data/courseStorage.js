import AsyncStorage from '@react-native-async-storage/async-storage';

const COURSE_KEY = 'holalingo_courses';



export const saveCourse=async(level, course)=> {

  try {

    const existing =
      await AsyncStorage.getItem(COURSE_KEY);

    const courses =
      existing
        ? JSON.parse(existing)
        : {};

    courses[level] = course;

    await AsyncStorage.setItem(
      COURSE_KEY,
      JSON.stringify(courses)
    );

    console.log(
      `Saved ${level} course`
    );

  } catch (error) {

    console.error(
      'Failed to save course:',
      error
    );

  }
}



export const loadCourse=async(level)=> {

  try {

    const existing =
      await AsyncStorage.getItem(COURSE_KEY);

    if (!existing) {
      return null;
    }

    const courses =
      JSON.parse(existing);

    return courses[level] || null;

  } catch (error) {

    console.error(
      'Failed to load course:',
      error
    );

    return null;
  }
}



export async function deleteCourse(level) {

  try {

    const existing =
      await AsyncStorage.getItem(COURSE_KEY);

    if (!existing) {
      return;
    }

    const courses =
      JSON.parse(existing);

    delete courses[level];

    await AsyncStorage.setItem(
      COURSE_KEY,
      JSON.stringify(courses)
    );

    console.log(
      `Deleted ${level} course`
    );

  } catch (error) {

    console.error(
      'Failed to delete course:',
      error
    );

  }
}