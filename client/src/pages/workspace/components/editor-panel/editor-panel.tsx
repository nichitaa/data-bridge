import CodeMirror from '@uiw/react-codemirror';
import { useCallback } from 'react';
import { styled } from '@mui/material';
import { githubDark } from '@uiw/codemirror-themes-all';
import { PostgreSQL, sql } from '@codemirror/lang-sql';

const EditorPanel = () => {
  const onChange = useCallback((value, viewUpdate) => {}, []);

  return (
    <StyledEditorWrapper>
      <CodeMirror
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLineGutter: true,
          allowMultipleSelections: true,
          syntaxHighlighting: true,
          completionKeymap: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          defaultKeymap: true,
          searchKeymap: true,
          lintKeymap: true,
          indentOnInput: true,
        }}
        theme={githubDark}
        value={`BEGIN
    SELECT * INTO STRICT myrec FROM emp WHERE empname = myname;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE EXCEPTION 'employee % not found', myname;
        WHEN TOO_MANY_ROWS THEN
            RAISE EXCEPTION 'employee % not unique', myname;
END;`}
        height={'100%'}
        extensions={[
          sql({
            dialect: PostgreSQL,
            upperCaseKeywords: false,
            schema: {
              users: ['name', 'id', 'address'],
              products: ['name', 'cost', 'description'],
            },
          }),
        ]}
        onChange={onChange}
      />
    </StyledEditorWrapper>
  );
};

const StyledEditorWrapper = styled(`div`)(({ theme }) => ({
  height: 'calc(100% - 29px)',
  '& .cm-theme': {
    height: '100%',
  },
  '& .cm-editor': {
    fontSize: '14px',
  },
}));

export default EditorPanel;
