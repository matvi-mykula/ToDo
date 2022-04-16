// todo/project management with factory functions and local storage
// still need to make the projects and tasks editable and finishable and deletable

function removeElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

const projectFactory = (title, description, todoList, dueDate) => ({
  title,
  description,
  todoList,
  dueDate, // dueDate is showing up as object and is unaccessible in console
  colorCode: Math.floor(Math.random() * 16777215).toString(16),
});

// used to set bottom limit of project dueDate
function getTodaysDate() {
  const date = new Date().toISOString().slice(0, -14);
  return date;
}

// upon submission of inputs
// eslint says createProject is never used but it is attached to HTML button
// eslint-disable-next-line no-unused-vars
function createProject(title, description, todoList, dueDate) {
  console.log({
    dueDate,
  });
  const newProject = projectFactory(title, description, todoList, dueDate);

  // get json project data
  const projectList = (() => {
    if (localStorage.getItem('projectJSON') === null) {
      return [];
    }
    return JSON.parse(localStorage.getItem('projectJSON'));
  })();
  projectList.push(newProject);
  const index = projectList.indexOf(newProject);
  localStorage.setItem('projectJSON', JSON.stringify(projectList));
  removeElements(document.getElementById('projectContainer'));
  createProjectbtns(); // how to find month year
  const calMonth = parseInt(
    document.getElementById('monthYear').getAttribute('data-value'),
    10
  );
  //   calMonth = calMonth.value;
  console.log({ calMonth });
  //   addProjectToCal(projectList, index, calMonth);

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
        'btn btn-secondary btn-lg btn-block btn-outline-black '
      );
      tempBtn.style.backgroundColor = '#' + projectList[i].colorCode;

      tempBtn.onclick = () => {
        removeElements(taskContainer);
        openProject(i), showProjectDescription(projectList, i);
      };

      projectContainer.appendChild(tempElement);
      tempElement.appendChild(tempBtn);
    }
  }
  markProjects('projectJSON');
}

