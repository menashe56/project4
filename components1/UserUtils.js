// UserUtils.js
let user_email = '';
let isModalVisible = false;
let setModalVisible = false;

export const setisModalVisible = (object) => {
    isModalVisible = object;
};

export const setsetModalVisible = (object) => {
    setModalVisible = object;
};

export const setUserEmail = (object) => {
    user_email = object;
};

export const getUserEmail = () => user_email;
export const getmodalVisible = () => setModalVisible;
export const getisModalVisible = () => isModalVisible;
