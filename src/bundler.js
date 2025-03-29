/**
 * - Start with an entry file
 * - Split transpilled code to chunks and mention it's dependencies
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const { transformFromAstSync } = require('@babel/core')
const { default: traverse } = require('@babel/traverse')

let ID = 0
function composeFile(filePath) {
    try {

        const file = fs.readFileSync(filePath, 'utf8');
        // checkout https://astexplorer.net for tree formatting
        const astExplorer = parse(file, {
            sourceType: 'module',
            plugins: [
                'js',
                'typescript',
            ]
        });
    
        const dependenciesList = new Set();

        traverse(astExplorer, {
            ImportDeclaration: ({ node }) => {
                dependenciesList.add(node.source.value);
            },
        })
        const { code } = transformFromAstSync(astExplorer, file, {
            presets: ['@babel/preset-env'],
        });

        const id = ID++;
        return {
            id,
            filePath,
            dependencies: Array.from(dependenciesList),
            code,
        }
    } catch (error) {
        console.error('Failed to compose file: ', error)
    }
}
console.log(composeFile('./example/index.js'));
