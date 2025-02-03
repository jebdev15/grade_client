import React from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { urlDecode } from "url-encode-base64";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { HomeSemesterServices } from "../../services/homeSemesterService";
import ComponentToPrint from "./ComponentToPrint";

const PrintGradeSheet = () => {
  window.onload = () => window.print();

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
  const navigate = useNavigate();
  const [cookies, ,] = useCookies(['accessLevel', 'email']);
  React.useEffect(() => {
    if(!['Faculty', 'Part Time'].includes(cookies.accessLevel)) return navigate('/', { replace: true });
  }, [cookies, navigate]);
  const [isPageLoaded, setIsPageLoaded] = React.useState(false);
  React.useEffect(() => {
    const handleLoad = () => {
      setIsPageLoaded(true);
    };

    if (document.readyState === "complete") {
      // If page is already loaded, trigger immediately
      handleLoad();
    } else {
      // Otherwise, wait for load event
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);
  React.useEffect(() => {
      let printed = false;
      if (isPageLoaded && !printed) {
        window.print();
        printed = true;
      }
  },[isPageLoaded])
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
              {...ComponentToPrintProps}
              ref={componentRef}
            />
          </div>
  );
};

  export const loader = async ({ params }) => {
    const { code, class_code} = params;
    const [semester, currentSchoolYear] = code.split("-");
    const { data } = await HomeSemesterServices.getClassCodeDetails(semester, currentSchoolYear, class_code);
    const { students } = await HomeSemesterServices.getClassStudents(semester, currentSchoolYear, class_code);
    return { data, students };
  };
  export default PrintGradeSheet;
  