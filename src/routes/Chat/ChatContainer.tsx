import React from 'react'
import { Mutation, MutationFunction, Query } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import {USER_PROFILE} from "../../sharedQueries.queries";
import {getChat, getChatVariables, sendMessage, sendMessageVariables, userProfile} from "../../types/api";
import {GET_CHAT, SEND_MESSAGE} from "./Chat.queries";
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
            {({ data: chatData, loading }) => (
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
            )}
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
  }

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