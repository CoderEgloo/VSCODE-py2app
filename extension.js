// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { exec } = require('child_process');
const vscode = require('vscode');
var path = require("path");
const fs = require('fs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "py2app" is now active!');
	function runTerminalCommand(command) {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing command: ${error}`);
				return;
			}

			console.log(`Command output: ${stdout}`);
			console.error(`Command error: ${stderr}`);
		});
	}

	function createTextFileInCurrentDirectory(fileName, fileContent) {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders && workspaceFolders.length > 0) {
			const firstWorkspaceFolder = workspaceFolders[0];
			const newFilePath = path.join(firstWorkspaceFolder.uri.fsPath, fileName);

			fs.writeFile(newFilePath, fileContent, (err) => {
				if (err) {
					console.error(`Error creating file: ${err}`);
					return;
				}

				console.log(`File created successfully: ${newFilePath}`);
			});
		} else {
			console.error('No workspace folder is open.');
		}
	}



	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('py2app.setup.py', function () {
		// The code you place here will be executed every time your command is executed

		
		var currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
		var currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath);
		createTextFileInCurrentDirectory('setup.py', "from setuptools import setup\nAPP = ['" + currentlyOpenTabfileName + "']\nOPTIONS = {\n    'iconfile':'icon.icns',\n    'argv_emulation': True,\n}\nsetup(\n    app=APP,\n    options={'py2app': OPTIONS},\n    setup_requires=['py2app'],\n)");
		runTerminalCommand("pip install py2app")
		vscode.window.showInformationMessage("successfully created setup.py")
	});


	



	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
