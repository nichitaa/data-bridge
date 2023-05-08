import CodeMirror from '@uiw/react-codemirror';
import { KeyboardEventHandler, useCallback, useEffect, useMemo } from 'react';
import { styled } from '@mui/material';
import { githubDark } from '@uiw/codemirror-themes-all';
import { PostgreSQL, MySQL, MSSQL, SQLite, sql } from '@codemirror/lang-sql';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentQueryDocsAtom,
  currentSelectedQueryDataAtom,
  currentSqlQueryAtom,
  currentWorkspaceInfoAtom,
  workspaceChannelAtom,
} from '../../../../recoil/atoms';
import { notificationService } from '../../../../services';

const EditorPanel = () => {
  const currentSelectedQueryData = useRecoilValue(currentSelectedQueryDataAtom);
  const [currentSqlQuery, setCurrentSqlQuery] =
    useRecoilState(currentSqlQueryAtom);
  const workspace = useRecoilValue(currentWorkspaceInfoAtom);
  const currentQueryDocs = useRecoilValue(currentQueryDocsAtom);
  const channel = useRecoilValue(workspaceChannelAtom);

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

  const sqlDialect = useMemo(() => {
    if (workspace?.dataBaseType === 0) return MySQL;
    if (workspace?.dataBaseType === 2) return SQLite;
    if (workspace?.dataBaseType === 4) return MSSQL;
    return PostgreSQL;
  }, [workspace?.dataBaseType]);

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

  const handleOnKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      handleSaveQuery();
      return;
    }
  };

  const handleSaveQuery = () => {
    if (currentSelectedQueryData !== undefined) {
      const request = {
        queryId: currentSelectedQueryData.id,
        folderId: currentSelectedQueryData.folderId,
        collectionId: currentSelectedQueryData.collectionId,
        rawSql: currentSqlQuery,
        documentation: currentQueryDocs,
      };
      channel?.push('update_query', request).receive('ok', (response) => {
        if (response.success) {
          notificationService.notify({
            variant: 'success',
            message: response.message,
            method: 'save_query_raw_sql',
          });
        } else {
          notificationService.notify({
            variant: 'error',
            message: 'Could not update query',
            method: 'save_query_raw_sql',
          });
        }
      });
    }
  };

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
            dialect: sqlDialect,
            upperCaseKeywords: false,
            schema,
          }),
        ]}
        onKeyDown={handleOnKeyDown}
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
