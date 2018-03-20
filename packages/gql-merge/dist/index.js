#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

exports.mergeStrings = mergeStrings;
exports.mergeString = mergeString;
exports.mergeAst = mergeAst;

var _language = require('graphql/language');

var _gqlFormat = require('@coralproject/gql-format');

var _package = require('../package.json');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  mergeStrings: mergeStrings,
  mergeString: mergeString,
  mergeAst: mergeAst

  /**
   * Merges an array of GraphQL strings into one
   * @param {string[]} schemaStrs - An array of GraphQL strings.
   * @return {string} The resulting merged GraphQL string.
   */
};
function mergeStrings(schemaStrs) {
  var schemaStr = schemaStrs.join('\n\n');
  return mergeString(schemaStr);
}

/**
 * Merges duplicate definitions in a single GraphQL string
 * @param {string} schemaStr - The GraphQL String.
 * @return {string} The resulting merged GraphQL string.
 */
function mergeString(schemaStr) {
  var schemaAst = (0, _language.parse)(schemaStr);
  return mergeAst(schemaAst);
}

/**
 * Merges duplicate definitions in a single GraphQL abstract-syntax tree
 * @param {Document} schemaAst - The GraphQL AST.
 * @return {string} The resulting merged GraphQL string.
 */
function mergeAst(schemaAst) {
  var typeDefs = {};

  // Go through the AST and extract/merge type definitions.
  var editedAst = (0, _language.visit)(schemaAst, {
    enter: function enter(node) {
      var nodeName = node.name ? node.name.value : null;

      // Don't transform TypeDefinitions directly
      if (!nodeName || !node.kind.endsWith('TypeDefinition')) {
        return;
      }

      var oldNode = typeDefs[nodeName];

      if (!oldNode) {
        // First time seeing this type so just store the value.
        typeDefs[nodeName] = node;
        return null;
      }

      // This type is defined multiple times, so merge the fields and values.
      var concatProps = ['fields', 'values', 'types'];
      concatProps.forEach(function (propName) {
        if (node[propName] && oldNode[propName]) {
          node[propName] = oldNode[propName].concat(node[propName]);
        }
      });

      typeDefs[nodeName] = node;
      return null;
    }
  });

  var remainingNodesStr = (0, _gqlFormat.formatAst)(editedAst);
  var typeDefsStr = (0, _values2.default)(typeDefs).map(_gqlFormat.formatAst).join('\n');
  var fullSchemaStr = remainingNodesStr + '\n\n' + typeDefsStr;

  return (0, _gqlFormat.formatString)(fullSchemaStr);
}