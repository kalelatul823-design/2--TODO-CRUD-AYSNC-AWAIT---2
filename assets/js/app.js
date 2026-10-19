let cl = console.log;

const form = document.getElementById("form");
const spinner = document.getElementById("spinner");
const todoContainer = document.getElementById("todoContainer");
const todoItemControl = document.getElementById("todoItem");
const descriptionControl = document.getElementById("description");
const isCompletedControl = document.getElementById("isCompleted");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

let BASE_URL =
  "https://async-await-fetch-ddfb2-default-rtdb.asia-southeast1.firebasedatabase.app";

let TODO_URL = `${BASE_URL}/todo2.json`;

//spinner
function handleSpinner() {
  spinner.classList.toggle("d-none");
}

//snackBar
function snackBar(msg, icon) {
  Swal.fire({
    title: msg,
    icon: icon,
    timer: 3000,
  });
}

//state
let state = {
  todoArr: [],
  editId: null,
};

//objToArr
function objToArr(obj) {
  let arr = Object.entries(obj);
  let arr2 = arr.map((todo) => {
    todo[1].id = todo[0];
    state.todoArr.push(todo[1]);
    // cl(state.todoArr);
  });
}

//read
async function showUi() {
  handleSpinner();
  try {
    let res = await fetch(TODO_URL, {
      method: "GET",
      body: null,
      headers: {
        "content-type": "application/json",
        Authrization: "JTW TOKEN",
      },
    });
    let data = await res.json();
    cl(data);
    objToArr(data);
    //    cl(state.todoArr)
    templetingUi(state.todoArr);
  } catch (err) {
    snackBar("Something went wrong");
  } finally {
    handleSpinner();
  }
}

//templeting
function templetingUi(arr) {
  let result = "";
  arr.forEach((ele) => {
    result += `<li class="list-group-item" id="${ele.id}">
                  <div class="d-flex justify-content-between" onclick="toggleDescription(this)">
                    <div>
                      ${ele.isCompleted ? `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)" checked>` : `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)">`}
                      <strong>${ele.todoItem}</strong>
                    </div>
                    <div>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoEdit(this);
                        "
                        class="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoRemove(this);
                        "
                        class="btn btn-sm btn-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div class="collapse">
                    <div class="card-body">
                       ${ele.description}
                     
                    </div>
                  </div>
                </li>`;
  });
  todoContainer.innerHTML = result;
}

showUi();

//create
async function onAddTodo(eve) {
  eve.preventDefault();
  try {
      let newObj = {
          todoItem: todoItemControl.value,
          description: descriptionControl.value,
          isCompleted: isCompletedControl.value === "yes" ? true : false,
        };
        handleSpinner()
   let res = await fetch(TODO_URL, {
      method: "POST",
      body: JSON.stringify(newObj),
      headers: {
        "content-type": "application/json",
        Authrization: "JWT TOKEN",
      },
    });
    if(!res.ok){
        throw new Error()
    }
    let data = await res.json();
    cl(data)
    newObj.id = data.name;
    state.todoArr.push(newObj)
    let li =  document.createElement("li");
    li.id = newObj.id;
    li.className = `list-group-item`
    li.innerHTML = ` <div class="d-flex justify-content-between" onclick="toggleDescription(this)">
                    <div>
                      ${newObj.isCompleted ? `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)" checked>` : `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)">`}
                      <strong>${newObj.todoItem}</strong>
                    </div>
                    <div>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoEdit(this);
                        "
                        class="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoRemove(this);
                        "
                        class="btn btn-sm btn-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div class="collapse">
                    <div class="card-body">
                       ${newObj.description}
                      
                    </div>
                  </div>`
                  todoContainer.append(li);
                  form.reset()
  } catch {
    snackBar("Something went wrong")
  } finally {
    handleSpinner()
  }
}

