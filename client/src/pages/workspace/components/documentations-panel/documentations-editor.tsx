import MDEditor, { commands, MDEditorProps } from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentQueryDocsAtom,
  currentSelectedQueryDataAtom,
} from '../../../../recoil/atoms';

// dark theme for markdown editor
document.documentElement.setAttribute('data-color-mode', 'dark');

const DocumentationsEditor = () => {
  const currentSelectedQueryData = useRecoilValue(currentSelectedQueryDataAtom);
  const [currentQueryDocs, setCurrentQueryDocs] =
    useRecoilState(currentQueryDocsAtom);

  useEffect(() => {
    if (currentSelectedQueryData !== undefined) {
      setCurrentQueryDocs(currentSelectedQueryData?.documentation ?? '');
    } else {
      setCurrentQueryDocs(
        "### Markdown editor for query documentation\n\n`Select a query to see it's documentation!`"
      );
    }
  }, [currentSelectedQueryData]);

  const handleOnChange: MDEditorProps['onChange'] = (value) => {
    setCurrentQueryDocs(value);
  };

  return (
    <Box sx={{ height: '100%' }}>
      <MDEditor
        value={currentQueryDocs}
        height={'100%'}
        preview={'preview'}
        extraCommands={[
          commands.codeEdit,
          commands.codePreview,
          commands.fullscreen,
        ]}
        onChange={handleOnChange}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </Box>
  );
};

export default DocumentationsEditor;
