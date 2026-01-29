export const ID_CARDS_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  UPDATE: "UPDATE",
  RESET: "RESET",

  SET_ALL: "SET_ALL",
};

export const createEmptyIdCard = () => ({
  idTypeId: null,
  idNumber: "",
});

export const idCardsInitialState = [];

export function identificationCardsReducer(state, action) {
  switch (action.type) {
    case ID_CARDS_ACTIONS.ADD:
      return [...state, action.payload ?? { idTypeId: null, idNumber: "" }];

    case ID_CARDS_ACTIONS.REMOVE:
      return state.length === 1
        ? state
        : state.filter((_, i) => i !== action.index);

    case ID_CARDS_ACTIONS.UPDATE:
      return state.map((card, i) =>
        i === action.index ? { ...card, [action.field]: action.value } : card,
      );

    case ID_CARDS_ACTIONS.RESET:
      return idCardsInitialState;

    case ID_CARDS_ACTIONS.SET_ALL:
      return Array.isArray(action.payload) && action.payload.length
        ? action.payload
        : idCardsInitialState;

    default:
      return state;
  }
}
