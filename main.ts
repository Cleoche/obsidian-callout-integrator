import { Editor, EditorPosition, Plugin } from "obsidian";

export default class calloutIntegrator extends Plugin {

	onload():void {

		// Returns two EditorPositions in order and a boolean that says whether or not the order was swapped
		function order ( editor:Editor ):[EditorPosition, EditorPosition, boolean] {

			const head:EditorPosition = editor.getCursor('head');
			const anchor:EditorPosition = editor.getCursor('anchor');

			if ( head.line < anchor.line || head.line == anchor.line && head.ch < anchor.ch )
				return [head, anchor, false];
			else
				return [anchor, head, true];

		}

		// Sets the selection after integrating/un-integrating
		function setAnchorHead ( pos:[EditorPosition, EditorPosition, boolean], editor:Editor ):void {

			if ( pos[2] ) editor.setSelection( pos[0], pos[1] );
			else editor.setSelection ( pos[1], pos[0] );

		}

		// Returns the un-integrated string, the updated EditorPosition, and how much the position was moved
		function unInt ( editor:Editor, pos:EditorPosition ):[string, EditorPosition, number] {

			let str:string = editor.getLine( pos.line );
			let move = 0;

			if ( str.charAt(0) === '>' ) {

				str = str.substring(1);
				move--;

				if ( pos.ch != 0 ) pos.ch --;

				if ( str.charAt(0) === ' ' ) {

					str = str.substring(1);
					move--;

					if ( pos.ch !=0 ) pos.ch --;

				}
			}

			return [str, pos, move];

		}

		// Integrates the line containing the cursor
		function intNoSelection ( editor:Editor ):void {

			const pos:EditorPosition = editor.getCursor();
			const thisLine:string = editor.getLine( pos.line );

			editor.setLine( pos.line, ( '> ' + thisLine ) );

			if ( pos.ch != 0 || thisLine.charAt(0) != '>' )
				editor.setCursor( { line:pos.line, ch:pos.ch+2 } );

		}

		// Integrates a selection of text
		function intSelection ( editor:Editor ):void {

			const pos:[EditorPosition, EditorPosition, boolean] = order(editor);

			if ( pos[0].line-pos[1].line != 0 )
				editor.replaceSelection(editor.getSelection().replace(/\n/g, "\n> "));

			editor.setLine( pos[0].line, ( '> ' + editor.getLine( pos[0].line ) ) );

			if ( pos[0].ch != 0 ) pos[0].ch += 2;
			pos[1].ch += 2;

			setAnchorHead( pos, editor );
		}

		// Un-integrates the line containing the cursor
		function unIntNoSelection ( editor:Editor ): void {

			const pos:EditorPosition = editor.getCursor();
			const thisLine:[string, EditorPosition, number] = unInt( editor, pos );
			editor.setLine( pos.line, thisLine[0] );
			editor.setCursor( thisLine[1] );

		}

		// Un-integrates a selection of text
		function unIntSelection ( editor:Editor ):void {

			const pos:[EditorPosition, EditorPosition, boolean] = order(editor);
			const firstLine:[string, EditorPosition, number] = unInt( editor, pos[0] );
			const lastLine:[string, EditorPosition, number] = unInt( editor, pos[1] );

			pos[0] = firstLine[1];
			pos[1] = lastLine[1];

			if ( pos[0].line != pos[1].line ) {

				if ( pos[1].line - pos[0].line > 1 )
					editor.replaceSelection( editor.getSelection().replace( /\n> /g, "\n" ) );

				editor.setLine( lastLine[1].line, lastLine[0] );
			}

			editor.setLine( firstLine[1].line, firstLine[0] );
			setAnchorHead( pos, editor );
		}

		this.addCommand({
			id: 'callout-integrate',
			name: 'integrate',
			icon: 'chevrons-right',
			editorCallback: ( editor:Editor ):void => {

				if ( !editor.somethingSelected() ) intNoSelection(editor);
				else intSelection(editor);

			}
		})

		this.addCommand({
			id: 'callout-unintegrate',
			name: 'un-integrate',
			icon: 'chevrons-left',
			editorCallback: ( editor:Editor ):void => {

				if ( !editor.somethingSelected() ) unIntNoSelection(editor);
				else unIntSelection(editor);
			}
		})
	}

	onunload():void {}
}
