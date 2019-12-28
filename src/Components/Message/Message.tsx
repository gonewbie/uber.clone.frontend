import React from 'react';
import styled, { withProps } from '../../typed-components';

interface IProps {
  text: string;
  mine: boolean;
}
const Container = withProps<IProps, HTMLDivElement>(styled.li)`
  background-color: ${props => (props.mine ? props.theme.blueColor : props.theme.greyColor)};
  color: white;
  padding: 1rem 1.2rem;
  border-radius: 1.2rem;
  align-self: ${props => (props.mine ? 'flex-end' : 'flex-start')};
  border-bottom-right-radius: ${props => (props.mine ? '0' : '1.2rem')};
  border-bottom-left-radius: ${props => (!props.mine ? '0' : '1.2rem')};
`;

const Message: React.SFC<IProps> = ({ text, mine }) => (
  <Container mine={mine}>
    {text}
  </Container>
);

export default Message;