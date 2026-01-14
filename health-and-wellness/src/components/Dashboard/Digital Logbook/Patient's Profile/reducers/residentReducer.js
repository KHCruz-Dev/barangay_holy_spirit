export const RESIDENT_ACTIONS = {
  SET_FIELD: "SET_FIELD",
  SET_MANY: "SET_MANY",
  RESET: "RESET",
};

export function residentReducer(state, action) {
  switch (action.type) {
    case RESIDENT_ACTIONS.SET_FIELD:
      return {
        ...state,
        [action.field]: action.value,
      };

    case RESIDENT_ACTIONS.SET_MANY:
      return {
        ...state,
        ...action.payload,
      };

    case RESIDENT_ACTIONS.RESET:
      return action.payload;

    default:
      return state;
  }
}
