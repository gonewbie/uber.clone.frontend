import React from 'react';
import { MutationFunction } from 'react-apollo';
import Helmet from 'react-helmet';
import Button from 'src/Components/Button';
import Form from 'src/Components/Form';
import Header from 'src/Components/Header';
import Input from 'src/Components/Input';
import PhotoInput from 'src/Components/PhotoInput';
import styled from 'src/typed-components';

const Container = styled.div`
  text-align: center;
`;

const ExtendedForm = styled(Form)`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 30px;
`;

interface IProps {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  onSubmit?: MutationFunction;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  loading?: boolean;
  uploading: boolean;
}

const EditAccountPresenter: React.SFC<IProps> = ({
  firstName,
  lastName,
  email,
  profilePhoto,
  onSubmit,
  onInputChange,
  loading,
  uploading
}) => (
  <Container>
    <Helmet>
      <title>Edit Account | Uber</title>
    </Helmet>
    <Header title='Edit Account' backTo={'/'} />
    <ExtendedForm submitFn={onSubmit}>
      <PhotoInput
        uploading={uploading}
        photoUrl={profilePhoto}
        onChange={onInputChange}
      />
      <ExtendedInput
        onChange={onInputChange}
        type='text'
        value={firstName}
        placeholder='First Name'
        name='firstName'
      />
      <ExtendedInput
        onChange={onInputChange}
        type='text'
        value={lastName}
        placeholder='Last Name'
        name='lastName'
      />
      <ExtendedInput
        onChange={onInputChange}
        type='text'
        value={email}
        placeholder='Email'
        name='email'
      />
      <Button onClick={null} value={loading ? 'Loading' : 'Update' }/>
    </ExtendedForm>
  </Container>
);

export default EditAccountPresenter;