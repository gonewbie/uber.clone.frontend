import React from 'react';
import { Mutation, MutationFunction } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { startPhoneVerification, startPhoneVerificationVariables } from 'src/types/api';
import { PHONE_SIGN_IN } from './PhoneLogin.queries';
import PhoneLoginPresenter from './PhoneLoginPresenter';

interface IState {
  countryCode: string;
  phoneNumber: string;
}

class PhoneLoginContainer extends React.Component<
  RouteComponentProps<any>,
  IState
> {
  public phoneMutation: MutationFunction<startPhoneVerification, startPhoneVerificationVariables> | undefined = undefined;
  public state = {
    countryCode: "+82",
    phoneNumber: ""
  };

  public render() {
    const { history } = this.props;
    const { countryCode, phoneNumber } = this.state;
    const phone = `${countryCode}-${phoneNumber}`;
    return (
      <Mutation<startPhoneVerification, startPhoneVerificationVariables>
        mutation={PHONE_SIGN_IN}
        variables={{
          phoneNumber: phone
        }}
        onCompleted={data => {
          const { StartPhoneVerification } = data;
          if (StartPhoneVerification.ok) {
            toast.success('SMS Sent! Redirecting you...');
            history.push({
              pathname: '/verify-phone',
              state: {
                phone
              }
            })
          } else {
            toast.error(StartPhoneVerification.error);
          }
        }}
      >
        { (phoneMutation, { loading }) => {
          this.phoneMutation = phoneMutation;
          return (
            <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
              loading={loading}
            />
          )
        }
      }
      </Mutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<
      HTMLInputElement | HTMLSelectElement
    > = event => {
      const {
        target: { name, value }
      } = event;
      this.setState({
        [name]: value
      } as any);
  };

  public onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const { countryCode, phoneNumber } = this.state;
    const phone = `${countryCode}-${phoneNumber}`;
    const isValid = /^\+[1-9]+-[0-9]{7,11}$/.test(phone);
    if (isValid && this.phoneMutation) {
      this.phoneMutation();
    } else {
      toast.error('please write a valid phone number!');
    }
  };
}

export default PhoneLoginContainer;
