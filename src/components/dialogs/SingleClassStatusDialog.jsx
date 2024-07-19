import { Close } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const SingleClassStatusDialog = ({
    open,
    close,
    data,
    changeActionHandler,
    confirmation,
    isSmallScreen,
    scheduleDueDate,
}) => {
    return (
        <Dialog open={open} onClose={close} aria-labelledby={"dialog-confirmation"}>
          <DialogTitle id={"dialog-confirmation-title"}>
              Lock/Unlock All Subject Load
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
          <DialogContent sx={isSmallScreen ? { width: '100%' } : { width: 500 }} dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                {/* <InputLabel id="select-schoolyear-label">School Year</InputLabel> */}
                <TextField
                  label="School Year"
                  type='text'
                  value={`${scheduleDueDate.schoolyear}-${parseInt(scheduleDueDate.schoolyear)+1}`}   
                  disabled
                  fullWidth
                />
              </FormControl>
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                {/* <InputLabel id="select-schoolyear-label">School Year</InputLabel> */}
                <TextField
                  label="Semester"
                  type='text'
                  value={scheduleDueDate.semester}   
                  disabled
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-action-label">ACTION</InputLabel>
                <Select
                  labelId="select-action-label"
                  id="select-status"
                  label="ACTION"
                  name="action"
                  value={data}
                  onChange={changeActionHandler}
                  required
                >
                  <MenuItem value={"Lock"}>Lock</MenuItem>
                  <MenuItem value={"Unlock"}>Unlock</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Button
                variant='standard'
                color="primary"
                onClick={confirmation}
              >
                Update
              </Button>
              <Button
                onClick={close}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </DialogActions>
        </Dialog>
    )
};

export default SingleClassStatusDialog;