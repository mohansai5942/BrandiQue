const fs = require('fs');

const file = 'pages/services/AIAutomation.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix imports
content = content.replace(
  "import { ArrowRight, Check, Bot",
  "import { Link } from 'react-router-dom';\\nimport { motion, AnimatePresence } from 'motion/react';\\nimport { ArrowRight, Check, Bot"
);

// Fix maintenance
content = content.replace(
  'enterprise: "70,000 to 1,50,000+"\\n  },',
  'enterprise: "70,000 to 1,50,000+",\\n     maintenance: ""\\n  },'
);

fs.writeFileSync(file, content);
console.log("Fixed issues.");
