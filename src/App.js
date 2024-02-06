import { useReducer } from "react";

import "./style.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate"
}

const evaluate = ({ curOperand, prevOperand, operation }) => {
  const prev = parseFloat(prevOperand);
  const current = parseFloat(curOperand);
  if(isNaN(prev) || isNaN(current)) return "";
  let result = "";
  switch(operation) {
    case "+": 
      result = prev + current;
      break;
    case "-": 
      result = prev - current;
      break; 
    case "*": 
      result = prev * current;
      break;
    case "/": 
      result = prev / current;
      break;
    default: 
      break;
  }

  return result.toString();
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          curOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === "0" && state.curOperand === "0") return state;
      if(payload.digit === "." && state.curOperand.includes(".")) return state;
      
      return {
        ...state,
        curOperand: `${state.curOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CLEAR: 
      return {}    
    case ACTIONS.CHOOSE_OPERATION: 
      if(state.curOperand == null && state.prevOperand == null) return state;
      
      if(state.curOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if(state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.curOperand,
          curOperand: null
        }
      }
      
      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        curOperand: null
      }
    case ACTIONS.EVALUATE: 
      if(
        state.operation == null || 
        state.curOperand == null || 
        state.prevOperand == null 
      ) return state;

      return {
        ...state,
        overwrite: true,
        curOperand: evaluate(state),
        prevOperand: null,
        operation: null
      }
    case ACTIONS.DELETE_DIGIT: 
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          curOperand: null
        }
      }

      if(state.curOperand == null) return state;
      if(state.curOperand.length === 1 ) {
        return {
          ...state,
          curOperand: null
        }
      }

      return {
        ...state,
        curOperand: state.curOperand.slice(0, -1)
      }
    default: 
      throw new Error("This action is invalid");
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("vn-VN", {
  maximumFractionDigits: 0
});

const formatOperand = (operand) => {
  if(operand == null) return;
  const [integer, decimal] = operand.split(".");
  if(decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

const App = () => {
  const [{ curOperand, prevOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-openrand">{formatOperand(prevOperand)} {operation}</div>
        <div className="current-openrand">{formatOperand(curOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})} >AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton dispatch={dispatch} operation="/"></OperationButton>
      <DigitButton dispatch={dispatch} digit="1"></DigitButton>
      <DigitButton dispatch={dispatch} digit="2"></DigitButton>
      <DigitButton dispatch={dispatch} digit="3"></DigitButton>
      <OperationButton dispatch={dispatch} operation="*"></OperationButton>
      <DigitButton dispatch={dispatch} digit="4"></DigitButton>
      <DigitButton dispatch={dispatch} digit="5"></DigitButton>
      <DigitButton dispatch={dispatch} digit="6"></DigitButton>
      <OperationButton dispatch={dispatch} operation="+"></OperationButton>
      <DigitButton dispatch={dispatch} digit="7"></DigitButton>
      <DigitButton dispatch={dispatch} digit="8"></DigitButton>
      <DigitButton dispatch={dispatch} digit="9"></DigitButton>
      <OperationButton dispatch={dispatch} operation="-"></OperationButton>
      <DigitButton dispatch={dispatch} digit="."></DigitButton>
      <DigitButton dispatch={dispatch} digit="0"></DigitButton>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App;