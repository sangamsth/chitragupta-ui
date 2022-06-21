import axios from "axios";
import {returnAlerts, returnErrors} from "./alertActions";

export const createSalary = (salary) => async (dispatch, getState) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/salaries.json`,
      {
        salary,
      },
      {
        headers: {
          Authorization: getState().auth.token,
        },
      },
    )
    dispatch(
      returnAlerts("Successfully created new salary", response.status, 'RECORD_CREATION_SUCCESS')
    )
  } catch (error) {
    dispatch(
      returnErrors(
        error.response && error.response.data,
        error.resposne && error.response.status,
      ),
    )
  }
}
