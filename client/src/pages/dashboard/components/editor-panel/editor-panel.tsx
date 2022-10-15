import Editor, { EditorProps, useMonaco } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { editor } from 'monaco-editor';
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import { Box } from '@mui/material';

interface MainProps {
  dimensions: { height: number; width: number };
}

const EditorPanel = (props: MainProps) => {
  const monaco = useMonaco();
  const editorRef = useRef<IStandaloneCodeEditor>(null!);

  useEffect(() => {
    if (monaco) {
      const formatProvider =
        monaco.languages.registerDocumentFormattingEditProvider('pgsql', {
          async provideDocumentFormattingEdits(model) {
            const value = model.getValue();
            // TODO: call api to format pgsql syntax
            const formatted = value;
            return [
              {
                range: model.getFullModelRange(),
                text: formatted,
              },
            ];
          },
        });
    }
  }, [monaco]);

  const handleEditorOnMount: EditorProps['onMount'] = (editor, monaco) => {
    editor.addAction({
      id: 'dbruh',
      label: 'Run Query',
      keybindings: [monaco.KeyMod.CtrlCmd + monaco.KeyCode.Enter],
      contextMenuGroupId: 'operation',
      contextMenuOrder: 0,
      run: async () => {
        const selectedValue = (editorRef?.current as any)
          .getModel()
          .getValueInRange((editorRef?.current as any)?.getSelection());
        const query = selectedValue || (editorRef?.current as any)?.getValue();
        console.log('resulting query: ', query);
      },
    });
    editorRef.current = editor;
  };

  const handleEditorWillMount: EditorProps['beforeMount'] = (monaco) => {};

  if (props.dimensions.height <= 30) return null;
  return (
    <Box sx={{ height: 'calc(100% - 29px)' }}>
      <Editor
        options={{
          readOnly: false,
          tabSize: 2,
          fontSize: 13,
          minimap: { enabled: false },
          wordWrap: 'on',
          fixedOverflowWidgets: true,
          contextmenu: true,
        }}
        defaultLanguage={'pgsql'}
        language={'pgsql'}
        theme={'vs-dark'}
        defaultValue='select * from users'
        onMount={handleEditorOnMount}
        beforeMount={handleEditorWillMount}
      />
    </Box>
  );
};

export default EditorPanel;
