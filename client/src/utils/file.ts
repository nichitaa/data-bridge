import { saveAs } from 'file-saver';
import { notificationService } from '../services';

export const downloadFile = async (
  fetchFn: () => Promise<Response>
): Promise<void> => {
  try {
    const response = await fetchFn();

    if (!response.ok) {
      const json = await response.json();
      notificationService.notify({
        variant: 'error',
        message: json.error,
        method: 'download_csv',
      });
      console.error('bad response for file download: ', response);
      return;
    }

    console.log('response: ', response, ' headers: ', response.headers);
    // Extract filename from header
    const filename = 'query.csv';
    const blob = await response.blob();

    // Download the file
    saveAs(blob, filename);
  } catch (error) {
    console.error('Failed to download file', error);
  }
};