//edit
function onTodoEdit(ele){
    let editId = ele.closest("li").id;
    cl(editId)
    state.editId = editId;
    let editObj = state.todoArr.find(ele => ele.id === editId);
    todoItemControl.value = editObj.todoItem;
    descriptionControl.value = editObj.description;
    isCompletedControl.value = editObj.isCompleted ? "yes" : "no";
    
    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}


//update
async function onUpdateTodo(){
   try{
     let updateId = state.editId;
    let UPDATE_URL = `${BASE_URL}/todo2/${updateId}.json`;
    let updateObj = {
         todoItem: todoItemControl.value,
          description: descriptionControl.value,
          isCompleted: isCompletedControl.value === "yes" ? true : false,
          id : updateId
    }
    handleSpinner()
 let res =  await fetch(UPDATE_URL,{
        method : "PATCH",
        body : JSON.stringify(updateObj),
        headers : {
            "content-type" : "application/json",
            "authrization" : "JWT TOKEN"
        }
    })
 let data = await res.json();
 cl(data)
      let getIndex = state.todoArr.findIndex(ele => ele.id === updateId);
      state.todoArr[getIndex] = updateObj;

      let li = document.getElementById(updateId);
      li.innerHTML = `<div class="d-flex justify-content-between" onclick="toggleDescription(this)">
                    <div>
                      ${updateObj.isCompleted ? `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)" checked>` : `<input type="checkbox" onclick="event.stopPropagation(); onCheck(this)">`}
                      <strong>${updateObj.todoItem}</strong>
                    </div>
                    <div>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoEdit(this);
                        "
                        class="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoRemove(this);
                        "
                        class="btn btn-sm btn-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div class="collapse">
                    <div class="card-body">
                       ${updateObj.description}
                     
                    </div>
                  </div>`
                  form.reset()
                  state.editId = null
                  updateBtn.classList.add("d-none");
                  submitBtn.classList.remove("d-none")
   }catch {
    snackBar("something went wrong")
   }
   finally{
    handleSpinner()
   }
}

//remove
async function onTodoRemove(ele){
    let removeId = ele.closest("li").id;
  let result = await Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
})
  if (result.isConfirmed){
    handleSpinner()
     try{
       let REMOVE_URL = `${BASE_URL}/todo2/${removeId}.json`
      let res = await fetch(REMOVE_URL,{
        method : "DELETE",
        body : null,
        headers :{
            "content-type" : "application/json",
            "authrization" : "JWT TOKEN"
        }
       })
       let data = await res.json();
       cl(data);
       let getIndex = state.todoArr.findIndex(ele => ele.id === removeId)
       state.todoArr.splice(getIndex, 1);
       ele.closest("li").remove()
     }
     catch{
      snackBar("something went wrong")
     }
     finally{
       handleSpinner()
     }
  }

}


//onCheck
async function onCheck(ele){
try{
     let todoId = ele.closest("li").id;
  let updetedObj = {
         isCompleted : ele.checked,
  }
  let update_url = `${BASE_URL}/todo2/${todoId}.json`;
  handleSpinner()
  let res = await fetch(update_url,{
    method : "PATCH",
    body : JSON.stringify(updetedObj),
    headers : {
      "content-type" : "application/json",
      "Authrization" : "JWT TOKEN"
    }
  })
  let data = await res.json();
  cl(data)
   
  let getIndex = state.todoArr.findIndex(ele => ele.id === todoId);
  state.todoArr[getIndex].isCompleted = ele.checked

}
catch{
  snackBar("something went wrong")
}
finally{
   handleSpinner()
}
}

function toggleDescription(ele){
    let description = ele.nextElementSibling;
    let isOpen = description.classList.contains("show");

    let allDescription = ele.closest("#todoContainer").querySelectorAll(".collapse");

    allDescription.forEach(des => des.classList.remove("show"))

    if(!isOpen){
      description.classList.add("show")
    }
}


form.addEventListener("submit", onAddTodo);
updateBtn.addEventListener("click", onUpdateTodo)