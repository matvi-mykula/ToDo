// todo/project management with factory functions and local storage
// still need to make the projects and tasks editable and finishable and deletable

function removeElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

const projectFactory = (title, description, todoList) => ({
  title,
  description,
  todoList,
});

// upon submission of inputs
// eslint says createProject is never used but it is attached to HTML button
// eslint-disable-next-line no-unused-vars
function createProject(title, description, todoList) {
  const newProject = projectFactory(title, description, todoList);

  // get json project data
  const projectList = (() => {
    if (localStorage.getItem('projectJSON') === null) {
      return [];
    }
    return JSON.parse(localStorage.getItem('projectJSON'));
  })();
  projectList.push(newProject); // why does it say not defined?? also says
  // that it is never redefined???
  localStorage.setItem('projectJSON', JSON.stringify(projectList));
  removeElements(document.getElementById('projectContainer'));
  createProjectbtns();

  /*

        let newProject = projectFactory(title, description, todoList);
        let projectList = loadProjectListFromStorage();
        projectList.push(newProject);
        setProjectListInStorage(projectList)
        resetProjectDom();
        */
}

const taskFactory = (title, description, doneStatus) => ({
  title,
  description,
  doneStatus,
});

// function that adds all the elements for project (edit, todoList)
function createProjectbtns() {
  const projectContainer = document.getElementById('projectContainer');
  const projectList = JSON.parse(localStorage.getItem('projectJSON'));

  if (projectList) {
    for (let i = 0; i < projectList.length; i += 1) {
      // whats wrong with ++
      let tempElement = document.createElement('div');
      let tempBtn = document.createElement('button');
      tempBtn.textContent = projectList[i].title;
      tempBtn.setAttribute('id', i);
      tempBtn.setAttribute(
        'class',
        'btn btn-secondary btn-lg btn-block btn-outline-black'
      );

      tempBtn.onclick = () => {
        removeElements(taskContainer);
        openProject(i), showProjectDescription(projectList, i);
      };

      projectContainer.appendChild(tempElement);
      tempElement.appendChild(tempBtn);
    }
  }
}

// function that shows project description and gives option to delete
function showProjectDescription(projectList, index) {
  const projectDescription = document.getElementById('projectDescription');
  projectDescription.textContent = projectList[index].description;
  const br = document.createElement('br');
  projectDescription.appendChild(br);
  projectDescription.appendChild(br);

  const deletebtn = document.createElement('button');
  deletebtn.setAttribute('id', index);
  deletebtn.textContent = 'Delete';
  deletebtn.onclick = () => {
    projectList.splice(index, 1);
    localStorage.setItem('projectJSON', JSON.stringify(projectList));
    removeElements(document.getElementById('projectContainer')); // this removes neccessary divs
    removeElements(document.getElementById('taskContainer'));
    removeElements(document.getElementById('descriptionHolder'));
    removeElements(document.getElementById('projectDescription'));
    createProjectbtns();
  };

  projectDescription.appendChild(deletebtn);
}

// when you click project button this function creates elements showing description
// also creates buttons for each task in project and allows fro adding tasks to project
function openProject(index) {
  const projectList = JSON.parse(localStorage.getItem('projectJSON'));
  const project = projectList[index];
  const taskContainer = document.getElementById('taskContainer');
  const descriptionHolder = document.getElementById('descriptionHolder');

  if (project.todoList.length > 0) {
    for (let i = 0; i < project.todoList.length; i += 1) {
      const tempElement = document.createElement('div');
      const tempBtn = document.createElement('button');
      const str = project.todoList[i].title + '✓';
      tempBtn.innerHTML = str.replace('✓', "<span class='hidden'>$&</span>");

      tempBtn.setAttribute('id', project.todoList[i].title);
      tempBtn.setAttribute('class', 'btn btn-secondary btn-lg btn-block');
      if (project.todoList[i].doneStatus) {
        tempBtn.innerHTML = str.replace('✓', "<span class='visible'>$&</span>");
      }
      tempBtn.onclick = () => {
        removeElements(descriptionHolder);
        openTask(projectList, index, i);
        // showDescription(project.todoList[i]);
      };
      taskContainer.appendChild(tempElement);
      tempElement.appendChild(tempBtn);
    }
  }

  // adds new Task input fields and submit button
  const addTasker = document.createElement('div');
  const newT = document.createElement('p');
  newT.textContent = '::New Task::';
  const taskTitle = document.createElement('input');
  taskTitle.type = 'text';
  taskTitle.placeholder = 'Task Title';
  const taskDescription = document.createElement('input');
  taskDescription.type = 'text';
  taskDescription.placeholder = 'Task Description';
  const taskDoneStatus = document.createElement('input');
  taskDoneStatus.type = 'checkbox';
  taskDoneStatus.id = 'doneStatusCheckbox';
  const newlabel = document.createElement('Label');
  newlabel.setAttribute('for', 'doneStatusCheckbox');
  newlabel.innerHTML = 'Finished Status';

  const br = document.createElement('br');

  const newTaskSubmit = document.createElement('button');
  newTaskSubmit.textContent = 'Submit';
  newTaskSubmit.onclick = () => {
    const newTask = taskFactory(
      taskTitle.value,
      taskDescription.value,
      taskDoneStatus.checked
    );
    project.todoList.push(newTask);
    projectList[index] = project;
    localStorage.setItem('projectJSON', JSON.stringify(projectList));
    removeElements(taskContainer);
    openProject(index);
  };

  addTasker.appendChild(newT);
  addTasker.appendChild(taskTitle);
  addTasker.appendChild(taskDescription);
  addTasker.appendChild(taskDoneStatus);
  addTasker.appendChild(newlabel);
  addTasker.appendChild(br);
  addTasker.appendChild(newTaskSubmit);
  taskContainer.appendChild(addTasker);
}

