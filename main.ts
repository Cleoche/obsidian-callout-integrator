import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';


export default class calloutIntegrator extends Plugin {

	onload() {
		this.addCommand({
			id: 'callout-integrate',
			name: 'integrate',
			editorCallback: (editor: Editor) => {
				let selection = editor.getSelection(); 									//gets highlighted selection
				if (selection != "") {													//make sure selection isn't empty
					editor.replaceSelection("> " + selection.replace(/\n/g, "\n> ")); 	//adds "> " before each line; need the initial "> " separately as it doesn't register as a new line
				}
			}
		})
		this.addCommand({
			id: 'callout-unintegrate',
			name: 'un-integrate',
			editorCallback: (editor: Editor) => {
				let selection2 = editor.getSelection(); 								//gets highlighted selection
				if (selection2.charAt(0) === '>') { 									// test if there is a ">" at the beginning of the selection
					selection2 = selection2.substring(1); 								// cuts out the ">"
					if (selection2.charAt(0) === ' ') {									//check for space at the beginning of the selection
						selection2 = selection2.substring(1);							// cuts out the space
					}
				}
				editor.replaceSelection(selection2.replace(/\n> /g, "\n")); 			// cuts every "> " occurring after a new line
			}
		})
	}

	onunload() {

	}
}