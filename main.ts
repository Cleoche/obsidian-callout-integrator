import { App, Editor, EditorPosition, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';


export default class calloutIntegrator extends Plugin {

	onload() {
		

		function anchorHead(head: EditorPosition, anchor: EditorPosition, move: number): void {

			if (head.line > anchor.line || head.line == anchor.line
				&& head.ch > anchor.ch) {

					head.ch += move;

				} else {anchor.ch += move;}

		} // anchorHead()

		function unInt(line: string): [number, string] {

			let move = 0;

			if (line.charAt(0) === '>') {

				line = line.substring(1);
				move--;

				if (line.charAt(0) === ' ') {

					line = line.substring(1);
					move--;

				} // if(' ')

			} // if('>')

			return [move, line];

		} // unInt()



		/*** ADDS "> " AT BEGINNING OF EACH LINE ***/
		this.addCommand({
			id: 'callout-integrate',
			name: 'integrate',
			editorCallback: (editor: Editor) => {

				if (editor.somethingSelected()) { // if text highlighted -> integrate selection

					let sHead = editor.getCursor('head');
					let sAnchor = editor.getCursor('anchor');

					editor.replaceSelection("> " + editor.getSelection().replace(/\n/g, "\n> "));

					anchorHead(sHead, sAnchor, 2);
					editor.setSelection(sAnchor, sHead);

				} else { // if no text highlighted -> integrate line containing cursor

					let cursorPos = editor.getCursor();

					editor.setLine(cursorPos.line, ("> " + editor.getLine(cursorPos.line)));
					
					cursorPos.ch += 2;
					editor.setCursor(cursorPos);

				} // if/else

			} // editorCallback
		}) // callout-integrate


		this.addCommand({
			id: 'callout-unintegrate',
			name: 'un-integrate',
			editorCallback: (editor: Editor) => {

				if (editor.somethingSelected()) { //if text highlighted -> remove all "> " following a line break

					let sHead = editor.getCursor('head');
					let sAnchor = editor.getCursor('anchor');

					let edited = unInt(editor.getSelection());

					editor.replaceSelection(edited[1].replace(/\n> /g, "\n"));
				
					anchorHead(sHead, sAnchor, edited[0]);
					editor.setSelection(sAnchor, sHead);
				
				} else { //if no text highlighted -> cut "> " at beginning of line

					let cursorPos = editor.getCursor();

					let edited2 = unInt(editor.getLine(cursorPos.line));
					cursorPos.ch += edited2[0];

					editor.setLine(cursorPos.line, edited2[1]);
					editor.setCursor(cursorPos);
					
				} // if/else

			} // editorCallback
		}) // callout-unintegrate

	} // onload()

	onunload() {

	} // onunload()
}