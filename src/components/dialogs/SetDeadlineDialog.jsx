import { Close } from "@mui/icons-material"
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material"

const SetDeadlineDialog = ({
    open,
    close,
    isSmallScreen,
    data,
    changeHandler,
    updateHandler,
}) => {
    return (
        <Dialog open={open} onClose={close} aria-labelledby={"dialog-confirmation"}>
          <DialogTitle id={"dialog-confirmation-title"}>
            SET Deadline
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
              <FormControl fullWidth>
                {/* <InputLabel id="select-activity-label">Activity</InputLabel> */}
                <TextField
                  labelId="select-activity-label"
                  id="select-activity"
                  name="activity"
                  label="Activity"
                  type='text'
                  value={data.activity}
                  onChange={changeHandler}
                  fullWidth
                />
              </FormControl>
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                {/* <InputLabel id="select-schoolyear-label">School Year</InputLabel> */}
                <TextField
                  labelId="select-schoolyear-label"
                  id="select-schoolyear"
                  name="schoolyear"
                  label="School Year"
                  type='number'
                  value={data.schoolyear}
                  onChange={changeHandler}       
                />
                <TextField
                  label="School Year"
                  type='number'
                  value={`${parseInt(data.schoolyear)+1}`}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-semester-label">Semester</InputLabel>
                <Select
                  labelId="select-semester-label"
                  id="select-semester"
                  label="Semester"
                  name="semester"
                  value={data.semester}
                  onChange={changeHandler}
                >
                  <MenuItem value="1st">1st Semester</MenuItem>
                  <MenuItem value="2nd">2nd Semester</MenuItem>
                  <MenuItem value="summer">Summer</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-status-label">Status</InputLabel>
                <Select
                  labelId="select-status-label"
                  id="select-status"
                  label="Status"
                  name="status"
                  value={data.status}
                  onChange={changeHandler}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Close">Close</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                {/* <InputLabel id="select-from-label">From</InputLabel> */}
                <TextField
                  id="select-from-label"
                  name="from"
                  label="From"
                  type='date'
                  value={data.from}
                  onChange={changeHandler}
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth>
                {/* <InputLabel id="select-to-label">To</InputLabel> */}
                <TextField
                  id="select-to-label"
                  name="to"
                  label="To"
                  type='date'
                  value={data.to}
                  onChange={changeHandler}
                  fullWidth
                />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Button
                variant='standard'
                color="primary"
                onClick={updateHandler}
              >
                Save
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
}

export default SetDeadlineDialog;