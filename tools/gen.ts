const fs = require('fs').promises;
const path = require('path');
const { Command } = require('commander');

console.log('test');

const program = new Command();

program
	.option('-n, --name <name>', 'Component name', 'Component')
	.option('-t, --type <type>', 'Component type', 'component')
	.option('--css', 'Css', false);

program.parse(process.argv);

const options = program.opts();

const componentsPath = (type, innerPath) =>
	path.join(__dirname, `../src/${type}s`, innerPath);

async function createComponent({ name, css, type }) {
	const folderPath = componentsPath(type, name);
	await fs.mkdir(folderPath);
	await fs.writeFile(
		path.join(folderPath, `${name}.tsx`),
		`${css ? `import styles from './${name}.module.css'\n` : ''}
function ${name}() {
  return (
    <div>

    </div>
  )
}

export default ${name};
`
	);
	await fs.writeFile(
		path.join(folderPath, `index.ts`),
		`export { default } from './${name}';\n`
	);
	if (css) {
		await fs.writeFile(path.join(folderPath, `${name}.module.css`), '');
	}
	if (type === 'component') {
		await fs.appendFile(
			componentsPath(type, 'index.ts'),
			`export { default as ${name} } from './${name}';`
		);
	}
}

createComponent(options)
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
export {};
