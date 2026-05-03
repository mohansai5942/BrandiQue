const fs = require('fs');

const file = 'pages/services/AIAutomation.tsx';
let content = fs.readFileSync(file, 'utf8');

const whatIOfferIdx = content.indexOf('{/* WHAT I OFFER SECTION */}');
const useCasesIdx = content.indexOf('{/* USE CASES SECTION */}');
const featuresIdx = content.indexOf('{/* FEATURES CHECKLIST SECTION */}');
const detailedPackagesIdx = content.indexOf('{/* Detailed Services & Packages */}');
const specialHighlightIdx = content.indexOf('{/* SPECIAL HIGHLIGHT SECTION */}');

if (useCasesIdx !== -1 && detailedPackagesIdx !== -1 && specialHighlightIdx !== -1) {
    const p1 = content.substring(0, useCasesIdx);
    // Everything before USE CASES
    
    // Everything from Detailed Packages to SPECIAL HIGHLIGHT (not including SPECIAL HIGHLIGHT)
    const detailedPackagesContent = content.substring(detailedPackagesIdx, specialHighlightIdx);
    
    // The previous middle content (USE CASES + FEATURES CHECKLIST) up to Detailed Packages
    const middleContent = content.substring(useCasesIdx, detailedPackagesIdx);
    
    // Everything from SPECIAL HIGHLIGHT onwards
    const p2 = content.substring(specialHighlightIdx);
    
    content = p1 + detailedPackagesContent + middleContent + p2;
    fs.writeFileSync(file, content);
    console.log("Moved successfully.");
} else {
    console.log("Failed to find indices:", {useCasesIdx, detailedPackagesIdx, specialHighlightIdx});
}
