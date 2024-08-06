import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import Typography from '@mui/material/Typography'
import { Box, Divider } from '@mui/material'

const ShowGrades = ({ grades }) => {
    const { data, loading } = grades
    const columns = [
        { field: 'id', headerName: 'Student ID', hide: true, width: 150 },
        {
            field: 'subject_code',
            headerName: 'Subject Code',
            description: 'This column has a value getter and is not sortable.',
            hideable: false,
            sortable: false,
            width: 150,
        },
        {
            field: 'grade',
            headerName: 'Grade',
            description: 'This column has a value getter and is not sortable.',
            width: 60,
        },
        {
            field: 'credit',
            headerName: 'Credit',
            description: 'This column has a value getter and is not sortable.',
            width: 60,
        },
        {
            field: 'remarks',
            headerName: 'Remarks',
            description: 'This column has a value getter and is not sortable.',
            width: 100,
        },
        {
            field: 'encoder',
            headerName: 'Encoder',
            description: 'This column has a value getter and is not sortable.',
            width: 200,
        },
    ];
    const getAverage = (grades) => {
        if (!Array.isArray(grades) || grades.length === 0) {
            return '0.000'; // or return NaN or some other value indicating no grades
        }

        const gradeValues = grades.map(gradeObj => gradeObj.grade);
        
        const sum = gradeValues.reduce((acc, grade) => {
            if (typeof grade !== 'number' || isNaN(grade)) {
                throw new Error('All elements in the grades array must be numbers.');
            }
            return acc + grade;
        }, 0);

        const average = sum / gradeValues.length;
        return average.toFixed(3); // Format to 3 decimal places
    }
    const getDeficienciesCount = (grades) => {
        if (!Array.isArray(grades) || grades.length === 0) {
            return 0;
        }

        // Assuming a grade below 60 is considered a deficiency. Adjust this threshold as needed.
        const passingGradeThreshold = 60;
        const deficiencies = grades.filter(gradeObj => gradeObj.grade < passingGradeThreshold);

        return deficiencies.length;
    };
    return (
        <>
        <Box sx={{ 
            position: 'relative',
            width: 'clamp(230px, 100%, 760px)',
        }}>
            <Box sx={{
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'white',
                zIndex: 1,
                padding: '8px 0',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 2,
            }}>
                {data && (
                    <>
                        <Typography variant="body1" color="initial">
                            {`Average Grade: ${getAverage(data)}`}
                        </Typography>
                        <Divider orientation="vertical" sx={{ mx: 2 }} flexItem />
                        <Typography variant="body1" color="initial">
                        {`Deficiencies: ${getDeficienciesCount(data)}`}
                        </Typography>
                    </>
                )}
            </Box>
            <DataGrid
                rows={data}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 5,
                    },
                },
                }}
                pageSizeOptions={[5, 10, 25]}
                loading={loading}
            />
        </Box>
            
        </>
    )
}

export default ShowGrades