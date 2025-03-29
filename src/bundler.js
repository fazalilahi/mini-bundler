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
function transformFile(filePath) {
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
        console.error('Failed to transform file: ', error)
    }
}

async function createGraph (entry) {
    const mainEntry = await transformFile(entry);
    const queue = [mainEntry];
    for (const asset of queue) {
        asset.mapping = {};
        const dirname = path.dirname(asset.filePath);

        await Promise.all(
            asset.dependencies.map(async relativePath => {
                try {
                    const absolutePath = path.join(dirname, relativePath);
                    const child = await transformFile(absolutePath);
                    asset.mapping[relativePath] = child.id;
                    queue.push(child);
                } catch (error) {
                    console.error(`Failed to process ${relativePath}: `, error);
                }
            })
        )
    }
    return queue;
}

function bundle(graph) {
    const modules = graph.map(module => {
        return `
        ${module.id}: [
        function(exports, module, require) {
            ${module.code}
        },
        ${JSON.stringify(module.mapping)},
        ]
        `;
    }).join(',');

    return `
    (function(modules) {
        function require(id) {
            const [fn, mapping] = modules[id];

            function localRequire(name) {
                const resolved = mapping[name];
                if (resolved === undefined) {
                throw new Error('Cannot find module: '+ name);
                }
                return require(resolved);
            }
            const module = { exports: {} };
            fn(module.exports, module, localRequire);
            return module.exports;
        }
        require(0);
    })({${modules}})
    `;
}

async function build() {
    try {
        const graph = await createGraph('./example/index.js');
        const result = bundle(graph);

        await fs.promises.mkdir('dist', { recursive: true });
        await fs.promises.writeFile('dist/bundle.js', result);    
        // console.log(result)
        console.log('Bundle successfully created!');
        console.log('Output: dist/bundle.js (' + (result.length/1024).toFixed(2) + 'KB)');
    } catch (error) {
        console.error('Failed to create bundle: ', error)
    }
}
build();

