import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

export const noAuthClient = new ApolloClient({
    link: createHttpLink({
        uri: 'https://cv-project-js.inno.ws/api/graphql',
    }),
    cache: new InMemoryCache(),
});
