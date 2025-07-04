import React, { useState, useEffect, useCallback } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Typography, Box } from '@mui/material';
import axios from 'axios';

function GradesAdmin() {
  const [semesters, setSemesters] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [faculty, setFaculty] = useState([]);

  const fetchSemestersAndYears = useCallback(async () => {
    const [semRes, yearRes] = await Promise.all([
      axios.get('/api/semesters'),
      axios.get('/api/years')
    ]);
    setSemesters(semRes.data);
    setYears(yearRes.data);
  }, []);

  const fetchFaculty = useCallback(async () => {
    if (selectedSemester && selectedYear) {
      const res = await axios.get('/api/faculty', {
        params: {
          semester: selectedSemester,
          year: selectedYear
        }
      });
      setFaculty(res.data);
    } else {
      setFaculty([]);
    }
  }, [selectedSemester, selectedYear]);

  useEffect(() => {
    fetchSemestersAndYears();
  }, [fetchSemestersAndYears]);

  useEffect(() => {
    fetchFaculty();
  }, [selectedSemester, selectedYear, fetchFaculty]);

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Grades Administration
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <FormControl fullWidth>
          <InputLabel>Semester</InputLabel>
          <Select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            label="Semester"
          >
            {semesters.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>School Year</InputLabel>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            label="School Year"
          >
            {years.map((y) => (
              <MenuItem key={y.id} value={y.id}>
                {y.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h6">Faculty for Selected Term:</Typography>
      {faculty.length === 0 ? (
        <Typography>No faculty available for this period.</Typography>
      ) : (
        <ul>
          {faculty.map((f) => (
            <li key={f.id}>{f.name} — {f.department}</li>
          ))}
        </ul>
      )}
    </Box>
  );
}

export default GradesAdmin;
