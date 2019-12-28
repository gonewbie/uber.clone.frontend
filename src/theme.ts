import baseStyled, { ThemedStyledInterface } from 'styled-components';

export const theme = {
  blueColor: '#3498db',
  greenColor: '#1abc9c',
  greyColor: '#7f8c8d',
  yellowColor: '#f1c40f'
};

export type Theme = typeof theme;
export const styled = baseStyled as ThemedStyledInterface<Theme>;