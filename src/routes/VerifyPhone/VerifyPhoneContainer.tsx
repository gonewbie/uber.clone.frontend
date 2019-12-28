import React from 'react';
import { Mutation } from 'react-apollo';
import { RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import { LOG_USER_IN } from 'src/innerQueries';
import { verifyPhone, verifyPhoneVariables } from 'src/types/api';
import { VERIFY_PHONE } from './VerifyPhone.queries';
import VerifyPhonePresenter from './VerifyPhonePresenter';

interface IState {
  verificationCode: string;
  phoneNumber: string;
}

interface IProps extends RouteComponentProps<any> {}

class VerifyPhoneContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    try {
      Object.hasOwnProperty.call(props.location.state, 'phone');
    } catch (e) {
      props.history.push('/');
    }
    this.state = {
      phoneNumber: props.location.state.phone,
      verificationCode: ''
    }
    this.onInputChange = this.onInputChange.bind(this);
  }
  public render() {
    const { verificationCode, phoneNumber } = this.state;
    return (
      <Mutation mutation={LOG_USER_IN}>
        {(logUserIn) => (
          <Mutation<verifyPhone, verifyPhoneVariables>
          mutation={VERIFY_PHONE}
          variables={{
            key: verificationCode,
            phoneNumber
          }}
          onCompleted={data => {
            const { CompletePhoneVerification } = data;
            console.log(CompletePhoneVerification);
            if (CompletePhoneVerification.ok) {
              if (CompletePhoneVerification.token) {
                logUserIn({
                  variables: {
                    token: CompletePhoneVerification.token
                  }
                })
              }
              toast.success('You\'re verified, logging in now');
            } else {
              toast.error(CompletePhoneVerification.error)
            }
          }}
        >
          {(mutation, { loading }) => (
            <VerifyPhonePresenter
              onSubmit={mutation}
              onChange={this.onInputChange}
              verificationCode={verificationCode}
              loading={loading}
            />
          )}
        </Mutation>
        )}
      </Mutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  }
}

export default VerifyPhoneContainer;