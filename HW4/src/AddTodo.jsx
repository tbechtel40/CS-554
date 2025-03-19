/* eslint-disable react/prop-types */

import { useState } from "react";

function AddTodo({addTodo}) {
    const [error, setError] = useState('');
    let date = new Date();
    date.setDate(date.getDate() - 1);

    function handleSubmit(e) {
        e.preventDefault();
    
        const form = e.target;
        const formData = new FormData(form);
    
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);

        let title = formJson.title;
        let description = formJson.description;
        let due = formJson.due;

        // check if any fields don't have values
        if (!title || !description || !due) {
            setError("All fields must have values that are not empty.");
            throw "All fields must have values that are not empty."
        }

        // check title field
        if (typeof title !== 'string') {
            setError("Title must be a string.");
            throw "Title must be a string.";
        }
            
        title = title.trim();
        if (title.length < 5) {
            setError("Title must have at least 5 characters, and must not be a string of just spaces.");
            throw "Title must have at least 5 characters, and must not be a string of just spaces.";
        }

        // check description field
        if (typeof description !== 'string') {
            setError("Description must be a string.");
            throw "Description must be a string.";
        }
            
        description = description.trim();
        if (description.length < 25) {
            setError("Description must have at least 25 characters, and must not be a string of just spaces.");
            throw "Description must have at least 25 characters, and must not be a string of just spaces.";
        }

        // check due field
        if (typeof due !== 'string') {
            setError("Due must be a string.");
            throw "Due must be a string.";
        }

        let newDate = due.split("-");
        let finalDue = newDate[1] + "/" + newDate[2] + "/" + newDate[0];

        console.log(finalDue);

        setError("");
        addTodo(title, description, finalDue);
        form.reset();
      }


    return (
        <div>
            <div className="red">
                {error && <p>{error}</p>}
            </div>
            <form method="post" onSubmit={handleSubmit}>
                <label>
                    Task title: <input name="title" type="text"></input>
                </label>
                <br/>
                <label>
                    Task description: <input name="description" type="textarea"></input>
                </label>
                <br/>
                <label>
                    Due date: <input name="due" type="date" min={date.toISOString().split("T")[0]}></input>
                </label>
                <br/>
                <button type="submit">Submit</button>
            </form>
        </div>
        );
}

export default AddTodo;