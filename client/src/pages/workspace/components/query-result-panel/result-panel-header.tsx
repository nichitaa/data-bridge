import {
  Box,
  generateUtilityClasses,
  styled,
  Tooltip,
  Typography,
  typographyClasses,
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import { StyledActionIconButton } from '../editor-panel/editor-panel-actions';

const cls = generateUtilityClasses('ResultPanelHeader', [
  'actionButtonsWrapper',
]);
const ResultPanelHeader = () => {
  return (
    <>
      <StyledResultPanelHeader>
        <Typography>Query Result Explorer</Typography>
        <Box className={cls.actionButtonsWrapper}>
          <Tooltip title={'Save query snapshot'}>
            <StyledActionIconButton variant={'info'}>
              <SaveOutlinedIcon />
            </StyledActionIconButton>
          </Tooltip>
          <Tooltip title={'Export to excel'}>
            <StyledActionIconButton variant={'success'}>
              <DownloadIcon />
            </StyledActionIconButton>
          </Tooltip>
        </Box>
      </StyledResultPanelHeader>
    </>
  );
};

const StyledResultPanelHeader = styled(`div`)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  height: '100%',
  justifyContent: 'space-between',
  // border: '1px solid red',
  paddingLeft: 8,
  paddingRight: 8,
  [`& .${typographyClasses.root}`]: {
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${cls.actionButtonsWrapper}`]: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default ResultPanelHeader;
