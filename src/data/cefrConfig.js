export const CEFR_LEVELS = {

  A0: {
    number: 0,
    name: 'Absolute Beginner',
  },

  A1: {
    number: 1,
    name: 'Beginner',
  },

  A2: {
    number: 2,
    name: 'Elementary',
  },

  B1: {
    number: 3,
    name: 'Intermediate',
  },

  B2: {
    number: 4,
    name: 'Upper Intermediate',
  },

  C1: {
    number: 5,
    name: 'Advanced',
  },

  C2: {
    number: 6,
    name: 'Proficient',
  },

  OTHER: {
    number: null,
    name: 'Other',
  },

};



export const getLevelNumber=(level)=> {

  return CEFR_LEVELS[level]?.number ?? null;

}



export function isValidLevel(level) {

  return Object.prototype.hasOwnProperty.call(
    CEFR_LEVELS,
    level
  );

}



export const getLevelName=(level)=> {

  return CEFR_LEVELS[level]?.name ?? 'Unknown';

}



export const CEFR_LEVEL_ORDER = [

  'A0',
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
  'OTHER',

];