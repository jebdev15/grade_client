import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { Close } from "@mui/icons-material";
import React, { useEffect } from "react";
import { urlDecode } from "url-encode-base64";
import { useReactToPrint } from "react-to-print";
import chmsuLogo from "../../assets/chmsu.png";
import axios from "axios";

class ComponentToPrint extends React.Component {
  render() {
    const {
      semester,
      currentSchoolYear,
      instructor,
      subject,
      section,
      major,
      students,
    } = this.props;
    const currentHeadOfRegistrar = "ARLENE G. PASQUIN, MAEd";
    const rotalFooter = {
      lineOne: "RO-TAL-F.017",
      lineTwo: "REVISION 0",
      lineThree: "EFFECTIVE:",
      lineFour: "10/10/2022",
    };
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

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "2rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            "@media (max-width: 599px)": {
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={chmsuLogo} width={100} height={100} alt="chmsu logo" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" color="initial">
              Republic of the Philippines
            </Typography>
            <Typography variant="body1" color="initial">
              <strong>CARLOS HILADO MEMORIAL STATE UNIVERSITY</strong>
            </Typography>
            <Typography variant="body1" color="initial">
              Main Campus, Talisay City, Negros Occidental
            </Typography>
            <Typography variant="body1" color="initial">
              <strong>OFFICE OF THE REGISTRAR</strong>
            </Typography>
            <Typography variant="body1" color="initial">
              Student Grade Sheet
            </Typography>
            <Typography variant="body1" color="initial">
              {`${semester}, ${currentSchoolYear}`}
            </Typography>
          </Box>
        </Box>
        <table
          className="printTable"
          border={1}
          cellPadding={1}
          style={{
            borderCollapse: "collapse",
            width: "100%",
            color: "initial",
          }}
        >
          <tbody className="tableHeaderOne">
            <tr style={{ borderStyle: "hidden" }}>
              <td colSpan={6}>
                Subject:: <strong>{subject}</strong>
              </td>
            </tr>
            <tr
              style={{ borderLeftStyle: "hidden", borderRightStyle: "hidden" }}
            >
              <td
                style={{
                  borderLeftStyle: "hidden",
                  borderRightStyle: "hidden",
                }}
                colSpan={3}
              >
                Instructor :: <strong>{instructor}</strong>
              </td>
              <td
                style={{
                  borderLeftStyle: "hidden",
                  borderRightStyle: "hidden",
                }}
                colSpan={3}
              >
                Curr / Yr / Sec :: <strong>{section}</strong>
              </td>
            </tr>
          </tbody>
          <tbody className="tableHeaderTwo">
            <tr>
              <th>No.</th>
              <th>NAME OF STUDENT</th>
              <th></th>
              <th></th>
              <th>FINAL</th>
              <th>ACTION TAKEN</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th>Midterm</th>
              <th>Endterm</th>
              <th>GRADE</th>
              <th></th>
            </tr>
            <tr>
              <th></th>
              <th align="left" colSpan={5}>
                {major || "---"}
              </th>
            </tr>
          </tbody>
          <tbody border={1}>
            {students.map(
              (
                {
                  studentName,
                  midTermGrade,
                  endTermGrade,
                  finalGrade,
                  remarks,
                },
                index
              ) => (
                <tr key={++index}>
                  <td height={"auto"}>{++index}</td>
                  <td height={"auto"}>{studentName}</td>
                  <td height={"auto"}>{midTermGrade}</td>
                  <td height={"auto"}>{endTermGrade}</td>
                  <td height={"auto"}>{(midTermGrade > 50 && endTermGrade > 50) && finalGrade}</td>
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
        <table
          style={{
            width: "100%",
            color: "initial",
            borderCollapse: "collapse",
            cellSpacing: 10,
          }}
        >
          <tbody>
            <tr height={100}>
              <td></td>
              <td></td>
              <td></td>
              <td
                style={{
                  textAlign: "center",
                  verticalAlign: "bottom",
                  fontSize: "14px",
                }}
              >
                {currentHeadOfRegistrar}
              </td>
            </tr>
            <tr cellSpacing={10} style={{ borderBottom: "1px dotted black" }}>
              <td></td>
              <td
                align="center"
                style={{ borderTop: "1px solid black" }}
                width={300}
              >
                Instructor's Signature
              </td>
              <td
                align="center"
                style={{ borderTop: "1px solid black" }}
                width={300}
              >
                Dean
              </td>
              <td
                align="center"
                style={{ borderTop: "1px solid black" }}
                width={300}
              >
                Registrar III
              </td>
            </tr>
            <tr></tr>
            <tr className="rotal">
              <td
                style={{
                  fontSize: "9px",
                  padding: ".5rem",
                  border: "1px solid black",
                }}
                width={100}
              >
                {rotalFooter.lineOne} <br />
                {rotalFooter.lineTwo} <br />
                {rotalFooter.lineThree} <br />
                {rotalFooter.lineFour}
              </td>
            </tr>
          </tbody>
        </table>
      </Box>
    );
  }
}

const PrintGradeSheet = () => {
  const navigate = useNavigate();
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
  const [...contexts] = useOutletContext();
  const printOpen = contexts[4];
  const setPrintOpen = contexts[5];

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
        .tableHeaderOne tr td
        .tableHeaderTwo tr th, 
        tbody tr th {
            font-size: 12px;
        } 
        .tableHeaderOne tr td {
          background-color: #e8f5e9;
        }
        .tableHeaderOne tr:last-child td {
          border-style: hidden;
          border-bottom-style: solid;
        }
        .tableHeaderTwo tr:not(:last-child) th {
          text-align: center;
        }
        .tableHeaderTwo tr:last-child th:first-child {
          border-right-style: hidden;
        }
      `,
  });
  return (
    <Dialog
      open={printOpen}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          setPrintOpen(false);
        }
      }}
      fullWidth
      maxWidth="lg"
      scroll="paper"
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "text.light",
          padding: "8px 24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          Grade Sheet
          <IconButton
            onClick={() => {
              setPrintOpen(false);
              navigate(`/home/${code}`);
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 2,
            color: "initial",
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
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "var(--primary-color-light)" }}>
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
      </DialogActions>
    </Dialog>
  );
};

  export const loader = async ({ params }) => {
    const { code, class_code} = params;
    const [semester, currentSchoolYear] = code.split("-");
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/getClassCodeDetails?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}`
    );
    // console.log('data', data);

    const { data: students } = await axios.get(
      `${process.env.REACT_APP_API_URL}/getClassStudents?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}`
    );
    // console.log('students', students);
    return { data, students };
  };
  export default PrintGradeSheet;
  