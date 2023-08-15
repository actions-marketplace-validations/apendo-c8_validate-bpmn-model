const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const customRulesFolder = process.env.INPUT_CUSTOM_RULES_FOLDER;
const bpmnlintRulesPath = '/opt/hostedtoolcache/node/18.17.0/x64/lib/node_modules/bpmnlint/rules/';

try {
  const files = fs.readdirSync(customRulesFolder);
  files.forEach(file => {
    const sourceFilePath = path.join(customRulesFolder, file);
    const destinationFilePath = path.join(bpmnlintRulesPath, file);
    fs.copyFileSync(sourceFilePath, destinationFilePath);
  });

  console.log('Custom rules copied successfully.');
} catch (error) {
  console.error('Error copying custom rules:', error.message);
  process.exit(1);
}