// opens task description and other attributes in new element
// needs to be able to edit stuff and check done status => change color of button

function openTask(projectList, projectIndex, taskIndex) {
  const descriptionHolder = document.getElementById('descriptionHolder');
  const objectTitle = document.createElement('p');
  objectTitle.textContent =
    'Task Title ::: ' + projectList[projectIndex].todoList[taskIndex].title;
  const objectDescription = document.createElement('p');
  objectDescription.textContent =
    'Description::: ' +
    projectList[projectIndex].todoList[taskIndex].description;
  //   const objectDoneStatus = document.createElement('p');
  //   objectDoneStatus.textContent =
  //     'Done Status::: ' +
  //     projectList[projectIndex].todoList[taskIndex].doneStatus;

  const taskDoneStatus = document.createElement('input');
  taskDoneStatus.type = 'checkbox';
  taskDoneStatus.id = 'doneStatus';
  taskDoneStatus.checked =
    projectList[projectIndex].todoList[taskIndex].doneStatus;
  const doneLabel = document.createElement('Label');
  doneLabel.setAttribute('for', 'doneStatus');
  doneLabel.innerHTML = 'Finished Status';

  const newEditSubmit = document.createElement('button');
  newEditSubmit.textContent = 'Submit';
  newEditSubmit.onclick = () =>
    submitButton(projectList, projectIndex, taskIndex, taskDoneStatus.checked);

  descriptionHolder.appendChild(objectTitle);
  descriptionHolder.appendChild(objectDescription);
  //   descriptionHolder.appendChild(objectDoneStatus);
  descriptionHolder.appendChild(taskDoneStatus);
  descriptionHolder.appendChild(doneLabel);
  descriptionHolder.appendChild(newEditSubmit);
}

function submitButton(projectList, projectIndex, taskIndex, taskDoneStatus) {
  const doneTask = taskFactory(
    projectList[projectIndex].todoList[taskIndex].title,
    projectList[projectIndex].todoList[taskIndex].description,
    taskDoneStatus
  );
  // eslint-disable-next-line no-param-reassign
  projectList[projectIndex].todoList[taskIndex] = doneTask;
  localStorage.setItem('projectJSON', JSON.stringify(projectList));
  removeElements(document.getElementById('taskContainer'));
  openProject(projectIndex);
  removeElements(document.getElementById('descriptionHolder'));
  openTask(projectList, projectIndex, taskIndex);
}
/*
function showDescription(object) {
  const descriptionHolder = document.getElementById('descriptionHolder');
  /// var descriptionElement = document.createElement('div')
  const objectTitle = document.createElement('p');
  objectTitle.textContent = 'Task Title ::: ' + object.title;
  const objectDescription = document.createElement('p');
  objectDescription.textContent = 'Description::: ' + object.description;
  const objectDoneStatus = document.createElement('p');
  objectDoneStatus.textContent = 'Done Status::: ' + object.doneStatus;

  const taskDoneStatus = document.createElement('input');
  taskDoneStatus.type = 'checkbox';
  taskDoneStatus.id = 'doneStatusCheckbox';
  const newlabel = document.createElement('Label');
  newlabel.setAttribute('for', 'doneStatusCheckbox');
  newlabel.innerHTML = 'Finished Status';

  descriptionHolder.appendChild(objectTitle);
  descriptionHolder.appendChild(objectDescription);
  descriptionHolder.appendChild(objectDoneStatus);
}
*/

// run this to initialize the page.. should this be HTML instead?
function todoListStart() {
  createProjectbtns();
}

todoListStart();
