import ApolloClient, { Operation } from 'apollo-boost';

const apolloClient = new ApolloClient({
  clientState: {
    defaults: {
      auth: {
        __typename: 'Auth',
        isLoggedIn: Boolean(localStorage.getItem('jwt'))
      }
    }
  },
  resolvers: {
    Mutation: {
      logUserIn: (_, { token }, { cache }) => {
        localStorage.setItem('jwt', token);
        cache.writeDate({
          data: {
            auth: {
              __typename: 'Auth',
              isLoggedIn: true,
            }
          }
        });
        return null;
      }
    }
  },
  request: async (operation: Operation) => {
    operation.setContext({
      headers: {
        'X-JWT': localStorage.getItem('jwt')
      }
    });
  },
  uri: 'http://localhost:4000/graphql'
});

export default apolloClient;