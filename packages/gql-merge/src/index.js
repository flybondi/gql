#!/usr/bin/env node
/* @flow */
import {parse,visit,} from 'graphql/language'
import {formatString, formatAst} from 'gql-format'
import {version, description} from '../package.json'

export default {
  mergeStrings,
  mergeString,
  mergeAst,
}

/**
 * Merges an array of GraphQL strings into one
 * @param {string[]} schemaStrs - An array of GraphQL strings.
 * @return {string} The resulting merged GraphQL string.
 */
export function mergeStrings(schemaStrs: string[]): string {
  const schemaStr: string = schemaStrs.join('\n\n')
  return mergeString(schemaStr)
}

/**
 * Merges duplicate definitions in a single GraphQL string
 * @param {string} schemaStr - The GraphQL String.
 * @return {string} The resulting merged GraphQL string.
 */
export function mergeString(schemaStr: string): string {
  const schemaAst: Document = parse(schemaStr)
  return mergeAst(schemaAst)
}

/**
 * Merges duplicate definitions in a single GraphQL abstract-syntax tree
 * @param {Document} schemaAst - The GraphQL AST.
 * @return {string} The resulting merged GraphQL string.
 */
export function mergeAst(schemaAst: Document): string {
  const typeDefs = {};

  // Go through the AST and extract/merge type definitions.
  const editedAst: Document = visit(schemaAst, {
    enter(node) {
      const nodeName = node.name ? node.name.value : null

      // Don't transform TypeDefinitions directly
      if (!nodeName || !node.kind.endsWith('TypeDefinition')) {
        return
      }

      const oldNode = typeDefs[nodeName]

      if (!oldNode) {
        // First time seeing this type so just store the value.
        typeDefs[nodeName] = node
        return null
      }

      // This type is defined multiple times, so merge the fields and values.
      const concatProps = ['fields', 'values', 'types']
      concatProps.forEach(propName => {
        if (node[propName] && oldNode[propName]) {
          node[propName] = oldNode[propName].concat(node[propName])
        }
      })

      typeDefs[nodeName] = node
      return null
    }
  })

  const remainingNodesStr = formatAst(editedAst)
  const typeDefsStr = Object.values(typeDefs).map(formatAst).join('\n')
  const fullSchemaStr = `${remainingNodesStr}\n\n${typeDefsStr}`

  return formatString(fullSchemaStr)
}