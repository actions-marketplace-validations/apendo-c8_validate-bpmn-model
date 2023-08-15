const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const copyCustomRules = (customRulesFolder) => {
  const srcDir = path.join(process.cwd(), customRulesFolder);
  const destDir = '/opt/hostedtoolcache/node/18.17.0/x64/lib/node_modules/bpmnlint/rules';
  execSync(`cp -r ${srcDir}/* ${destDir}`);
};

const listAvailableRules = () => {
  const rulesDir = '/opt/hostedtoolcache/node/18.17.0/x64/lib/node_modules/bpmnlint/rules';
  console.log(execSync(`ls -al ${rulesDir}`).toString());
};

const createBpmnlintrcFile = (bpmnlintrcPath) => {
  const bpmnlintrcContent = fs.readFileSync(bpmnlintrcPath, 'utf-8');
  fs.writeFileSync('.bpmnlintrc', bpmnlintrcContent);
};

const runBpmnValidation = (bpmnFilesPath) => {
  const files = fs.readdirSync(bpmnFilesPath).filter(file => file.endsWith('.bpmn'));
  files.forEach(file => {
    const filePath = path.join(bpmnFilesPath, file);
    try {
      execSync(`bpmnlint ${filePath}`);
      console.log(`\x1b[32mNo errors found in ${file}\x1b[0m`);
    } catch (error) {
      console.log(`\x1b[31mErrors found in ${file}:\x1b[0m`);
      console.log(error.stdout.toString());
    }
  });
};

module.exports = {
  copyCustomRules,
  listAvailableRules,
  createBpmnlintrcFile,
  runBpmnValidation
};
