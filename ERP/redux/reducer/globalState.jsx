const initialState = {
  // role: "user",
  // Employee_id: "ED250221SAI1603",
  // email: "shaiksaidavali022@gmail.com",
};
const globalState = (state = initialState, action) => {
  switch (action.type) {
    case "login": {
      return {
        ...state,
        Employee_id: action.payload.employee_id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        role: action.payload.role,
        user_name: action.payload.username,
        department: action.payload.department,
        profile_img: action.payload.passportSizePhoto,
      };
    }
    case "available_status": {
      return {
        ...state,
        available_status: action.payload.available_status,
      };
    }
    case "logout": {
      return "";
    }
    default:
      return state;
  }
};
export default globalState;
