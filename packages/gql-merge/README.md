# gql-merge

> Tools for merging GraphQL documents

## Background

This repo contains tools for merging definitions into multiple GraphQL documents
into one. For example, say you have these two files GraphQL files:

```graphql
type Post {
  id: ID!
  content: String
}

type Query {
  postById(id: ID!): Post
}
```

```graphql
type Author {
  id: ID!
  name: String
}

type Query {
  postsByAuthorId(id: ID!): [Post]
}
```

You can use the `gql-merge` tool to combine these files into one:

The resulting file would look like this:

```graphql
type Post {
  id: ID!
  content: String
}

type Query {
  postById(id: ID!): Post
  postsByAuthorId(id: ID!): [Post]
}

type Author {
  id: ID!
  name: String
}
```

## Installation

```
$ yarn add @coralproject/gql-merge
```