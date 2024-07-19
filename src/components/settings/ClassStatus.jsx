import React, { useState } from 'react'
import { 
  Box, 
  Button, 
  FormControl, 
  Typography,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { useCookies } from 'react-cookie';
import { updateClassStatusServices } from '../../services/admin-settings.services';

const ClassStatus = ({
  schoolyear,
  semester,
}) => {
  const [cookies,,] = useCookies(['email']);
  const initialDeadlineState = {
      schoolyear: schoolyear || 1970,
      semester: semester || '',
      action: 'Lock' || 'Unlock',
  }
  const [data, setData] = useState(initialDeadlineState);
  const changeHandler = (event) => {
      setData({...data, [event.target.name]: event.target.value});
  }
  const updateHandler = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      formData.append('email_used', cookies.email);
      for(const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
      }
      const { data, status } = await updateClassStatusServices(formData);
      console.log(data, status);
      alert(data.message, status);
  }
  return (
      <>
      <Box
          sx={{
              display: 'flex',
              mb: 2,
              gap: 2,
          }}
      >
          <Typography variant="body1" color="initial">{`MANAGE SUBJECT LOAD`}</Typography>
          <Box component="form" onSubmit={updateHandler} sx={{ display: 'flex', flexDirection: 'column', rowGap: 1, maxWidth: '500px' }}>
              <Typography variant="body1" color="initial">
                {`School Year: ${parseInt(data.schoolyear)} - ${parseInt(data.schoolyear)+1}`}
              </Typography>

              <Typography variant="body1" color="initial">
                {`Semester: ${data.semester}`}
              </Typography>
            <FormControl fullWidth>
                <InputLabel id="select-action-label">Action</InputLabel>
                <Select
                  id="select-action"
                  label="Action"
                  name="action"
                  value={data.action}
                  onChange={changeHandler}
                  required
                >
                  <MenuItem value="Lock">Lock</MenuItem>
                  <MenuItem value="Unlock">Unlock</MenuItem>
                </Select>
              </FormControl>
            <Button variant="contained" type="submit">SAVE</Button>
          </Box>
      </Box>
      </>
  )
}

export default ClassStatus