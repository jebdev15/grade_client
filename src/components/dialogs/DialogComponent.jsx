import { Close } from "@mui/icons-material";
import { Button, ButtonGroup, Dialog, DialogTitle, DialogContent, IconButton, DialogActions } from "@mui/material";
import { useEffect, useState } from "react";

const DialogComponent = ({
    openDialog, 
    closeDialog,
    onClickHandler, 
    onClickButtonName, 
    dialogTitle,
    dialogContent, 
}) => {
    const { handleUpdateSchedule } = onClickHandler;
    let clickHander;
    switch (dialogTitle) {
        case 'SET SCHEDULE':
            clickHander = handleUpdateSchedule;
            break;
        default:
            break;
    }
    return (
        <>
            <Dialog open={openDialog} onClose={closeDialog} aria-labelledby={"dialog"}>
                <DialogTitle id={"dialog"}>
                    {dialogTitle}
                </DialogTitle>
                <IconButton 
                    aria-label="close" 
                    onClick={closeDialog}
                    sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    }}
                >
                    <Close />
                </IconButton>
                <DialogContent dividers>
                    {dialogContent}
                </DialogContent>
                <DialogActions>
                    <ButtonGroup variant="text" color="primary" aria-label="">
                        {onClickButtonName !== '' && (
                        <Button
                            onClick={clickHander}
                            variant='standard'
                            color="primary"
                        >
                            {onClickButtonName}
                        </Button>
                        )}
                    <Button onClick={closeDialog}>Cancel</Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogComponent;