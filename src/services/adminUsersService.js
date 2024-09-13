import axiosInstance from "../api/axiosInstance";

export const AdminUsersService = { 
  createUser: async (createUserData) => {
    const formData = new FormData();
    formData.append('emailAddress', createUserData.emailAddress)
    formData.append('college_code', createUserData.college_code)
    formData.append('program_code', createUserData.program_code)
    formData.append('facultyId', createUserData.facultyId)
    formData.append('accessLevel', createUserData.accessLevel)
    const { data } = await axiosInstance.post(`/admin/createUser`, formData)
    return { data }
  }, 
  updateUser: async (updateAccountData, updateDataToCheck) => {
    const formData = new FormData();
    formData.append('id', updateAccountData.id)
    formData.append('email', updateAccountData.email)
    formData.append('college_code', updateAccountData.college_code)
    formData.append('faculty_id', updateAccountData.faculty_id)
    formData.append('accessLevel', updateAccountData.accessLevel)
    formData.append('status', updateAccountData.status)
    formData.append('dataToCheck', JSON.stringify(updateDataToCheck))
    formData.append('program_code', updateAccountData.program_code)
    const { data } = await axiosInstance.put(`/admin/updateUser`, formData)
    return { data }
  }
}