import React from 'react';
import { graphql } from 'react-apollo';
import { ToastContainer } from 'react-toastify';
import GlobalStyle from '../../global-styles';
import { theme } from '../../theme';
import { ThemeProvider } from '../../typed-components';
import AppPresenter from './AppPresenter';
import { IS_LOGGED_IN } from './AppQueries';

const AppContainer:any = ({ data }) => (
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </ThemeProvider>
    <ToastContainer draggable={true} position="bottom-center" />
  </>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
