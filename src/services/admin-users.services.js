import axios from "axios";

export const getColleges = async () => {
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getColleges`);
    return { data, status };
}

export const createUserServices = async (createUserData, cookies) => {
    const formData = new FormData();
    formData.append('emailAddress', createUserData.emailAddress)
    formData.append('college_code', createUserData.college_code)
    formData.append('program_code', createUserData.program_code)
    formData.append('facultyId', createUserData.facultyId)
    formData.append('accessLevel', createUserData.accessLevel)
    formData.append('emailUsed', cookies.email)
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/createUser`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return { data }
}
export const updateAccountServices = async (updateAccountData, cookies, updateDataToCheck) => {
    const { email } = cookies;
    const formData = new FormData();
      formData.append('id', updateAccountData.id)
      formData.append('email', updateAccountData.email)
      formData.append('college_code', updateAccountData.college_code)
      formData.append('faculty_id', updateAccountData.faculty_id)
      formData.append('accessLevel', updateAccountData.accessLevel)
      formData.append('status', updateAccountData.status)
      formData.append('emailUsed', email)
      formData.append('dataToCheck', JSON.stringify(updateDataToCheck))
      formData.append('program_code', updateAccountData.program_code)


      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/updateAccount`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return { data }
}