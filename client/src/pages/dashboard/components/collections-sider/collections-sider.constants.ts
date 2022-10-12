import { generateUtilityClasses } from '@mui/material';

export const collectionsSiderConfig = {
  maxWidth: 300,
  step: 100,
  handlerWidth: 3
}

export const collectionsSiderClasses = generateUtilityClasses('CollectionsSider', [
  'wrapper'
])