const fs = require('fs');
const { execSync } = require('child_process');

async function run() {
  try {
    // Copy custom rules
    execSync(`cp -r ${process.env.INPUT_CUSTOM_RULES_FOLDER}/* /opt/hostedtoolcache/node/18.17.0/x64/lib/node_modules/bpmnlint/rules/`, { stdio: 'inherit' });

    // List available rules
    execSync('ls -al /opt/hostedtoolcache/node/18.17.0/x64/lib/node_modules/bpmnlint/rules', { stdio: 'inherit' });

    // Read and create .bpmnlintrc configuration file
    const bpmnlintrcContents = fs.readFileSync(process.env.INPUT_BPMNLINTRC_PATH, 'utf8');
    fs.writeFileSync('.bpmnlintrc', bpmnlintrcContents);

    // Run BPMN validation and output result
    const bpmnFiles = fs.readdirSync(process.env.INPUT_BPMN_FILES_PATH);
    bpmnFiles.forEach(file => {
      if (file.endsWith('.bpmn')) {
        try {
          const output = execSync(`bpmnlint ${process.env.INPUT_BPMN_FILES_PATH}/${file}`, { stdio: 'pipe' });
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
    });
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

run();
