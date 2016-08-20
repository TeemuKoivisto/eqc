import { CALL_API } from "../middleware/grappaAPI";

export const COUNCILMEETING_GET_ALL_SUCCESS = "COUNCILMEETING_GET_ALL_SUCCESS";
export const COUNCILMEETING_GET_ALL_FAILURE = "COUNCILMEETING_GET_ALL_FAILURE";

export const COUNCILMEETING_SAVE_ONE_SUCCESS = "COUNCILMEETING_SAVE_ONE_SUCCESS";
export const COUNCILMEETING_SAVE_ONE_FAILURE = "CONCILMEETING_SAVE_ONE_FAILURE";

export const COUNCILMEETING_UPDATE_ONE_SUCCESS = "COUNCILMEETING_UPDATE_ONE_SUCCESS";
export const COUNCILMEETING_UPDATE_ONE_FAILURE = "COUNCILMEETING_UPDATE_ONE_FAILURE";

/**
* The action called get the data concerning all the councilmeetings from the database.
* @param FilterParams An object containing the filter for which dates to return.
* @return getCouncilmeetings The object containing the relevant information for the
* reducer to handle the data accordingly.
*/
export const getCouncilMeetings = (filterParams) => (
  {
    type: CALL_API,
    success: COUNCILMEETING_GET_ALL_SUCCESS,
    failure: COUNCILMEETING_GET_ALL_FAILURE,
    method: "get",
    url: "/councilmeeting",
    data: filterParams,
  }
);

/**
* The action called to add a councilmeeting to the database.
* @param Councilmeeting A object containing all the relevant information to create
* a new councilmeeting entry.
* @return Councilmeeting The object containing the relevant information for the
* reducer to handle the data accordingly.
*/
export const saveCouncilMeeting = (data) => (
  {
    type: CALL_API,
    flashMessage: {
      type: "warning",
      title: "Request sent",
      body: "Waiting for Councilmeeting to be saved.",
    },
    success: COUNCILMEETING_SAVE_ONE_SUCCESS,
    successMessage: {
      type: "success",
      title: "Success",
      body: "Councilmeeting was saved.",
    },
    failure: COUNCILMEETING_SAVE_ONE_FAILURE,
    method: "post",
    url: "/councilmeeting",
    data,
  }
);

export const updateCouncilMeeting = (data) => (
  {
    type: CALL_API,
    flashMessage: {
      type: "warning",
      title: "Request sent",
      body: "Waiting for Councilmeeting to be updated.",
    },
    success: COUNCILMEETING_UPDATE_ONE_SUCCESS,
    successMessage: {
      type: "success",
      title: "Success",
      body: "Councilmeeting was updated.",
    },
    failure: COUNCILMEETING_UPDATE_ONE_FAILURE,
    method: "put",
    url: `/councilmeeting/${data.id}`,
    data,
  }
);
