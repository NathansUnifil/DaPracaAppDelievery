import React, { createContext, useContext, useReducer } from "react";
const CartstateContext = createContext();
const CartDispatchContext = createContext();
const reducer = (state, action) => {
  switch (action.type) {
    case "Add":
      return [
        ...state,
        {
          id: action.id,
          name: action.name,
          qty: action.qty,
          size: action.size,
          price: action.price,
          img: action.img,
        },
      ];
    case "REMOVE":
      let newArr = [...state];
      newArr.splice(action.index, 1);
      return newArr;

    case "DROP":
      let empArray = [];
      return empArray;
    default:
      console.log("Error in Reducer");
  }
};
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartstateContext.Provider value={state}>
        {children}
      </CartstateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartstateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
