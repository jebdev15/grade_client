import { Close } from "@mui/icons-material"
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material"

const ClassStatusDialog = ({
    open,
    close,
    updateHandler
}) => {
    return (
        <Dialog open={open} onClose={close} aria-labelledby={"dialog-confirmation"}>
          <DialogTitle id={"dialog-confirmation-title"}>
            Confirmation Dialog
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
            <DialogContentText color={"initial"}>
              Please click <strong>CONFIRM</strong> button to update
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Button
                onClick={updateHandler}
                variant='standard'
                color="primary"
              >
                Confirm
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

export default ClassStatusDialog;