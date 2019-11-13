export const UPDATE_ACCOUNT_ACTION = "UpdateAccountAction";
export const ALL_EVENTS_ACTION = "AllEventsAction";
export const ADD_EVENT_ACTION = "AddEventAction";
export const UPDATE_FILTER_ACTION = "UpdateFilterAction";
export const UPDATE_CENTER_ACTION = "UpdateCenterAction";
export const UPDATE_ZOOM_ACTION = "UpdateZoomAction";

export function updateAccount(account) {
  console.log("account: ", account);
  return {
    type: UPDATE_ACCOUNT_ACTION,
    payload: account
  };
}

export function updateEvents(events: any) {
  return {
    type: ALL_EVENTS_ACTION,
    payload: events
  };
}

export function addEvent(event: any) {
  return {
    type: ADD_EVENT_ACTION,
    payload: event
  };
}

export function updateCenter(center: any) {
  return {
    type: UPDATE_CENTER_ACTION,
    payload: center
  };
}

export function updateZoom(zoom: any) {
  return {
    type: UPDATE_CENTER_ACTION,
    payload: zoom
  };
}
