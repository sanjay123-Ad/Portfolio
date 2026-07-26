const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'github-profile.svg');
const readmePath = path.join(__dirname, 'README.md');

if (fs.existsSync(svgPath)) {
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const base64Svg = Buffer.from(svgContent).toString('base64');
    
    const markdownContent = `# Hi there, I'm Sanjay K! 👋

<div align="center">
  <img src="data:image/svg+xml;base64,${base64Svg}" alt="Sanjay K Profile Card" width="850">
</div>
`;
    
    fs.writeFileSync(readmePath, markdownContent);
    console.log('README.md successfully updated with base64 embedded SVG!');
} else {
    console.error('github-profile.svg not found!');
}
