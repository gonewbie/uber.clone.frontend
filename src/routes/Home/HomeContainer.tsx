import React from 'react';
import HomePresenter from './HomePresenter';
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps<any> {}
interface IState {
  isMenuOpen: boolean;
}

class HomeContainer extends React.Component<IProps, IState> {
  public state = {
    isMenuOpen: false
  }
  public render() {
    const { isMenuOpen } = this.state;
    return (
      <HomePresenter isMenuOpen={isMenuOpen} toggleMenu={this.toggleMenu} />
    );
  }
  public toggleMenu = () => {
    this.setState(state => {
      return {
        isMenuOpen: !state.isMenuOpen
      }
    })
  }
}

export default HomeContainer;