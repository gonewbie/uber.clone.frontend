import React from 'react';
import { RouteComponentProps } from 'react-router';
import VerifyPhonePresenter from './VerifyPhonePresenter';

interface IProps extends RouteComponentProps<any> {}

class VerifyPhoneContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    try {
      Object.hasOwnProperty.call(props.location.state, 'phone');
    } catch (e) {
      props.history.push('/');
    }
  }
  public render() {
    return <VerifyPhonePresenter />;
  }
}

export default VerifyPhoneContainer;