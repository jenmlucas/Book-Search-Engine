const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    me: User
  }

  input SaveBookInput {
      authors: [String]
      description: String
      title: String
      bookid: String
      image: String
      link: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SaveBookInput): User
    removeBook(bookId: ID!): User 
  }

  type User {
      _id: ID!
      username: String
      email: String
      bookcount: Int
      savedBooks: [Book]
  }

  type Book {
      bookId: ID
      authors: [String]
      description: String
      title: String
      Image: String
      link: String
  }

  type Auth {
      token: ID!
      user: User
  }
`;

module.exports = typeDefs;