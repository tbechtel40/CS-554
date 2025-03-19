/* eslint-disable react/prop-types */

function ToDoList({todoList, toggleCompleted, deleteTodo}) {
    let date = new Date();
    date.setHours(0, 0, 0, 0);

    return (
        <div>
            {todoList.map(item => 
                <div key = {"Incomplete" + item.id}>
                <h1 className={Date.parse(date) > Date.parse(item.due) ? "red": ""}>{item.title}</h1>
                <p>{item.description}</p>
                <p className={Date.parse(date) > Date.parse(item.due) ? "red": ""}>Due Date: {item.due}</p>
                <p>Completed: No</p>
                <button onClick={() => deleteTodo(item.id)}>Delete</button> 
                <button onClick={() => toggleCompleted(item)}>Complete</button>
                </div>
            )}
        </div>
        );
}

export default ToDoList;