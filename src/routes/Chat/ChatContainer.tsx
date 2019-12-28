import {SubscribeToMoreOptions} from "apollo-client";
import React from 'react'
import { Mutation, MutationFunction, Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import {USER_PROFILE} from "../../sharedQueries.queries";
import {getChat, getChatVariables, sendMessage, sendMessageVariables, userProfile} from "../../types/api";
import {GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES} from "./Chat.queries";
import ChatPresenter from "./ChatPresenter";

interface IProps extends RouteComponentProps<any> {}
interface IState {
  message: string;
}

class ChatContainer extends React.Component<IProps, IState> {
  public sendMessageMutation: MutationFunction<sendMessage, sendMessageVariables> | undefined;
  constructor(props: IProps) {
    super(props);
    if (!props.match.params.chatId) {
      props.history.push('/');
    }
    this.state = {
      message: ''
    }
  }

  public render() {
    const {
      match: {
        params: { chatId }
      }
    } = this.props;
    const { message } = this.state;
    return (
      <Query<userProfile> query={USER_PROFILE}>
        {({ data: userData }) => (
          <Query<getChat, getChatVariables> query={GET_CHAT} variables={{ chatId: parseInt(chatId, 10) }}>
            {({ data: chatData, loading, subscribeToMore }) => {
              const subscribeToMoreOptions: SubscribeToMoreOptions = {
                document: SUBSCRIBE_TO_MESSAGES,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }
                  // this is graphql-yoga subscription's bug(redundant data) fix at client
                  const {
                    data: { MessageSubscription }
                  } = subscriptionData;
                  const {
                    GetChat: {
                      chat: { messages }
                    }
                  } = prev;
                  const newMessageId = MessageSubscription.id;
                  const lastestMessageId = messages.length > 0 ? messages[messages.length - 1].id : -1;
                  if (lastestMessageId === newMessageId) {
                    return prev;
                  }
                  // -----
                  const updatedData = Object.assign({}, prev, {
                    GetChat: {
                      ...prev.GetChat,
                      chat: {
                        ...prev.GetChat.chat,
                        messages: [
                          ...prev.GetChat.chat.messages,
                          subscriptionData.data.MessageSubscription
                        ]
                      }
                    }
                  });
                  return updatedData;
                }
              };
              subscribeToMore(subscribeToMoreOptions);
              return (
                <Mutation<sendMessage, sendMessageVariables> mutation={SEND_MESSAGE}>
                  {sendMessageMutation => {
                    this.sendMessageMutation = sendMessageMutation;
                    return (
                      <ChatPresenter
                        userData={userData}
                        loading={loading}
                        chatData={chatData}
                        messageText={message}
                        onInputChange={this.onInputChange}
                        onSubmit={this.onSubmit}
                      />
                    )
                  }}
                </Mutation>
              )
            }}
          </Query>
        )}
      </Query>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

  public onSubmit = () => {
    const { message } = this.state;
    const {
      match: {
        params: { chatId }
      }
    } = this.props;
    if (message !== '') {
      this.setState({
        message: ''
      });
      this.sendMessageMutation && this.sendMessageMutation({
        variables: {
          chatId: parseInt(chatId, 10),
          text: message
        }
      });
    }
    return;
  }
}

export default ChatContainer;