import vocabulary from './spanish_vocabulary.json';



const WORDS_PER_LESSON = 5;
const LESSONS_PER_UNIT = 5;



const getWordsForLevel=(level)=> {

  return vocabulary.filter(
    word =>
      word.level === level &&
      word.word &&
      word.translation
  );

}



function seededRandom(seed) {

  let value = seed;

  return function () {

    value =
      (value * 9301 + 49297) % 233280;

    return value / 233280;

  };

}



const getLevelSeed=(level)=> {

  let seed = 0;

  for (let i = 0; i < level.length; i++) {

    seed =
      seed * 31 +
      level.charCodeAt(i);

  }

  return Math.abs(seed);

}



const shuffle=(array, seed)=> {

  const result = [...array];

  const random = seededRandom(seed);

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        random() * (i + 1)
      );

    [
      result[i],
      result[j]
    ] = [
      result[j],
      result[i]
    ];

  }

  return result;

}



const getWrongAnswers=(
  currentWord,
  words
)=> {

  const possibleAnswers =
    words
      .filter(word =>
        word.word !== currentWord.word &&
        word.translation
      )
      .map(word =>
        word.translation
      );

  const uniqueAnswers =
    [...new Set(possibleAnswers)];

  return shuffle(
    uniqueAnswers,
    currentWord.word.length +
    currentWord.word.charCodeAt(0)
  ).slice(0, 3);

}



const createLearnStep=(word)=> {

  return {

    type: 'learn',

    spanish:
      word.word,

    english:
      word.translation,

    pronunciation:
      '',

    pronunciationTip:
      '',

    example:
      word.example_1 || '',

    exampleTranslation:
      word.example_translation_1 || '',

    word:
      word.word,

    level:
      word.level,

  };

}



const createQuizStep=(
  word,
  words
)=> {

  const wrongAnswers =
    getWrongAnswers(
      word,
      words
    );

  const options =
    shuffle(
      [
        word.translation,
        ...wrongAnswers,
      ],
      word.word.length + 10
    );

  return {

    type: 'quiz',

    question:
      `What does "${word.word}" mean?`,

    options,

    answer:
      word.translation,

    spanish:
      word.word,

  };

}



const createSentenceStep=(
  word,
  words
)=> {

  if (
    !word.example_1 ||
    !word.example_translation_1
  ) {

    return null;

  }


  
  const correctAnswer =
    word.example_translation_1;


  

  const sentenceTranslations =
    words
      .filter(otherWord =>
        otherWord.word !== word.word &&
        otherWord.example_translation_1
      )
      .map(otherWord =>
        otherWord.example_translation_1
      );


  const uniqueAnswers =
    [...new Set(sentenceTranslations)];


  const wrongAnswers =
    shuffle(
      uniqueAnswers,
      word.word.length + 20
    ).slice(0, 3);


  const options =
    shuffle(
      [
        correctAnswer,
        ...wrongAnswers,
      ],
      word.word.length + 40
    );


  return {

    type: 'sentence',

    question:
      'What does this sentence mean?',

    spanish:
      word.example_1,

    options,

    answer:
      correctAnswer,

    exampleTranslation:
      word.example_translation_1,

    word:
      word.word,

  };

}



const createListenStep=(
  word,
  words
)=> {

  const wrongAnswers =
    getWrongAnswers(
      word,
      words
    );


  const options =
    shuffle(
      [
        word.translation,
        ...wrongAnswers,
      ],
      word.word.length + 30
    );


  return {

    type: 'listen',

    question:
      'Listen and choose the meaning.',

    spanish:
      word.word,

    options,

    answer:
      word.translation,

  };

}



const createPracticeStep=(
  word,
  words,
  index
)=> {

  

  if (index % 3 === 2) {

    return createListenStep(
      word,
      words
    );

  }


  

  if (
    index % 2 === 1 &&
    word.example_1 &&
    word.example_translation_1
  ) {

    return createSentenceStep(
      word,
      words
    );

  }


  
  return createQuizStep(
    word,
    words
  );

}



const createLesson=(
  words,
  level,
  lessonNumber,
  unitNumber
)=> {

  const steps = [];

  const levelWords =
    getWordsForLevel(level);


  words.forEach(
    (word, index) => {

      

      steps.push(
        createLearnStep(word)
      );


      

      const practiceStep =
        createPracticeStep(
          word,
          levelWords,
          index
        );


      if (practiceStep) {

        steps.push(
          practiceStep
        );

      }

    }
  );


  return {

    id:
      `${level}-unit-${unitNumber}-lesson-${lessonNumber}`,

    title:
      `Lesson ${lessonNumber}`,

    description:
      `Learn ${words.length} new Spanish words.`,

    duration:
      `${words.length * 2} min`,

    xp:
      words.length * 5,

    level,

    unitNumber,

    lessonNumber,

    steps,

  };

}



const createUnit=(
  words,
  level,
  unitNumber
)=> {

  const lessons = [];


  for (
    let i = 0;
    i < LESSONS_PER_UNIT;
    i++
  ) {

    const start =
      i * WORDS_PER_LESSON;


    const lessonWords =
      words.slice(
        start,
        start + WORDS_PER_LESSON
      );


    if (
      lessonWords.length === 0
    ) {

      break;

    }


    lessons.push(
      createLesson(
        lessonWords,
        level,
        i + 1,
        unitNumber
      )
    );

  }


  return {

    id:
      `${level}-unit-${unitNumber}`,

    title:
      `${level} Spanish — Unit ${unitNumber}`,

    description:
      `Build your ${level} Spanish vocabulary.`,

    emoji:
      '📚',

    level,

    unitNumber,

    lessons,

  };

}



export function generateCourse(
  level = 'A0'
) {

  console.log(
    `Generating ${level} course`
  );


  const levelWords =
    getWordsForLevel(level);


  console.log(
    `Available ${level} words:`,
    levelWords.length
  );


  if (
    levelWords.length === 0
  ) {

    console.warn(
      `No vocabulary found for level ${level}`
    );

    return [];

  }


  

  const seed =
    getLevelSeed(level);


  const shuffledWords =
    shuffle(
      levelWords,
      seed
    );


  const wordsPerUnit =
    WORDS_PER_LESSON *
    LESSONS_PER_UNIT;


  const numberOfUnits =
    Math.ceil(
      shuffledWords.length /
      wordsPerUnit
    );


  const units = [];


  for (
    let i = 0;
    i < numberOfUnits;
    i++
  ) {

    const start =
      i * wordsPerUnit;


    const unitWords =
      shuffledWords.slice(
        start,
        start + wordsPerUnit
      );


    units.push(
      createUnit(
        unitWords,
        level,
        i + 1
      )
    );

  }


  console.log(
    `Generated ${units.length} units`
  );


  return units;

}



export {
  getWordsForLevel,
  createLesson,
  createUnit,
  createLearnStep,
  createQuizStep,
  createSentenceStep,
  createListenStep,
};

export default generateCourse;