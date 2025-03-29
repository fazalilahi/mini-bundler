# 🌟 **Mini Bundler** 🌟  
*A tiny JavaScript bundler to learn how Webpack/Rollup work!*  

---

## 🚀 **Quick Start**  
1. **Create `example/index.js`**:  
   ```js
   import { greet } from './utils.js';
   console.log(greet('Developer'));
   ```

2. **Run the bundler**:  
   ```bash
   node bundler.js
   ```
   Output: `dist/bundle.js` ✨  

---

## 🔧 **How It Works in 3 Steps**
 
1. **Find Dependencies 📦**  
   ```mermaid
   graph LR
     A[index.js] --> B[utils.js]
   ```

2. **Transform Code** (using Babel)  
   ```js
   // Before
   import { greet } from './utils.js';
   // After
   var _utils = require('./utils.js');
   ```

3. **Bundle Everything**  
   ```js
   (function(modules){
     // Mini-require() system here...
   })({
     0: [function(){...}, {}], // index.js
     1: [function(){...}, {}]  // utils.js
   })
   ```

---

## 🎯 **Key Features**
✅ Finds all `import` statements
✅ Handles JS files
✅ Super simple (~100 lines)

---

## 🛠 **Want to Improve It?**  
Try adding:  
- [ ] Circular dependency support 🔄
- [ ] Code splitting ✂️
- [ ] Source maps 🗺 
- [ ] Dynamic import support 🔀

---

## 🤓 **Learn More**  
🔗 [AST Explorer](https://astexplorer.net)  
🔗 [Babel tools](https://babeljs.io/docs/babel-core)  

---

Made with ❤️ for learning! 🕸️