import { useState } from "react";

const useFeatureState = () => {
  const [state, setState] = useState({
    data: [],
    open: false,
    handleClose: () => setState((prevState) => ({ ...prevState, open: false })),
    loading: false
  });
  return [state, setState];
}

export const useUploadFeatureState = () => {
  const [state, setState] = useState({
    file: null,
    loading: false,
    openSnackbar: false,
    error: false,
    status: false,
    message: "",
  });
  return [state, setState];
}

export const useEncodedFeatureState = () => {
  const [state, setState] = useState({
    rows: [],
    toUpdate: [],
    updatedCount: null,
    loading: false,
    openSnackbar: false,
    error: false,
    status: false,
    message: "",
  });
  return [state, setState];
}

export default useFeatureState;
