const { execSync } = require('child_process');
const fs = require('fs');

const customRulesFolder = process.env.INPUT_CUSTOM_RULES_FOLDER;
const bpmnlintrcPath = process.env.INPUT_BPMNLINTRC_PATH;
const bpmnFilesPath = process.env.INPUT_BPMN_FILES_PATH;

// Copy custom rules
execSync(`cp -r ${customRulesFolder}/* /opt/hostedtoolcache/node/18.17.0/x64/lib/node_modules/bpmnlint/rules/`, {
  cwd: process.env.GITHUB_WORKSPACE,
  stdio: 'inherit'
});

// List all available rules
execSync('ls -al /opt/hostedtoolcache/node/18.17.0/x64/lib/node_modules/bpmnlint/rules', {
  stdio: 'inherit'
});

// Read and create .bpmnlintrc configuration file
const bpmnlintrcContent = fs.readFileSync(bpmnlintrcPath, 'utf-8');
fs.writeFileSync('.bpmnlintrc.txt', bpmnlintrcContent);
fs.renameSync('.bpmnlintrc.txt', '.bpmnlintrc');

// Run BPMN validation and output result
const bpmnFiles = fs.readdirSync(bpmnFilesPath).filter(file => file.endsWith('.bpmn'));
for (const file of bpmnFiles) {
  try {
    const result = execSync(`bpmnlint ${bpmnFilesPath}/${file}`).toString();
    if (!result) {
      console.log(`\x1b[32mNo errors found in ${file}\x1b[0m`);
    } else {
      console.log(`\x1b[31mErrors found in ${file}:\x1b[0m`);
      console.log(result);
    }
  } catch (error) {
    console.log(`\x1b[31mErrors found in ${file}:\x1b[0m`);
    console.log(error.stdout.toString());
  }
}
