import axios from 'axios';
export const updateRegistrarActivityStatus = async () => {
    await axios.get(`${process.env.REACT_APP_API_URL}/updateRegistrarActivityStatus`);
}

export const checkRegistrarActivityDueDate = (dueDate) => {
    const currentDate = new Date();
    const dueDateObj = new Date(dueDate);
    if (dueDateObj < currentDate) {
        // console.log({
        //     message: "Due date has passed",
        //     currentDate: currentDate,
        //     dueDateObj,
        // });
        return true;
    } else {
        // console.log({
        //     message: "Due date has not passed",
        //     currentDate: currentDate,
        //     dueDateObj,
        // });
        return false;
    }
}

