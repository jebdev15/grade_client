import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchRegistrarActivity } from '../features/home/index/registrarActivityThunks';

export const RegistrarActivityContext = React.createContext();
export const RegistrarActivityProvider = ({ children }) => {
  const data = useSelector((state) => state.registrarActivity.list);
  const error = useSelector((state) => state.registrarActivity.error);
  const status = useSelector((state) => state.registrarActivity.status);
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (status === "idle") {
      dispatch(fetchRegistrarActivity());
    }
  },[status,error,data, dispatch]);
  return (
    <RegistrarActivityContext.Provider
      value={{
        data,
        error,
        status
      }}
    >
      {children}
    </RegistrarActivityContext.Provider>
  )
}