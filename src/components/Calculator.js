import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Calculator.scss";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState([]);
  const [prevNumber, setPrevNumber] = useState(null);
  const [operation, setOperation] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/calculations"
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const deleteHistoryItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/calculations/${id}`);
      fetchHistory();
    } catch (error) {
      console.error("Error deleting history item:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete("http://localhost:5000/api/calculations");
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const saveCalculation = async (expression, result) => {
    try {
      await axios.post("http://localhost:5000/api/calculations", {
        expression,
        result: parseFloat(result),
      });
      fetchHistory();
    } catch (error) {
      console.error("Error saving calculation:", error);
    }
  };

  const handleNumber = (number) => {
    if (display === "0") {
      setDisplay(number);
    } else {
      setDisplay(display + number);
    }
  };

  const handleOperation = (op) => {
    setPrevNumber(parseFloat(display));
    setOperation(op);
    setDisplay("0");
  };

  const calculate = async () => {
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case "+":
        result = prevNumber + current;
        break;
      case "-":
        result = prevNumber - current;
        break;
      case "*":
        result = prevNumber * current;
        break;
      case "/":
        result = current !== 0 ? prevNumber / current : "Error";
        break;
      default:
        return;
    }

    const finalEquation = `${prevNumber} ${operation} ${current} = ${result}`;
    setDisplay(result.toString());
    setOperation(null);
    setPrevNumber(null);

    await saveCalculation(finalEquation, result);
  };

  const clear = () => {
    setDisplay("0");
    setPrevNumber(null);
    setOperation(null);
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="main-calculator">
          <div className="display">
            <div className="current-value">{display}</div>
          </div>
          <div className="keypad">
            <button onClick={clear}>C</button>
            <button onClick={() => handleOperation("/")}>/</button>
            <button onClick={() => handleOperation("*")}>×</button>
            <button onClick={() => handleOperation("-")}>-</button>

            <button onClick={() => handleNumber("7")}>7</button>
            <button onClick={() => handleNumber("8")}>8</button>
            <button onClick={() => handleNumber("9")}>9</button>
            <button onClick={() => handleOperation("+")}>+</button>

            <button onClick={() => handleNumber("4")}>4</button>
            <button onClick={() => handleNumber("5")}>5</button>
            <button onClick={() => handleNumber("6")}>6</button>

            <button onClick={() => handleNumber("0")}>0</button>

            <button onClick={() => handleNumber("1")}>1</button>
            <button onClick={() => handleNumber("2")}>2</button>
            <button onClick={() => handleNumber("3")}>3</button>

            <button onClick={() => handleNumber(".")}>.</button>
            <button onClick={calculate} className="equals">
              =
            </button>
          </div>
        </div>

        <div className="history-panel">
          <h3>History</h3>
          <div className="history-list">
            {history.map((calc, index) => (
              <div key={calc._id || index} className="history-item">
                <span className="expression">{calc.expression}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteHistoryItem(calc._id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {history.length > 0 && (
            <button className="clear-history" onClick={clearHistory}>
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
