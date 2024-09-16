import React, { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  Tooltip,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import { LooksOne, LooksTwo, BeachAccess } from '@mui/icons-material';

const SelectableList = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <List>
      <ListItemButton onClick={handleClick}>
        <Tooltip title="Select Semester">
          <ListItemIcon>
            <LooksOne />
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="Select Semester" />
      </ListItemButton>
      <FormControl fullWidth>
        <InputLabel id="select-semester-label">Semester</InputLabel>
        <Select
          labelId="select-semester-label"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          value={selectedValue}
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemText primary={selected || 'Select Semester'} />
            </Box>
          )}
        >
          <MenuItem value="1st">1st Semester</MenuItem>
          <MenuItem value="2nd">2nd Semester</MenuItem>
          <MenuItem value="summer">Summer</MenuItem>
        </Select>
      </FormControl>
    </List>
  );
};

export default SelectableList;