import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import rootReducers from "../reducer/index";

const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducers);

let store = createStore(persistedReducer);
let persistor = persistStore(store);
export { persistor };
export default store;
