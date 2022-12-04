import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
uri: "https://api.thegraph.com/subgraphs/name/nikhil0360/dclip",
cache: new InMemoryCache(),
});

export default client;


