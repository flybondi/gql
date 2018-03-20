# gql

This branch serves as a temporary fork of https://github.com/liamcurry/gql until
https://github.com/liamcurry/gql/pull/7 can be merged.

> Tools for working with GraphQL documents

**Warning: these tools are still in an early phase and there will be issues. Bug reports and pull-requests are welcome!**

## Table of Contents

- [Background](#background)
- [Install](#getting-started)
    - [Packages](#packages)
- [Contribute](#contribute)
- [License](#license)

## Background

Building GraphQL schemas in the GraphQL native language (i.e. `.graphql` files)
has several benefits over using a programming language:

- Your data structures are language agnostic so only the resolvers need to be
programmed.
- The GraphQL language is terser than most programming languages. Schemas are simpler
to write and understand.
- Schemas rarely change after compile time; most people won't take advantage
of progammatic schemas.
- Schemas can be accessed without a GraphQL server.

Hopefully the tools in this repository make it easier to work with GraphQL files.

## License

MIT (c) Liam Curry
