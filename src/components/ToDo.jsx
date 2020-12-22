import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Divider } from 'antd';
import { ToDoItem } from './ToDoItem';
import { ToDoForm } from './ToDoForm';

const token = 'c18ef9b793575cacdc751bbbeb32be8fe0f0c33a';
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

export const ToDo = () => {
  const [todos, setTodos] = useState([]);
  useEffect(async () => {
    const result = await axios.get(
      'https://api.todoist.com/rest/v1/tasks',
      config
    );

    setTodos(result.data);
  }, []);

  const [idCount, setIdCount] = useState(10);

  const renderTodoItems = (todos) => {
    return (
      <ul className="todo-list">
        { todos.map(todo => <ToDoItem 
            key={todo.id}
            item={todo}
            onRemove={onRemove} 
            onCheck={onCheck} 
          />) }
      </ul>
    )
  }

  const onRemove = (id) => {
    const index = todos.findIndex(todo => todo.id === id);

    if (index !== -1) {
      axios.delete(
        `https://api.todoist.com/rest/v1/tasks/${id}`,
        config
      );
      todos.splice(index, 1);
      setTodos([...todos]);
    }
  }

  //Extra task
  const onCheck = (id) => {
    const index = todos.findIndex(todo => todo.id === id);

    if (index !== -1) {
      const todo = todos[index];

      todo.checked = !todo.checked;

      axios.post(
        `https://api.todoist.com/rest/v1/tasks/${id}/close`,
        todo,
        config
      );

      todos.splice(index, 1, todo);
      setTodos([...todos]);
    }
  }

  const onChange = async (id) => {
    const index = todos.findIndex(todo => todo.id === id);
      
    if (index !== -1) {
      const todo = todos[index];
        
      await axios.post(
        `https://api.todoist.com/rest/v1/tasks/${id}`,
        todo,
        config
      );
      
      todos.splice(index, 1, todo);
      setTodos([...todos]);
    }
  }


  const onSubmit = async (content) => {
    const todo = { content };

    const { data } = await axios.post(
      `https://api.todoist.com/rest/v1/tasks`,
      todo,
      config
    );

    setTodos([...todos, {...todo, id: data.id}]);
  }

const renderItems = (todos) => {
    return (
        <ul className='todo-list'>
            { todos.map(todo => {
                return (
                    <ToDoItem item={todo} onCheck={onCheck} onRemove={onRemove} onChange={onChange} />
                )
            }) }
        </ul>
    )
}

return (
    <Card title={'My todo list'}>
        <ToDoForm onSubmit={onSubmit}/>
        {
            renderItems(todos)
        }
    </Card>
)

}
