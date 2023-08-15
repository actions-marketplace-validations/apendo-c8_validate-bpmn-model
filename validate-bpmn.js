const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const bpmnFilesPath = process.env.INPUT_BPMN_FILES_PATH;

const bpmnLintCommand = 'bpmnlint';

try {
  const files = fs.readdirSync(bpmnFilesPath);
  for (const file of files) {
    if (file.endsWith('.bpmn')) {
      const filePath = path.join(bpmnFilesPath, file);
      try {
        const output = execSync(`${bpmnLintCommand} "${filePath}"`, { stdio: 'pipe' });
        if (output.toString().trim().length === 0) {
          console.log(`No errors found in ${file}`);
        } else {
          console.error(`Errors found in ${file}:`);
          console.error(output.toString().trim());
        }
      } catch (error) {
        console.error(`Error running bpmnlint on ${file}:`);
        console.error(error.stderr.toString().trim());
      }
    }
  }
} catch (error) {
  console.error('Error reading BPMN files:', error.message);
}
