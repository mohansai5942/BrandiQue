const fs = require('fs');

// Patch index.html
let indexContent = fs.readFileSync('index.html', 'utf8');
const scriptStart = indexContent.indexOf('<script type="module">');
const scriptEndStr = '</script>\n  </body>';
const scriptEnd = indexContent.indexOf(scriptEndStr, scriptStart);

if (scriptStart !== -1 && scriptEnd !== -1) {
    const before = indexContent.substring(0, scriptStart);
    const after = indexContent.substring(scriptEnd + '</script>\n'.length);
    fs.writeFileSync('index.html', before + after);
    console.log('Removed chatbot script from index.html');
} else {
    console.log('Could not find chatbot script bounds in index.html');
}

// Patch App.tsx
let appContent = fs.readFileSync('App.tsx', 'utf8');
appContent = appContent.replace("import ChatBotHighlight from './components/ChatBotHighlight';\n", "");
appContent = appContent.replace("        <ChatBotHighlight />\n", "");
fs.writeFileSync('App.tsx', appContent);
console.log('Removed ChatBotHighlight from App.tsx');
