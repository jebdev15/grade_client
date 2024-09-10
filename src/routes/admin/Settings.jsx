import React from "react";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Fade } from "@mui/material";

import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import Deadline from "../../components/settings/Deadline";
import GraduateStudies from "../../components/settings/GraduateStudies";
import { useOutletContext } from "react-router";
import ClassStatus from "../../components/settings/ClassStatus";

const Settings = () => {
  const initialState = {
    deadline: false,
    colleges: false,
    graduateStudies: false,
    classStatus: false,
    userType: false,
  };
  const [expanded, setExpanded] = React.useState(initialState);

  const handleExpansion = (selected) => {
    switch (selected) {
      case 1:
        setExpanded((prevState) => ({ ...prevState, deadline: !prevState.deadline }));
        break;
      case 2:
        setExpanded((prevState) => ({ ...prevState, colleges: !prevState.colleges }));
        break;
      case 3:
        setExpanded((prevState) => ({ ...prevState, graduateStudies: !prevState.graduateStudies }));
        break;
      case 4:
        setExpanded((prevState) => ({ ...prevState, classStatus: !prevState.classStatus }));
        break;
      default:
        break;
    }
  };
  const [registrarActivitySummer, registrarActivityFirstSemester,registrarActivitySecondSemester] = useOutletContext();
  return (
    <>
      <Accordion
        expanded={expanded.deadline}
        onChange={() => handleExpansion(1)}
        slots={{ transition: Fade }}
        slotprops={{ transition: { timeout: 400 } }}
        sx={{
          "& .MuiAccordion-region": { height: expanded ? "auto" : 0 },
          "& .MuiAccordionDetails-root": { display: expanded ? "block" : "none" },
          marginBottom: "1rem",
        }}
      >
        <AccordionSummary
          sx={{
            paddingLeft: 3,
            paddingRight: 3,
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>DEADLINE</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 3, paddingTop: 1 }}>
          { expanded.deadline && <Deadline />}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded.graduateStudies}
        onChange={() => handleExpansion(3)}
        slots={{ transition: Fade }}
        slotprops={{ transition: { timeout: 400 } }}
        sx={{
          "& .MuiAccordion-region": { height: expanded ? "auto" : 0 },
          "& .MuiAccordionDetails-root": { display: expanded ? "block" : "none" },
          marginBottom: "1rem",
        }}
      >
        <AccordionSummary
          sx={{
            paddingLeft: 3,
            paddingRight: 3,
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography>GRADUATE STUDIES</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 3, paddingTop: 1 }}>{expanded.graduateStudies && <GraduateStudies />}</AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded.classStatus}
        onChange={() => handleExpansion(4)}
        slots={{ transition: Fade }}
        slotprops={{ transition: { timeout: 400 } }}
        sx={{
          "& .MuiAccordion-region": { height: expanded ? "auto" : 0 },
          "& .MuiAccordionDetails-root": { display: expanded ? "block" : "none" },
        }}
      >
        <AccordionSummary
          sx={{
            paddingLeft: 3,
            paddingRight: 3,
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography>LOCK/UNLOCK SUBJECT LOAD</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 3, paddingTop: 1 }}>
          {
            expanded.classStatus && 
              <>
                <ClassStatus schoolyear={registrarActivitySummer.schoolyear} semester={registrarActivitySummer.semester} /><br />
                <ClassStatus schoolyear={registrarActivityFirstSemester.schoolyear} semester={registrarActivityFirstSemester.semester} /><br />
                <ClassStatus schoolyear={registrarActivitySecondSemester.schoolyear} semester={registrarActivitySecondSemester.semester} /><br />
              </>
          }
          </AccordionDetails>
      </Accordion>
    </>
  );
};
export default Settings;
