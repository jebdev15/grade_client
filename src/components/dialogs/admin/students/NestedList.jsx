import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { BeachAccess, Looks3, Looks4, Looks5, LooksOne, LooksTwo } from '@mui/icons-material';
import { getStudentGrades } from '../../../../services/admin-students.services';
import { Divider } from '@mui/material';
import ShowGrades from './ShowGrades';

export default function NestedList({ data }) {
    const [open, setOpen] = React.useState(false);

    const handleClick = (key) => {
        setOpen((prevState) => ({
          ...prevState,
          [key]: !prevState[key]
        }));
      };
    const [grades, setGrades] = React.useState({
        data: [],
        loading: false,
    });
    const getStudentGradesHandler = async (student_id, year_level, semester, school_year) => {
        setGrades((prevState) => ({ ...prevState, loading: true}));
        const { data, status } = await getStudentGrades(student_id, year_level, semester, school_year);
        if(status === 200 && data.length > 0){
            setGrades((prevState) => ({
                ...prevState,
                data,
                loading: false,
            }));
        }
    }
    const getYearLevel = (year_level) => {
        if(year_level === '1st') return <LooksOne />;
        if(year_level === '2nd') return <LooksTwo />;
        if(year_level === '3rd') return <Looks3 />;
        if(year_level === '4th') return <Looks4 />;
        if(year_level === '5th') return <Looks5 />;
    }
    const removeDuplicatesInSchoolYear = (data) => {
        // Create a map to group by school_year and year_level
        const map = new Map();

        data.forEach(({ student_id, year_level, semester, school_year }) => {
            const key = `${school_year}-${year_level}`;
            if (!map.has(key)) {
                map.set(key, {
                    school_year,
                    year_level,
                    semesters: new Set(),
                    student_id
                });
            }
            map.get(key).semesters.add(semester);
        });

        // Convert the map back to an array, converting the Set of semesters to an array
        return Array.from(map.values()).map(group => ({
            school_year: group.school_year,
            year_level: group.year_level,
            semesters: Array.from(group.semesters),
            student_id: group.student_id
        }));
    }
    const getSemester = (semester) => {
        if(semester === '1st') return 'First Semester';
        if(semester === '2nd') return 'Second Semester';
        if(semester === 'summer') return 'Summer';
    }
    const getSemesterIcon = (semester) => {
        if(semester === '1st') return <LooksOne />;
        if(semester === '2nd') return <LooksTwo />;
        if(semester === 'summer') return <BeachAccess />;
    }
    const dataBySchoolYear = removeDuplicatesInSchoolYear(data);
    return (
        <>
            <div style={{ width: 'clamp(230px, 100%, 260px)', display: 'flex', flexDirection: 'column', gap: 2 }} >
            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Year Level / School Year
                </ListSubheader>
                }
            >
                {dataBySchoolYear && dataBySchoolYear.map(({ student_id, year_level, semesters, school_year }, index) => {
                    const key = `${year_level}-${school_year}`;
                    const isOpen = open[key] || false;

                    return (
                    <React.Fragment key={index}>
                        <ListItemButton onClick={() => handleClick(key)}>
                        <ListItemIcon>
                            {getYearLevel(year_level)}
                        </ListItemIcon>
                        <ListItemText 
                            primaryTypographyProps={{ fontSize: '12px' }}
                            primary={`${year_level} / ${school_year} - ${parseInt(school_year) + 1}`} 
                        />
                        {isOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {semesters && semesters.length > 0 && semesters.map((semester, index) => (
                            <ListItemButton 
                                key={index}
                                onClick={() => getStudentGradesHandler(student_id, year_level, semester, school_year)} 
                                sx={{ pl: 4 }} 
                            >
                                <ListItemIcon>
                                {getSemesterIcon(semester)}
                                </ListItemIcon>
                                <ListItemText primary={getSemester(semester)} />
                            </ListItemButton>
                            ))}
                        </List>
                        </Collapse>
                    </React.Fragment>
                    );
                })}
                </List>
            </div>
            <Divider orientation="vertical" flexItem />
            <ShowGrades grades={grades} />
        </>

    );
}