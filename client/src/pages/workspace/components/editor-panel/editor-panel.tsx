import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useEffect, useMemo } from 'react';
import { styled } from '@mui/material';
import { githubDark } from '@uiw/codemirror-themes-all';
import { PostgreSQL, sql } from '@codemirror/lang-sql';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentSelectedQueryDataAtom,
  currentSqlQueryAtom,
  currentWorkspaceInfoAtom,
} from '../../../../recoil/atoms';

const EditorPanel = () => {
  const currentSelectedQueryData = useRecoilValue(currentSelectedQueryDataAtom);
  const [currentSqlQuery, setCurrentSqlQuery] =
    useRecoilState(currentSqlQueryAtom);
  const workspace = useRecoilValue(currentWorkspaceInfoAtom);

  const schema = useMemo(
    () =>
      (workspace?.schema ?? []).reduce<Record<string, string[]>>(
        (acc, curr) => {
          acc[curr.tableName] = curr.columns;
          return acc;
        },
        {}
      ),
    [workspace]
  );

  useEffect(() => {
    if (currentSelectedQueryData !== undefined) {
      setCurrentSqlQuery(currentSelectedQueryData?.rawSql ?? '');
    } else {
      setCurrentSqlQuery(
        '/** \n  Select a query to start editing it! \n  You could also run any valid query over the workspace DB connection \n**/'
      );
    }
  }, [currentSelectedQueryData]);

  const onChange = useCallback((value, viewUpdate) => {
    setCurrentSqlQuery(value);
  }, []);

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
        value={currentSqlQuery}
        height={'100%'}
        extensions={[
          sql({
            dialect: PostgreSQL,
            upperCaseKeywords: false,
            schema,
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
