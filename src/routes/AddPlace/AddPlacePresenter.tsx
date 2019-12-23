import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import Button from 'src/Components/Button';
import Form from 'src/Components/Form';
import Header from 'src/Components/Header';
import Input from 'src/Components/Input';
import styled from 'src/typed-components';

const Container = styled.div`
  padding: 0 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 40px;
`;

const ExtendedLink = styled(Link)`
  display: block;
  text-decoration: underline;
  margin-bottom: 20px;
`;

interface IProps {
  address: string;
  name: string;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  loading: boolean;
}

const AddPlacePresenter: React.SFC<IProps> = ({
  onInputChange,
  address,
  name,
  loading
}) => (
  <>
    <Helmet>
      <title>Add Place | Uber</title>
    </Helmet>
    <Header title='Add Place' backTo='/' />
    <Container>
      <Form submitFn={() => {}}>
        <ExtendedInput
          placeholder='Name'
          type='text'
          onChange={onInputChange}
          value={name}
          name='name'
        />
        <ExtendedInput
          placeholder='Address'
          type='text'
          onChange={onInputChange}
          value={address}
          name='address'
        />
        <ExtendedLink to='/find-address'>Pick place from map</ExtendedLink>
        <Button onClick={() => {}} value={loading ? 'Adding place' : 'Add Place'}/>
      </Form>
    </Container>
  </>
);

export default AddPlacePresenter;