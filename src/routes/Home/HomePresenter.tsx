import React from 'react';
import Helmet from 'react-helmet';
import Sidebar from 'react-sidebar';
import Menu from '../../Components/Menu';
import styled from '../../typed-components';

const Container = styled.div``;

interface IProps {
  loading: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const HomePresenter: React.SFC<IProps> = ({
  loading,
  isMenuOpen,
  toggleMenu
}) => (
  <Container>
    <Helmet>
      <title>Home | Uber</title>
    </Helmet>
    <Sidebar
      sidebar={<Menu />}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{
        sidebar: {
          background: 'white',
          width: '80%',
          zIndex: '10'
        }
      }}
    >
      {!loading && <button onClick={toggleMenu}>Open sidebar</button>}
    </Sidebar>
  </Container>
);

export default HomePresenter;