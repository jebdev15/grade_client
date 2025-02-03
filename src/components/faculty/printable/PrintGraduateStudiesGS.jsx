import { useLoaderData } from "react-router-dom";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import ComponentToPrint from "./ComponentToPrint";

const PrintGraduateStudiesGS = () => {
  window.onload = () => {
    window.print();
  };
  const { data, students } = useLoaderData();
  const ComponentToPrintProps = {
    semester:
      data[0].semester === "summer"
        ? "SUMMER"
        : data[0].semester === "1st"
        ? "First Semester"
        : "Second Semester",
    currentSchoolYear: `${data[0].school_year} - ${
      parseInt(data[0].school_year) + 1
    }`,
    instructor: data[0].instructor,
    subject: data[0].subject,
    section: data[0].section,
    major: data[0].major,
    students: students,
  };

  const componentRef = React.useRef();
  const navigate = useNavigate();
  const [cookies, ,] = useCookies(["accessLevel", "email"]);
  useEffect(() => {
    if (!["Administrator", "Registrar"].includes(cookies.accessLevel))
      return navigate("/", { replace: true });
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
        {...ComponentToPrintProps}
        ref={componentRef}
      />
    </div>
  );
};
export const loader = async ({ params }) => {
  const { class_code } = params;
  const { data } = await axiosInstance.get(
    `/admin/getClassCodeDetails?class_code=${class_code}`
  );

  const { data: students } = await axiosInstance.get(
    `/admin/getClassGraduateStudiesStudents?class_code=${class_code}`
  );
  return { data, students };
};

export default PrintGraduateStudiesGS;
