const input = document.querySelector(".todoInput");
const form = document.querySelector("#todoForm");
const list = document.querySelector(".todoList");
const searchInput = document.querySelector(".searchInput");
const clearTodosBtn = document.querySelector(".clearAllTodosBtn");

let todos = [];
let dragStartTodoIndex;

form.addEventListener("submit", submitTodo);
document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
searchInput.addEventListener("keyup", filterTodo);
clearTodosBtn.addEventListener("click", clearAllTodos);

function loadAllTodosToUI() {
  todos = getTodosFromLS();
  addTodosToList();
}
function filterTodo(e) {
  let filterValue = e.target.value.toLowerCase();
  let listItems = document.querySelectorAll(".todo");

  listItems.forEach((todo) => {
    let todoValue = todo.textContent.trim();

    if (todoValue.indexOf(filterValue) === -1) {
      todo.classList.add("displayNone");
    } else {
      todo.classList.remove("displayNone");
    }
  });
}
function submitTodo(e) {
  e.preventDefault();
  const inputValue = input.value;

  // bir fazlasını ekleme yöntemi
  // todos.length == 0 ? 0 : todos[todos.length - 1].id + 1
  let todoObj = {
    id: new Date().getTime(),
    value: inputValue,
    isDone: false,
  };

  todos?.push(todoObj);

  if (input.value !== "") {
    addTodosToList();
  }

  input.value = "";
}

function addTodosToList() {
  list.innerHTML = todos
    ?.map(
      (todo, index) =>
        `
        <li draggable="true"
            ondragstart="onItemDragStart(${index})" 
            ondragover="onItemDragOver(event)" 
            ondrop="onItemDragDrop(event,${index})"
            ondragenter="onItemDragEnter(event)"
            ondragleave="onItemDragLeave(event)"
            class="todo" 
            id=${todo.id}>
                <span class="draggable ${todo.isDone && "checked"}">${
          todo.value
        }</span>
                 <div class="icons">
                     <i class="fa-solid fa-trash-can deleteIcon" 
                        onClick="removeTodoFromList(${todo.id})">
                     </i>
                     <input 
                        ${todo.isDone ? "checked" : ""} 
                        type="checkbox" 
                        class="checkBtn"
                        onClick="changeCheck(event,${todo.id})"
                      >
                 </div>  
        </li>`
    )
    .join("");

  addTodosToLS();
}

function onItemDragStart(index) {
  dragStartTodoIndex = index;
}

function onItemDragOver(e) {
  e.preventDefault();
}

function onItemDragEnter(e) {
  e.target.classList.add("over");
}

function onItemDragLeave(e) {
  e.target.classList.remove("over");
}

function onItemDragDrop(e, dragStartDropIndex) {
  e.stopImmediatePropagation();
  [todos[dragStartTodoIndex], todos[dragStartDropIndex]] = [todos[dragStartDropIndex], todos[dragStartTodoIndex]]; // prettier-ignore
  addTodosToList();
}

function changeCheck(e, id) {
  const isChecked = e.target.checked;
  const todoWillChange = todos.find((todo) => todo.id === id);
  todoWillChange.isDone = isChecked;
  addTodosToList();
}

function removeTodoFromList(id) {
  todos = todos.filter((todo) => todo.id !== id);
  addTodosToList();
}

function getTodosFromLS() {
  let todos;

  if (localStorage.getItem("todos")) {
    todos = JSON?.parse?.(localStorage.getItem("todos"));
  }

  return todos;
}

function addTodosToLS() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function clearAllTodos() {
  localStorage.setItem("todos", []);
  todos = [];
  addTodosToList();
}
