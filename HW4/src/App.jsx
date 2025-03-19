import { useState } from 'react'
import './App.css'
import TodoList from "./ToDoList";
import CompletedTodos from "./CompletedTodos";
import AddTodo from "./AddTodo";
import {v4 as uuid} from "uuid";

function App() {
  const [todoList, setTodoList] = useState([
    {id: uuid(), title: "Finish CS 554 Homework", description: "Professor Hill wants this assignment completed ASAP", due: "10/24/2024", completed: false},
    {id: uuid(), title: "Go for a walk", description: "You should probably touch grass", due: "9/9/2024", completed: false},
    {id: uuid(), title: "Make dinner", description: "Preferably something edible", due: "10/24/2024", completed: false},
    {id: uuid(), title: "Buy a Halloween costume", description: "Don't want to show up to the party without one", due: "10/30/2024", completed: false},
    {id: uuid(), title: "Get mom a birthday gift", description: "Flowers too!", due: "11/17/2024", completed: false},
    {id: uuid(), title: "Make class schedule", description: "For fall 2024 semester", due: "5/15/2024", completed: false},
    {id: uuid(), title: "Holiday gift list", description: "Make it easy for the family", due: "11/30/2024", completed: false},
    {id: uuid(), title: "Plan birthday", description: "Should I stay home or go out?", due: "1/6/2025", completed: false},
    {id: uuid(), title: "Move in to apartment", description: "Make sure to sweep the floors", due: "8/30/2024", completed: false},
    {id: uuid(), title: "Get a job", description: "Need to use that degree (hopefully)", due: "5/15/2025", completed: false}
  ]);

  function deleteTodo(id) {
    setTodoList((prevState) => prevState.filter(item => item.id !== id));
  }

  function toggleCompleted(todo) {
    console.log ("CLICK FIRED", todo.completed)
    setTodoList((prevState) => prevState.map(item =>
        {if (item.id === todo.id) {
            console.dir (item, item.completed, {depth: null})
            item.completed = !item.completed;
            return item;
        } else {
            return item;
    }}));
  }

  function addTodo(title, description, due) {
    let newTodo = {
        id: uuid(),
        title: title,
        description: description,
        due: due,
        completed: false
    }
    console.log(newTodo);
    setTodoList((prevState) => [...prevState, newTodo]);
  }

  return (
    <div>
        <h1>To Do List:</h1>
        <TodoList todoList = {todoList.filter(item => !item.completed)} toggleCompleted={toggleCompleted} deleteTodo={deleteTodo} />
        <h1>Completed Tasks:</h1>
        <CompletedTodos todoList = {todoList.filter(item => item.completed)} toggleCompleted={toggleCompleted} />  
        <h1>Add Task:</h1>
        <AddTodo addTodo={addTodo}/>
    </div>
  );
}

export default App
