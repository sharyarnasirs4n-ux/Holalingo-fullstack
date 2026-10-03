import vocabulary from './spanish_vocabulary.json';

import {
  isValidLevel,
} from './cefrConfig';



export const validateVocabulary=()=> {

  const errors = [];
  const warnings = [];

  const seenWords = new Set();


  vocabulary.forEach((word, index) => {

    const position = index + 1;


    
    if (
      !word.word ||
      typeof word.word !== 'string'
    ) {

      errors.push(
        `Item ${position}: missing word`
      );

    }


    
    if (
      word.word &&
      typeof word.word === 'string'
    ) {

      const normalizedWord =
        word.word
          .trim()
          .toLowerCase();


      if (
        seenWords.has(normalizedWord)
      ) {

        errors.push(
          `Item ${position}: duplicate word "${word.word}"`
        );

      }


      seenWords.add(
        normalizedWord
      );

    }


    
    if (
      !word.translation ||
      typeof word.translation !== 'string'
    ) {

      errors.push(
        `Item ${position}: missing translation for "${word.word}"`
      );

    }


    
    const level =
      word.level ?? 'OTHER';


    if (
      !isValidLevel(level)
    ) {

      errors.push(
        `Item ${position}: invalid level "${word.level}" for "${word.word}"`
      );

    }


    
    if (
      word.word &&
      typeof word.word === 'string' &&
      typeof word.word_length === 'number'
    ) {

      const actualLength =
        word.word.replace(/\s/g, '').length;


      if (
        actualLength !==
        word.word_length
      ) {

        warnings.push(
          `Item ${position}: "${word.word}" has word_length ${word.word_length}, expected ${actualLength}`
        );

      }

    }

  });


  return {
    errors,
    warnings,
    valid: errors.length === 0,
  };

}



export const printVocabularyReport=()=> {

  const result =
    validateVocabulary();


  console.log(
    '===================================='
  );

  console.log(
    'VOCABULARY VALIDATION'
  );

  console.log(
    '===================================='
  );


  console.log(
    `Total words: ${vocabulary.length}`
  );


  console.log(
    `Errors: ${result.errors.length}`
  );


  console.log(
    `Warnings: ${result.warnings.length}`
  );


  
  if (
    result.errors.length > 0
  ) {

    console.log(
      '--------- ERRORS ---------'
    );

    result.errors.forEach(
      error =>
        console.error(error)
    );

  }


  
  if (
    result.warnings.length > 0
  ) {

    console.log(
      '--------- WARNINGS ---------'
    );

    result.warnings.forEach(
      warning =>
        console.warn(warning)
    );

  }


  
  if (
    result.valid
  ) {

    console.log(
      '✓ Vocabulary is valid'
    );

  }

  else {

    console.log(
      '✗ Vocabulary contains errors'
    );

  }


  console.log(
    '===================================='
  );


  return result;

}