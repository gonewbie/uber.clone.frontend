import React from 'react';
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";
import Message from "../../Components/Message";
import styled from '../../typed-components';
import {getChat, userProfile} from "../../types/api";

const Container = styled.div``;

const MessageList = styled.ol`
  height: 80vh;
  overflow: scroll;
  padding: 0 .12rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  li + li {
  margin-top: .3rem;
  }
`;

const InputBar = styled.div`
  padding: 0 20px;
`;

interface IProps {
  userData?: userProfile;
  chatData?: getChat;
  loading: boolean;
  messageText: string;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: () => void;
}

const ChatPresenter: React.SFC<IProps> = ({
  loading,
  userData: { GetMyProfile: { user = null } = {} } = { GetMyProfile: { user: null } },
  chatData: { GetChat: { chat = null } = {} } = { GetChat: { chat: null } },
  messageText,
  onInputChange,
  onSubmit
}) => (
  <Container>
    <Header title='Chat' />
    {!loading && (
      <>
        <MessageList>
          {user && chat && chat.messages && (
            chat.messages!.map(message => {
              if (message) {
                return (
                  <Message
                    key={message.id}
                    text={message.text}
                    mine={user.id === message.userId}
                  />
                )
              }
              return false;
            })
          )}
        </MessageList>
        <InputBar>
          <Form submitFn={onSubmit}>
            <Input
              value={messageText}
              placeholder='Type your message'
              onChange={onInputChange}
              name='message'
            />
          </Form>
        </InputBar>
      </>
    )}
  </Container>
);

export default ChatPresenter;