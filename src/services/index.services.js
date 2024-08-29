import axiosInstance from '../api/axiosInstance';
export const updateRegistrarActivityStatus = async () => {
    await axiosInstance.get(`/updateRegistrarActivityStatus`);
}

export const checkRegistrarActivityDueDate = (dueDate) => {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    if (dueDateObj < currentDate) {
        return true;
    } else {
        return false;
    }
}

export const authenticationProcess = async (email) => {
    const { data, status } = await axiosInstance.get(`/login?email=${email}`);
    return { data, status };
}