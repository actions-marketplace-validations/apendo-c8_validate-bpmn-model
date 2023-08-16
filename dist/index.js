const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the values of the inputs
const customRulesFolder = core.getInput('custom-rules-folder');
const bpmnlintrcPath = core.getInput('bpmnlintrc-path');
const bpmnFilesPath = core.getInput('bpmn-files-path');

// Copy custom rules
const bpmnlintRulesPath = '/opt/hostedtoolcache/node/18.17.0/x64/lib/node_modules/bpmnlint/rules';
execSync(`cp -r ${customRulesFolder}/* ${bpmnlintRulesPath}`);

// List all available rules
console.log(execSync(`ls -al ${bpmnlintRulesPath}`).toString());

// Read and create .bpmnlintrc configuration file
fs.copyFileSync(bpmnlintrcPath, '.bpmnlintrc');

// Run BPMN validation and output result
const bpmnFiles = fs.readdirSync(bpmnFilesPath).filter(file => file.endsWith('.bpmn'));
for (const file of bpmnFiles) {
    const filePath = path.join(bpmnFilesPath, file);
    const result = execSync(`bpmnlint ${filePath}`).toString();
    if (result.trim() === '') {
        console.log(`No errors found in ${file}`);
    } else {
        console.log(`Errors found in ${file}:`);
        console.log(result);
    }
}
