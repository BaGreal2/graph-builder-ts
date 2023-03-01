import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const parse = path.parse;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();
program.version('1.0.0');

program
	.option('-p, --path <path>', 'Path to the folder', '.')
	.parse(process.argv);

const options = program.opts();

const folderPath = path.join(__dirname, '../src/' + options.path);

fs.readdir(folderPath, (err, files) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	const fileNames = files.map((file) => {
		const filePath = path.join(folderPath, file);
		// console.log(parse(filePath).name);
		const fileObj = {
			nameWithoutExt: parse(filePath).name,
			nameWithExt: parse(filePath).base,
		};
		return fileObj;
	});

	console.log(options.path);

	let writeStr = '';

	fileNames.forEach((fileObj) => {
		if (fileObj.nameWithExt === 'index.ts') {
			return;
		}
		writeStr += `export {default as ${fileObj.nameWithoutExt}} from './${fileObj.nameWithExt}';`;
	});

	fs.writeFileSync(path.join(folderPath, 'index.ts'), writeStr);
});
export {};
