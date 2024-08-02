import { Close } from "@mui/icons-material"
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";

const ViewStudentsDialog = ({
    open,
    close,
    data,
}) => {
    return (
        <Dialog 
          open={open} 
          onClose={close} 
          aria-labelledby={"dialog-confirmation"}
          maxWidth={"xl"}
        >
          <DialogTitle id={"dialog-confirmation-title"}>
              View Students
          </DialogTitle>
          <IconButton 
            aria-label="close" 
            onClick={close}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
          <DialogContent dividers>
          <Box 
            
            sx={{ 
              height: 500,
              width: 1500,
             }}
            >
                <DataGrid
                  rows={data.rows}
                  columns={data.columns}
                  initialState={{ 
                      pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                      }
                  }}
                  pageSizeOptions={[5, 10]}
                />
            </Box>
          </DialogContent>
        </Dialog>
    )
}

export default ViewStudentsDialog;