const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const customRulesFolder = process.env.CUSTOM_RULES_FOLDER;

// Copy custom rules
const sourceFolder = path.join(customRulesFolder, '*');
const targetFolder = '/opt/hostedtoolcache/node/18.17.0/x64/lib/node_modules/bpmnlint/rules/';
const copyCommand = `cp -r ${sourceFolder} ${targetFolder}`;
execSync(copyCommand, { stdio: 'inherit', shell: true });

// List all available rules
const listRulesCommand = 'ls -al /opt/hostedtoolcache/node/18.17.0/x64/lib/node_modules/bpmnlint/rules';
execSync(listRulesCommand, { stdio: 'inherit', shell: true });

// Read and create .bpmnlintrc configuration file
const bpmnlintrcPath = process.env.BPMNLINTRC_PATH;
const bpmnlintrcContent = fs.readFileSync(bpmnlintrcPath, 'utf-8');
fs.writeFileSync('.bpmnlintrc.txt', bpmnlintrcContent);
fs.renameSync('.bpmnlintrc.txt', '.bpmnlintrc');
