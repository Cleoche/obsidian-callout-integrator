import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!


export default class MyPlugin extends Plugin {

	onload() {
		this.addCommand({
			id: 'callout-integrator',
			name: 'Callout Integrator',
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection();
				editor.replaceSelection(">" + selection.replace(/\n/g, "\n >"));
			}
		})
	}

	onunload() {

	}
}