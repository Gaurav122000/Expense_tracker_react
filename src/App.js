import { useState, useReducer, useEffect } from "react";
import "./App.css";

// components imports
import ExpenseForm from "./components/ExpenseForm/ExpenseForm";
import ExpenseInfo from "./components/ExpenseInfo/ExpenseInfo";
import ExpenseList from "./components/ExpenseList/ExpenseList";

// react toasts
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//firebase methods
import {db} from "./firebase-init";
import { doc, collection, addDoc, setDoc, onSnapshot, deleteDoc, getDocs } from "firebase/firestore"; 

const reducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case "GET_EXPENSES": { //for showing
      return {
        expenses: payload.expenses
      };
    }
    case "ADD_EXPENSE": {
      return {
        expenses: [payload.expense, ...state.expenses]
      };
    }
    case "REMOVE_EXPENSE": {
      return {
        expenses: state.expenses.filter((expense) => expense.id !== payload.id)
      };
    }
    case "UPDATE_EXPENSE": {
      const expensesDuplicate = state.expenses;
      expensesDuplicate[payload.expensePos] = payload.expense;
      return {
        expenses: expensesDuplicate
      };
    }
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, { expenses: [] });
  const [expenseToUpdate, setExpenseToUpdate] = useState(null);

  // const getData = async () => {
  //   // expenses from firestore in realtime
  //   const unSub = onSnapshot(collection(db, "expenses"), (snapshot) => {
  //     const expenses = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  //     dispatch({ type: "GET_EXPENSES", payload: { expenses } });
  //     toast.success("Expenses retrived successfully.");
  //   });
  // };
  
  const getData = async () => {
    const snapshot = await getDocs(collection(db, "expenses"));
    console.log(snapshot);
    const expenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    dispatch({ type: "GET_EXPENSES", payload: { expenses } });
    toast.success("Expenses retrived successfully.");
  };

  useEffect(() => {
    getData();
  }, []);


    // Function to add an expense document
    const addExpense = async (expense) => {
      const expenseRef = collection(db, "expenses");
      const docRef = await addDoc(expenseRef, expense);
  
      dispatch({
        type: "ADD_EXPENSE",
        payload: { expense: { id: docRef.id, ...expense } }
      });
      toast.success("Expense added successfully.");
    };

    const deleteExpense = async (id) => {
      // delete expense from firestore 
      await deleteDoc(doc(db, "expenses", id));
      dispatch({ type: "REMOVE_EXPENSE", payload: { id } });
      toast.success("Expense deleted successfully.");
    };

  const resetExpenseToUpdate = () => {
    setExpenseToUpdate(null);
  };
  // For Update
  const updateExpense = async (expense) => {
    const expensePos = state.expenses
      .map(function (exp) {
        return exp.id;
      })
      .indexOf(expense.id);

    if (expensePos === -1) {
      return false;
    }

    const expenseRef = doc(db, "expenses", expense.id);
    await setDoc(expenseRef, expense);

    dispatch({ type: "UPDATE_EXPENSE", payload: { expensePos, expense } });
    toast.success("Expense updated successfully.");
  };

  return (
    <>
      <ToastContainer />
      <h2 className="mainHeading">Expense Tracker</h2>
      <div className="App">
        <ExpenseForm
          addExpense={addExpense}
          expenseToUpdate={expenseToUpdate}
          updateExpense={updateExpense}
          resetExpenseToUpdate={resetExpenseToUpdate}
        />
        <div className="expenseContainer">
          <ExpenseInfo expenses={state.expenses} />
          <ExpenseList
            expenses={state.expenses}
            deleteExpense={deleteExpense}
            changeExpenseToUpdate={setExpenseToUpdate}
          />
        </div>
      </div>
    </>
  );
}

export default App;
