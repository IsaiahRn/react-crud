import axios from 'axios';
import React from 'react';
import './App.css';
import ListItem from './ListItems';
import loadingGif from './loading.gif'

class App extends React.Component {

  constructor(){
    super();
    this.state = {
      newTodo: '',
      editing: false,
      editingIndex: null,
      notification: null,
      todos: [],
      loading: true
    };

    this.apiUrl = 'https://5d583acf91a96a0014758c84.mockapi.io';
    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.alert = this.alert.bind(this);
  }

  async componentDidMount(){
    const response = await axios.get(`${this.apiUrl}/todos`);
    setTimeout(() => {
      this.setState({
        todos: response.data,
        loading: false
      });
    }, 1000);
  }



  handleChange(event) {
    this.setState({
      newTodo: event.target.value
    });
  }

  async addTodo(){

    const response = await axios.post(`${this.apiUrl}/todos`, {
      name: this.state.newTodo
    });

    const oldTodos = this.state.todos;
    oldTodos.push(response.data);

    this.setState({
      todos: oldTodos,
      newTodo: ''
    });
    this.alert('Todo added successfully.')
  }

  editTodo(index){
    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index
    });
  }

  async updateTodo(index){
    const todo = this.state.todos[this.state.editingIndex];

    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {
      name: this.state.newTodo
    });

    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;

    this.setState({ todos, editing: false, editingIndex: null, newTodo: '' });
    this.alert('Todo updated successfully.')
  }

  async deleteTodo(index){
    const todos = this.state.todos;
    const todo = todos[index];

    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);

    delete todos[index];

    this.setState({ todos });
    this.alert('Todo deleted successfully.');
  }

  alert(notification){
    this.setState({
    notification
    });
    setTimeout(() => {
      this.setState({
        notification: null
      });
    }, 2000);
  }

  render(){
  return (
    <div className="App">
      <div className="container">
        <h2 className="text-center my-4">Todos App</h2>
        {
          this.state.notification && 
          <div className="alert mt-3 alert-success">
          <p className="text-center">{this.state.notification}</p>
          </div>
        }
        <input type="text" name="todo" value={this.state.newTodo} className="p-4 form-control" placeholder="Add a new todo" onChange={this.handleChange}/>
        <button onClick={this.state.editing ? this.updateTodo : this.addTodo} className="btn-success mb-3 form-control" disabled={this.state.newTodo.length < 5}>
         {this.state.editing ? 'Update Todo' : 'Add Todo'}
        </button>
        {
          this.state.loading && 
          <img src={loadingGif} alt=""/>
        }
       {
         (!this.state.editing || this.state.loading) && 
         <ul className="list-group">
         {this.state.todos.map((item, index) => {
           return <ListItem 
           key={item.id}
           item={item}
           editTodo={() => {this.editTodo(index); }}
           deleteTodo={() => {this.deleteTodo(index)}}
           />;
         })}
       </ul>
       }
      </div>
    </div>
  );
  }
}

export default App;
