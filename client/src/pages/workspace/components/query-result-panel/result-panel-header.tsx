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
import { dbService, notificationService } from '../../../../services';
import { useRecoilValue } from 'recoil';
import {
  currentQueryResultsAtom,
  currentSelectedQueryDataAtom,
  currentSqlQueryAtom,
  currentWorkspaceInfoAtom,
  jwtAtom,
  workspaceChannelAtom,
} from '../../../../recoil/atoms';
import { downloadFile } from '../../../../utils/file';
import _ from 'lodash';

const cls = generateUtilityClasses('ResultPanelHeader', [
  'actionButtonsWrapper',
]);
const ResultPanelHeader = () => {
  const jwt = useRecoilValue(jwtAtom);
  const sql = useRecoilValue(currentSqlQueryAtom);
  const workspace = useRecoilValue(currentWorkspaceInfoAtom);
  const queryResults = useRecoilValue(currentQueryResultsAtom);
  const channel = useRecoilValue(workspaceChannelAtom);
  const currentSelectedQueryData = useRecoilValue(currentSelectedQueryDataAtom);

  const handleOnDownload = () =>
    downloadFile(() =>
      dbService.downloadCsv(jwt!, {
        connectionString: workspace!.dbConnectionString,
        dataBaseType: workspace?.dataBaseType!,
        queryString: sql,
      })
    );

  const handleSaveQuerySnapshot = () => {
    if (currentSelectedQueryData !== undefined) {
      if (_.isEmpty(queryResults?.results)) {
        return notificationService.notify({
          variant: 'warning',
          message: 'Run the query to save its results as snapshot',
          method: 'save_query_raw_sql',
        });
      }
      const request = {
        ...currentSelectedQueryData,
        queryId: currentSelectedQueryData.id,
        snapshot: JSON.stringify(queryResults?.results!),
      };
      channel?.push('update_query', request).receive('ok', (response) => {
        if (response.success) {
          notificationService.notify({
            variant: 'success',
            message: 'Snapshot saved successfully',
            method: 'save_query_raw_sql',
          });
        } else {
          notificationService.notify({
            variant: 'error',
            message: 'Could not save snapshot',
            method: 'save_query_raw_sql',
          });
        }
      });
    }
  };

  return (
    <>
      <StyledResultPanelHeader>
        <Typography>Query Result Explorer</Typography>
        <Box className={cls.actionButtonsWrapper}>
          <Tooltip title={'Save query snapshot'}>
            <StyledActionIconButton
              variant={'info'}
              onClick={handleSaveQuerySnapshot}
            >
              <SaveOutlinedIcon />
            </StyledActionIconButton>
          </Tooltip>
          <Tooltip title={'Export to excel'}>
            <StyledActionIconButton
              variant={'success'}
              onClick={handleOnDownload}
            >
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
