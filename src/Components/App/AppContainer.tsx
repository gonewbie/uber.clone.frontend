import React from 'react';
import { graphql } from 'react-apollo';
import reset from 'styled-reset';
import { theme } from '../../theme';
import { ThemeProvider, createGlobalStyle } from '../../typed-components';
import AppPresenter from './AppPresenter';
import { IS_LOGGED_IN } from './AppQueries';

const GlobalStyle = createGlobalStyle`${reset}`;

const AppContainer:any = ({ data }) => (
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </ThemeProvider>
  </>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
