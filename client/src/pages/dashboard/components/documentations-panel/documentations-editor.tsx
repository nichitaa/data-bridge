import MDEditor, { commands, MDEditorProps } from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { useState } from 'react';
import { Box } from '@mui/material';

// dark theme for markdown editor
document.documentElement.setAttribute('data-color-mode', 'dark');

const DocumentationsEditor = () => {
  const [documentationValue, setDocumentationValue] = useState<
    string | undefined
  >(`### Some documentation for collection 1\n `);

  const handleOnChange: MDEditorProps['onChange'] = (value) => {
    setDocumentationValue(value);
  };

  return (
    <Box sx={{ height: '100%' }}>
      <MDEditor
        value={documentationValue}
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
