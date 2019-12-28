import React from 'react';
import { MutationFunction } from 'react-apollo';
import Helmet from 'react-helmet';
import { verifyPhone, verifyPhoneVariables } from 'src/types/api';
import Button from '../../Components/Button';
import Header from '../../Components/Header';
import Input from '../../Components/Input';
import styled from '../../typed-components';
import Form from 'src/Components/Form/Form';

const Container = styled.div``;

const ExtendedForm = styled(Form)`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 20px;
`;

interface IProps {
  verificationCode: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: MutationFunction<verifyPhone, verifyPhoneVariables>;
  loading: boolean;
}

const VerifyPhonePresenter: React.SFC<IProps> = ({
  verificationCode,
  onChange,
  onSubmit,
  loading
}) => (
  <Container>
    <Helmet>
      <title>Verify Phone | Number</title>
    </Helmet>
    <Header backTo={'/phone-login'} title={'Verify Phone Number'}/>
    <ExtendedForm submitFn={onSubmit}>
      <ExtendedInput
        value={verificationCode}
        placeholder={'Enter Verification Code'}
        onChange={onChange}
        name='verificationCode'
      />
      <Button
        disabled={loading}
        value={loading ? 'Verifing' : 'Submit'}
        onClick={null}
      />
    </ExtendedForm>
  </Container>
)

export default VerifyPhonePresenter;