import baseStyled, { ThemedStyledInterface } from 'styled-components';

export const theme = {
  blueColor: '#3498db',
  greyColor: '#7f8c8d'
};

export type Theme = typeof theme;
export const styled = baseStyled as ThemedStyledInterface<Theme>;