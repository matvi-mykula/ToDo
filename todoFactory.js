//todo but with factory functions

let projectList = []

const projectFactory = (title, description, todoList) => {
    //const buildElement = () => console.log('hello')
    return {
        title: title,
        description: description,
        todoList: todoList,
        addToDo(newToDo) { this.todoList.push(newToDo) },
        shower() { showTask(this.todoList) },
        testTest() { console.log(this.todoList) },
        showerP() {showProjectDescription(this.description)}
    }
}

// on submission of form
function createProject(title, description, todoList) {
    newProject = projectFactory(title, description, todoList)
    projectList.push(newProject)

    remove_elements(document.getElementById('projectContainer'))
    createProjectbtns()
}

const taskFactory = (title, description, doneStatus) => {

    return {
        title: title,
        description: description,
        doneStatus: doneStatus,
        markFinished() {
            if (!this.doneStatus) { // misha no like
                this.doneStatus = true
                console.log(this.doneStatus)
            }
        }
    }
}


//function that adds all the elements for project (edit, todoList)
function createProjectbtns() {
    projectContainer = document.getElementById('projectContainer')

    for (let i = 0; i < projectList.length; i++) {
        var tempElement = document.createElement('div')
        var tempBtn = document.createElement('button')
        tempBtn.textContent = projectList[i].title
        tempBtn.setAttribute('id', i)
        console.log(projectList[i].title)
        console.log('type of tempBtn')
        console.log(typeof tempBtn)
        //tempBtn.innerHTML += '<button onclick="projectList['+ i +'].shower()'+ '</button>';

        tempBtn.onclick = function () {
            remove_elements(taskContainer)
            console.log(projectList[i].todoList)
            projectList[i].testTest()
            projectList[i].shower()
            projectList[i].showerP()
        }

        projectContainer.appendChild(tempElement)
        tempElement.appendChild(tempBtn)
    }
    return
}

function showProjectDescription(proDes) {
    projectDescription = document.getElementById('projectDescription')
    projectDescription.textContent = proDes
}

function showTask(taskList) {   //maybe rename to open project
    taskContainer = document.getElementById('taskContainer')
    descriptionHolder = document.getElementById('descriptionHolder')
    console.log(taskList[0].title)
   

    for (let i = 0; i < taskList.length; i++) {
        var tempElement = document.createElement('div')
        var tempBtn = document.createElement('button')
        tempBtn.textContent = taskList[i].title
        tempBtn.setAttribute('id', taskList[i].title)
        console.log(taskList[i].title)

        tempBtn.onclick = function () {
            remove_elements(descriptionHolder)
            console.log(taskList[i])
            showDescription(taskList[i])
        }
        taskContainer.appendChild(tempElement)
        tempElement.appendChild(tempBtn)

    }
    // adds quasi form to build and add new task
    // doesnt work because it needs to reference to the project object and that isnt in scope

    var addTasker = document.createElement('div')
    var taskTitle = document.createElement('input')
    taskTitle.type = 'text'
    taskTitle.placeholder = 'Task Title'
    var taskDescription = document.createElement('input')
    taskDescription.type = 'text'
    taskDescription.placeholder = 'Task Description'
    var taskDoneStatus = document.createElement('input')
    taskDoneStatus.type = 'checkbox'
    taskDoneStatus.id = 'doneStatusCheckbox'
    var newlabel = document.createElement("Label");
    newlabel.setAttribute("for", 'doneStatusCheckbox');
    newlabel.innerHTML = "Finished Status";

    var newTaskSubmit = document.createElement('button')
    newTaskSubmit.textContent = 'Submit'
    newTaskSubmit.onclick = function () {
        newTask = taskFactory(taskTitle.value, taskDescription.value, taskDoneStatus.checked)
        taskList.push(newTask)
        remove_elements(taskContainer)
        showTask(taskList)
    }

    addTasker.appendChild(taskTitle)
    addTasker.appendChild(taskDescription)
    addTasker.appendChild(taskDoneStatus)
    addTasker.appendChild(newlabel)
    addTasker.appendChild(newTaskSubmit)
    taskContainer.appendChild(addTasker)
    
    sendToFlask(projectList)
    return
}


function showDescription(object) {
    descriptionHolder = document.getElementById('descriptionHolder')
    ///var descriptionElement = document.createElement('div')
    var objectTitle = document.createElement('p')
    objectTitle.textContent = 'Task Title ::: ' + object.title
    var objectDescription = document.createElement('p')
    objectDescription.textContent = 'Description::: ' + object.description
    var objectDoneStatus = document.createElement('p')
    objectDoneStatus.textContent = 'Task Status::: ' + object.doneStatus

    descriptionHolder.appendChild(objectTitle)
    descriptionHolder.appendChild(objectDescription)
    descriptionHolder.appendChild(objectDoneStatus)
}

function remove_elements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}



function todoListStart() {
    // let first = projectFactory('js', 'todo', [])
    // let task1 = taskFactory('shit', 'poop', false)
    // let task2 = taskFactory('coffee', 'iced', false)

    // first.addToDo(task1)
    // first.addToDo(task2)

    // projectList.push(first)

    createProjectbtns()

    //console.log(JSON.stringify(projectList))
}

todoListStart()


