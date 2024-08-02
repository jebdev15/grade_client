import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { momentFormatDate } from '../../utils/formatDate';
import { IconButton, Tooltip } from '@mui/material';
import { CloudDownload } from '@mui/icons-material';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

async function savePDF() {
    try {
      const pages = Array.from({ length: 4 }, (_, i) => (
        <Page key={i} size="LEGAL" style={styles.page}>
            <View style={styles.section}>
                <Text>
                    Section #{i + 1}
                    Download {i+1}
                </Text>
                <Text>
                    {/* <Typography variant="body1" color="initial"> */}
                        This is section #{i + 1} download {i+1} body
                    {/* </Typography> */}
                </Text>
            </View>
        </Page>
      ));
      const doc = (
        <Document>
            {pages}
        </Document>
      );
  
      const asPdf = pdf([]); // {} is important, throws without an argument
      asPdf.updateContainer(doc);
      const pdfBlob = await asPdf.toBlob();
      const fileName = momentFormatDate(new Date()) + '.pdf';
      saveAs(pdfBlob, fileName);
    } catch (error) {
      console.error(error);
      alert('Error generating PDF');
    }
}

function DownloadGradeSheetPdf() {
    return (
        <Tooltip title="Download Grade Sheet">
            <IconButton 
                aria-label="view" 
                variant="text" 
                color="primary" 
                onClick={savePDF}
            >
                <CloudDownload />
            </IconButton>
        </Tooltip>
    )
}

export default DownloadGradeSheetPdf;