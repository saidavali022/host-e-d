const initialstate = { role: "admin", count: 1000 };
const changeNumber = (state = initialstate, action) => {
  switch (action.type) {
    case "Increment":
      return { ...initialstate, count: state.count + 1 };
    case "Decrement":
      return state.count - 1;
    default:
      return state;
  }
};
export default changeNumber;