// function that shows project description and gives option to delete
function showProjectDescription(projectList, index) {
  removeElements(document.getElementById('projectDescription'));
  const projectDescription = document.getElementById('projectDescription');
  projectDescription.textContent =
    '\n \ndue date::' +
    projectList[index].dueDate +
    '\n' +
    projectList[index].description;
  // due date showing up as objectObject not a datestring
  //   const projectDueDate = document.getElementById()
  const br = document.createElement('br');
  projectDescription.appendChild(br);
  projectDescription.appendChild(br);

  const deletebtn = document.createElement('button');
  deletebtn.setAttribute('id', index);
  deletebtn.setAttribute(
    'class',
    'btn btn-secondary btn-lg btn-block btn-outline-black '
  );
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
      tempBtn.setAttribute(
        'class',
        'btn btn-secondary btn-lg btn-block btn-outline black'
      );
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
  newTaskSubmit.setAttribute(
    'class',
    'btn btn-secondary btn-lg btn-block btn-outline-black '
  );
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
function deleteTaskButton(projectList, projectIndex, taskIndex) {
  const deleteBtn = document.createElement('button');
  document.getElementById('descriptionHolder').appendChild(deleteBtn);
  deleteBtn.setAttribute('id', taskIndex);
  deleteBtn.setAttribute(
    'class',
    'btn btn-secondary btn-lg btn-block btn-outline-black '
  );
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => {
    projectList[projectIndex].todoList.splice(taskIndex, 1);
    localStorage.setItem('projectJSON', JSON.stringify(projectList));
    removeElements(document.getElementById('projectContainer')); // this removes neccessary divs
    removeElements(document.getElementById('taskContainer'));
    removeElements(document.getElementById('descriptionHolder'));
    removeElements(document.getElementById('projectDescription'));
    createProjectbtns();
  };
}

function openTask(projectList, projectIndex, taskIndex) {
  const descriptionHolder = document.getElementById('descriptionHolder');
  const objectTitle = document.createElement('p');
  objectTitle.textContent =
    'Task Title ::: ' + projectList[projectIndex].todoList[taskIndex].title;
  const objectDescription = document.createElement('p');
  objectDescription.textContent =
    'Description::: ' +
    projectList[projectIndex].todoList[taskIndex].description;

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
  newEditSubmit.setAttribute(
    'class',
    'btn btn-secondary btn-lg btn-block btn-outline-black '
  );
  newEditSubmit.onclick = () =>
    submitButton(projectList, projectIndex, taskIndex, taskDoneStatus.checked);

  descriptionHolder.appendChild(objectTitle);
  descriptionHolder.appendChild(objectDescription);
  //   descriptionHolder.appendChild(objectDoneStatus);
  descriptionHolder.appendChild(taskDoneStatus);
  descriptionHolder.appendChild(doneLabel);
  descriptionHolder.appendChild(newEditSubmit);
  deleteTaskButton(projectList, projectIndex, taskIndex);
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

////// below is calendar code

function removeElements(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function generateGrid() {
  const body = document.getElementById('calBody');
  const tbl = document.createElement('table');

  const th = tbl.createTHead();
  const thRow = th.insertRow(0);
  const aWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i > -1; i -= 1) {
    // this is wierd
    const thCell = thRow.insertCell(0);
    thCell.innerHTML = aWeek[i];
  }
  for (let i = 0; i < 6; i += 1) {
    const tr = tbl.insertRow();
    // if (i === 0) {
    //   tr.setAttribute('id', (id = 'monthYear'));
    //   tr.setAttribute('class', 'title');
    // } else {
    tr.setAttribute('id', i.toString());

    for (let j = 0; j < 7; j += 1) {
      const td = tr.insertCell();
      td.style.border = '1px solid black';
    }
  }
  body.appendChild(tbl);
}

// takes date object and extracts month and year numbers
function getMonthYear(dateObject) {
  const date = dateObject.toISOString();
  const year = parseInt(date.slice(0, 4), 10);
  console.log(year);
  const monthIndex = parseInt(date.slice(5, 7), 10) - 1;
  console.log(monthIndex);

  return [year, monthIndex];
}

// generates adjacent months and years
function nextMonthButton(month, year, upOrDown) {
  let nextYear = year;
  let nextMonth = month;
  if (upOrDown === '-') {
    nextMonth -= 1;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    }
  }

  if (upOrDown === '+') {
    nextMonth += 1;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
  }
  // window.location.reload();
  removeElements(document.getElementById('calBody'));
  removeElements(document.getElementById('header'));
  generateMonth(nextMonth, nextYear);
  removeElements(document.getElementById('projectContainer')); // this removes neccessary divs
  removeElements(document.getElementById('taskContainer'));
  removeElements(document.getElementById('descriptionHolder'));
  removeElements(document.getElementById('projectDescription'));
  createProjectbtns();
  markToday(nextMonth);
}

function writeHeader(year, month) {
  //   let month = monthy;
  //   let year = yeary;
  const header = document.getElementById('header');

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  console.log({ month, year });

  const monthYear = document.createElement('p');
  monthYear.setAttribute('id', 'monthYear');
  monthYear.setAttribute('data-value', month);
  console.log({ month });
  monthYear.textContent = months[month] + ' ' + year;

  const futureMonth = document.createElement('button');
  futureMonth.setAttribute('id', 'futureMonth');
  futureMonth.textContent = '>>';
  futureMonth.onclick = () => {
    nextMonthButton(month, year, '+');
  };

  const pastMonth = document.createElement('button');
  pastMonth.setAttribute('id', 'pastMonth');
  pastMonth.textContent = '<<';
  pastMonth.onclick = () => {
    nextMonthButton(month, year, '-');
  };

  header.appendChild(pastMonth);
  header.appendChild(monthYear);
  header.appendChild(futureMonth);
}

// gets number of days in a month
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function markToday(calMonth) {
  const nowMonth = new Date().getMonth();
  if (calMonth !== nowMonth) {
    return;
  }
  const today = new Date().toDateString();
  const todayElement = document.getElementById(today);
  todayElement.style.border = '3px solid black';
}

// adds a colored dot to the days with projects due on them
function markProjects(projectJSON) {
  const projectList = JSON.parse(localStorage.getItem(projectJSON));
  console.log({ projectList });
  if (projectList) {
    for (let i = 0; i < projectList.length; i += 1) {
      const dateString = projectList[i].dueDate;
      const year = parseInt(dateString.slice(0, 4), 10);
      const monthIndex = parseInt(dateString.slice(5, 7), 10) - 1;
      const day = parseInt(dateString.slice(8, 10), 10);
      const dateId = new Date(year, monthIndex, day);
      console.log({ monthIndex });
      const dueMonth = new Date(year, monthIndex, day).getMonth();
      const calMonth = parseInt(
        document.getElementById('monthYear').getAttribute('data-value'),
        10
      );
      if (calMonth === dueMonth) {
        const dueDateId = new Date(year, monthIndex, day).toDateString();
        const dueDateElement = document.getElementById(dueDateId);
        dueDateElement.style.border = '3px solid';
        dueDateElement.style.borderColor = '#' + projectList[i].colorCode;
        dueDateElement.onclick = () => {
          removeElements(document.getElementById('taskContainer'));
          removeElements(document.getElementById('projectDescription'));
          openProject(i);
          showProjectDescription(projectList, i);
        };
        console.log(projectList[i].colorCode);
        // + '#' + projectList[i].colorCode;
      }
    }
  }
}

//how to have multiple projects in one day??

// add onclick to calendar dates >> print object within
// open project

// function addProjectToCal(projectList, index, calMonth) {
//   const dateString = projectList[index].dueDate;
//   const year = parseInt(dateString.slice(0, 4), 10);
//   const monthIndex = parseInt(dateString.slice(5, 7), 10) - 1;
//   const day = parseInt(dateString.slice(8, 10), 10);
//   const dateId = new Date(year, monthIndex, day);
//   console.log({ monthIndex });
//   const nowMonth = new Date(year, monthIndex, day).getMonth();
//   if (calMonth !== nowMonth) {
//     return;
//   }
//   const dueDateId = new Date(year, monthIndex, day).toDateString();
//   const dueDateElement = document.getElementById(dueDateId);
//   dueDateElement.style.border = '3px solid black';
// }

// fills in days of the month on the calendar
function generateMonth(month, year) {
  writeHeader(year, month);
  generateGrid();

  const dayOfTheFirst = new Date(year, month, 1).toString().slice(0, 3);
  //   console.log(dayOfTheFirst);

  const aWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const col = aWeek.indexOf(dayOfTheFirst);
  //   console.log(col);

  const firstWeek = document.getElementById('0').children;

  const daysLeftInMonth = getDaysInMonth(month, year);
  let day = 1;

  // for loop for first week // this should be condesable
  for (let i = col; i < 7; i += 1) {
    // console.log({ i, month, year });
    firstWeek[i].value = day;
    firstWeek[i].innerHTML += firstWeek[i].value;
    firstWeek[i].setAttribute('id', new Date(year, month, day).toDateString());
    day += 1;
  }
  // nested for loop for rest of month
  for (let i = 1; i < 7; i += 1) {
    let weekRow = document.getElementById(i.toString()).children;
    for (let j = 0; j < 7; j += 1) {
      weekRow[j].value = day;
      weekRow[j].innerHTML += weekRow[j].value;
      weekRow[j].setAttribute('id', new Date(year, month, day).toDateString());
      day += 1;
      if (day > daysLeftInMonth) {
        console.log('complete');
        markToday(month);
        return;
      }
    }
  }
  markProjects('projectJSON');
}

function start() {
  const date = getMonthYear(new Date());

  console.log({ date });

  generateMonth(date[1], date[0]);
  //   markProjects(localStorage.getItem('projectJSON'));
}

/// end calendar code

function todoListStart() {
  document.getElementById('projectSubmit').onclick = () =>
    createProject(
      document.getElementById('pname').value,
      document.getElementById('description').value,
      [],
      document.getElementById('dueDate').value
    );

  start();
  createProjectbtns();
}

todoListStart();
