import {
  Box,
  Button,
  Typography,
  Grid, 
  styled,
} from "@mui/material";
import {
  useLoaderData,
  useParams,
} from "react-router-dom";
import React, { useEffect } from "react";
import { urlDecode } from "url-encode-base64";
import chmsuLogo from "../../assets/chmsu-small.jpg";
import registrarUDC from "../../assets/registrar_udc.jpg";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { HomeSemesterServices } from "../../services/homeSemesterService";

const GradeSheetHeaderContainer = styled("header")({
  '@media print': {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    top: 0,
  }
})

const GradeSheetFooterContainer = styled("header")({
  '@media print': {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    bottom: 0,
  }
})

class ComponentToPrint extends React.Component {
  render() {
    const {
      semester,
      currentSchoolYear,
      instructor,
      subject,
      section,
      students,
    } = this.props;
    const getStatusOrRemark = (remarks) => {
      let remark = null;
      let status = null;
      switch (remarks) {
        case "passed":
          remark = "Passed";
          break;
        case "failed":
          status = "Failed";
          break;
        case "inc":
          remark = "Incomplete";
          break;
        case "drp":
          remark = "Dropped";
          break;
        case "ng":
          remark = "No Grade";
          break;
        case "na":
          remark = "No Attendance";
          break;
        case "w":
          remark = "Withdrawn";
          break;
        default:
          break;
      }
      return remark || status;
    };
    const addTableIds = (students) => students.map((student, index) => ({ ...student, id: ++index }));
    const studentsWithTableId = addTableIds(students)
    const pages = Math.ceil(studentsWithTableId.length / 30);
    const studentsPerPage = 30;
    const renderPage = (pageNumber) => {
      const startIndex = pageNumber * studentsPerPage;
      const pageStudents = studentsWithTableId.slice(startIndex, startIndex + studentsPerPage);

      return (
        <div 
          key={pageNumber} 
          id="pageContainer"
          style={{ 
            width: "100%",
            height: "100%",
            margin: "0 0 48px",
            padding: "0",
           }}
          
        >
                <GradeSheetHeaderContainer>
                  <Box
                    sx={{ 
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "stretch",
                      width: "100%",
                      border: "1px solid black",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", padding: '8px', outline: '1px solid black',  maxWidth:"auto" }}>
                      <img src={chmsuLogo} width={50} height={50} alt="chmsu logo"  />  
                    </div>
                    <Typography style={{  alignSelf: "center" }} variant="h6" color="initial">
                      {`Grade Sheet`.toUpperCase()}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        borderLeft: "1px solid black",
                      }}
                    >
                      <Typography style={{ borderBottom: '1px solid black', width: '100%', lineHeight: '1', fontWeight: '600'}} variant="body1" color="initial">&nbsp; Document Code: {process.env.REACT_APP_DOCUMENT_CODE} &nbsp;&nbsp;</Typography>
                      <Typography style={{ borderBottom: '1px solid black', width: '100%', lineHeight: '1', fontWeight: '600'}} variant="body1" color="initial">&nbsp; Revision No.: {process.env.REACT_APP_REVISION_NO}&nbsp;&nbsp;</Typography>
                      <Typography style={{ borderBottom: '1px solid black', width: '100%', lineHeight: '1', fontWeight: '600'}} variant="body1" color="initial">&nbsp; Effective Date: {process.env.REACT_APP_EFFECTIVE_DATE}&nbsp;&nbsp;</Typography>
                      <Typography style={{ lineHeight: '1', fontWeight: '600'}} variant="body1" color="initial">&nbsp; Page: {++pageNumber} of {pages}&nbsp;&nbsp;</Typography>
                    </div>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                      margin: '16px 0',
                    }}
                  >
                    <Typography variant="h6" color="initial">
                      Student Grade Sheet
                    </Typography>
                    <Typography variant="body1" color="initial">
                      {`${semester}, ${currentSchoolYear}`}
                    </Typography>
                  </Box>
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <Typography variant="body1" color="initial">
                        {`SUBJECT: ${subject}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" color="initial">
                        {`INSTRUCTOR: ${instructor}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" color="initial">
                        {`CURR/ YR/ SEC: ${section}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </GradeSheetHeaderContainer>
                <div style={{ minHeight: "720px", maxHeight: "778px", margin: "4px 0 0" }} >
                  <table
                    border={1}
                    style={{ 
                      borderCollapse: "collapse",
                      width: "100%",
                      color: "initial",
                    }}
                    
                  >
                    <thead
                      style={{ fontSize: "12px", textAlign: "center" }}
                    >
                      <tr>
                        <th className="headerTable" >No.</th>
                        <th className="headerTable" style={{ textAlign: "left" }}>ID Number</th>
                        <th className="headerTable" >NAME OF STUDENT</th>
                        <th className="headerTable" >Midterm</th>
                        <th className="headerTable" >Endterm</th>
                        <th className="headerTable" >FINAL GRADE</th>
                        <th className="headerTable" >ACTION TAKEN</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "13px", textAlign: "center" }} border={1}>
                      {pageStudents.map(
                        (
                          {
                            id,
                            studentID,
                            studentName,
                            midTermGrade,
                            endTermGrade,
                            finalGrade,
                            remarks,
                          },
                          index
                        ) => (
                          <tr key={id}>
                            <td>{id}</td>
                            <td height={"auto"}>{studentID}</td>
                            <td style={{ paddingLeft: '8px' }} align="left" height={"auto"}>{studentName}</td>
                            <td height={"auto"}>{midTermGrade}</td>
                            <td height={"auto"}>{endTermGrade}</td>
                            <td height={"auto"}>{((midTermGrade > 50 && endTermGrade > 50) || (finalGrade >= 1 && finalGrade <= 3)) && finalGrade}</td>
                            <td height={"auto"}>
                              {
                                (midTermGrade > 50 && endTermGrade > 50) 
                                ? getStatusOrRemark(remarks) 
                                : ((midTermGrade < 50 && getStatusOrRemark(remarks) === "Failed") || (endTermGrade < 50 && getStatusOrRemark(remarks) === "Failed")) 
                                  ? "" 
                                  : getStatusOrRemark(remarks)
                              }
                              
                              </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <GradeSheetFooterContainer className="printFooter" style={{ width: "100%", marginBottom: '32px'  }}>
                  <Grid 
                  className="signatories"
                  container 
                  columnGap={1}
                  sx={{ 
                    textAlign: 'center',
                    margin: '48px 0',
                    justifyContent: 'space-between'
                  }}
                  >
                    <Grid item xs={2}></Grid>
                    <Grid item xs={3} sx={{ borderTop: '1px solid black' }}>
                      <Typography variant="body2" color="initial">
                        <b style={{ textAlign: 'center' }}>INSTRUCTOR'S SIGNATURE</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ borderTop: '1px solid black' }}>
                      <Typography variant="body2" color="initial" >
                        <b style={{ textAlign: 'center' }}>DEAN'S SIGNATURE</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ borderTop: '1px solid black' }}>
                      <Typography variant="body2" color="initial">
                        <b style={{ textAlign: 'center' }}>REGISTRAR'S SIGNATURE</b>
                      </Typography>
                    </Grid>
                  </Grid>
                    
                    
                    
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{ 
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ border: "1px solid black", width: '100%', textAlign: 'center', padding: 0, color: 'black' }}><i>STATUS</i></span>
                        <img
                          src={registrarUDC}
                          width={120}
                          height={120}
                          alt="Registrar University Document Controller"
                          style={{ border: "1px solid black" }}
                        />
                      </div>
                    </div>
                  </div>
                </GradeSheetFooterContainer>
            </div>
      )
    }
    return (
      <>
        {Array.from({ length: pages }, (_, index) => renderPage(index))}
      </>
    );
  }
}

const PrintGradeSheet = () => {
  const handlePrint = () => {
    window.print();
  };
  const { code } = useParams();
  const [semester, currentSchoolYear] = code?.split("-");
  const { data, students } = useLoaderData();
  const decode = {
    semester: urlDecode(semester),
    currentSchoolYear: urlDecode(currentSchoolYear),
  };

  const ComponentToPrintProps = {
    semester:
      decode.semester === "summer"
        ? "SUMMER"
        : decode.semester === "1st"
        ? "First Semester"
        : "Second Semester",
    currentSchoolYear: `${decode.currentSchoolYear} - ${
      parseInt(decode.currentSchoolYear) + 1
    }`,
    instructor: data[0].instructor,
    subject: data[0].subject,
    section: data[0].section,
    major: data[0].major,
    students: students,
  };

  const componentRef = React.useRef();
  // const handlePrint2 = useReactToPrint({
  //   content: () => componentRef.current,
  //   pageStyle: `
  //     div#printContainer {
  //       background-color: blue;
  //     }
  //   `,
  //   print: handlePrint,
  // });
  const navigate = useNavigate();
  const [cookies, ,] = useCookies(['accessLevel', 'email']);
  useEffect(() => {
    if(!['Faculty', 'Part Time'].includes(cookies.accessLevel)) return navigate('/', { replace: true });
  }, [cookies, navigate]);
  return (

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 0,
              margin: 0,
              color: "initial",
              width: "100%",
              height: "100%",
              backgroundColor: "var(--background-main)",
            }}
          >
            <ComponentToPrint
              semester={ComponentToPrintProps.semester}
              currentSchoolYear={ComponentToPrintProps.currentSchoolYear}
              instructor={ComponentToPrintProps.instructor}
              subject={ComponentToPrintProps.subject}
              section={ComponentToPrintProps.section}
              major={ComponentToPrintProps.major}
              students={ComponentToPrintProps.students}
              ref={componentRef}
            />
            <Box 
              displayPrint={'none'}
              sx={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                position: 'sticky',
                bottom: 0,
               }}
            >  
              <Button
                sx={{
                  backgroundColor: "var(--background-main)",
                  border: "2px solid var(--primary-color)",
                  borderRadius: "5px",
                  padding: "6px 16px",
                  
                }}
                onClick={handlePrint}
              >
                Print
              </Button>
            </Box>
          </div>


  );
};

  export const loader = async ({ params }) => {
    const { code, class_code} = params;
    const [semester, currentSchoolYear] = code.split("-");
    // const { data } = await axios.get(
    //   `${process.env.REACT_APP_API_URL}/getClassCodeDetails?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}`
    // );
    const { data } = await HomeSemesterServices.getClassCodeDetails(semester, currentSchoolYear, class_code);

    // const { data: students } = await axios.get(
    //   `${process.env.REACT_APP_API_URL}/getClassStudents?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}`
    // );
    const { students } = await HomeSemesterServices.getClassStudents(semester, currentSchoolYear, class_code);
    return { data, students };
  };
  export default PrintGradeSheet;
  