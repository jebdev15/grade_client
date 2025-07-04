import { useState } from "react";

const useFeatureState = () => {
  const [state, setState] = useState({
    data: [],
    open: false,
    handleClose: () => setState((prevState) => ({ ...prevState, open: false })),
    loading: false
  });
  return [state, setState];
};

export default useFeatureState;
