import React from 'react';
import styled from 'src/typed-components';

const Container = styled.div``;

const Image = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 80px;
  margin-bottom: 35px;
  border: 2px solid black;
  border-radius: 50%;
  font-size: 28px;
  cursor: pointer;
  overflow: hidden;
  & img {
    width: 80px;
    height: 80px;
  }
`;

const Input = styled.input`
  visibility: hidden;
  height: 1px;
  opacity: 0;
  & focus {
    outline: none;
  }
`;

interface IProps {
  uploading: boolean;
  photoUrl: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const PhotoInput: React.SFC<IProps> = ({ uploading, photoUrl, onChange }) => (
  <Container>
    <Input id='photo' type='file' accept='image/*' onChange={onChange} />
    <Image htmlFor='photo'>
      { uploading && '⏰' }
      { !uploading && <img src={photoUrl} alt={photoUrl} />}
    </Image>
  </Container>
);

export default PhotoInput;