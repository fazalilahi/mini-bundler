/**
 * - Start with an entry file
 * - Split transpilled code to chunks and mention it's dependencies
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
// const { transformFromAstSync } = require('@babel/core')
const traverse = require('@babel/traverse')

let ID = 0
function composeFile(filePath) {
    try {

        const file = fs.readFileSync(filePath, 'utf8');
        // checkout https://astexplorer.net for tree formatting
        const astExplorer = parser.parse(file, {
            sourceType: 'module',
            plugins: [
                'js',
                'typescript',
            ]
        });
    
        const dependenciesList = new Set();

        traverse.default(astExplorer, {
            ImportDeclaration: ({ node }) => {
                dependenciesList.add(node.source.value);
            },
        })
        const id = ID++;
        return {
            id,
            filePath,
            dependencies: Array.from(dependenciesList),
            // code,
        }
    } catch (error) {
        console.error('Failed to compose file: ', error)
    }
}
console.log(composeFile('./example/index.js'));
