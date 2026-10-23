import Storage from './storage.js'
import Project from './project.js';

export default (() => {
  let projects = [];
  let currentProject;

  const createTodoProject = (title) => {
    const newProject = new Project(title);
    projects.push(newProject)
    Storage.storeData("projects", projects)
    return newProject;
  };

  const createTaskElement = (task) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.dataset.id = task.id;
    document.querySelector(".tasks").append(taskElement);
    populateTaskData(task, taskElement);
    createTaskControlButtons(task, taskElement);
  };

  const createProjectElement = (project) => {
    const projectElement = document.createElement("div");
    const projectButton = document.createElement("button");
    projectButton.classList.add("set-project-button");
    projectButton.addEventListener("click", () => setCurrentProject(project));
    projectElement.append(projectButton);
    projectButton.textContent = project.title;
    document.querySelector(".projects").append(projectElement);

  };

  const populateTaskData = (task, taskElement) => {
    taskElement.insertAdjacentHTML('beforeend', `<h3>Title: ${task.title}</h3>`);
    taskElement.insertAdjacentHTML('beforeend', `<p>Description: ${task.description}</p>`);
    taskElement.insertAdjacentHTML('beforeend', `<p>Priority: ${task.priority}</p>`);
    taskElement.insertAdjacentHTML('beforeend', `<p>Due: ${task.dueDate}</p>`);
    taskElement.insertAdjacentHTML('beforeend', `<p class="task-status">Status: ${task.status}</p>`);
  };

  const createTaskControlButtons = (task, taskElement) => {
    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.textContent = "Delete task";
    deleteTaskButton.addEventListener("click", () => deleteTask(taskElement.dataset.id, currentProject));
    taskElement.append(deleteTaskButton);
    if(task.status == "done") return;
    const finishTaskButton = document.createElement("button");
    finishTaskButton.classList.add("finish-task-btn");
    finishTaskButton.textContent = "Finish task";
    finishTaskButton.addEventListener("click", () => updateTaskStatus(taskElement, currentProject));
    taskElement.append(finishTaskButton);
  };

  const updateTaskStatus = (taskElement, project) => {
    const task = project.findTask(taskElement.dataset.id);
    task.finishTask();
    taskElement.querySelector(".task-status").textContent = `Status: ${task.status}`;
    taskElement.querySelector(".finish-task-btn").remove();
    Storage.storeData("projects", projects)
  };

  const deleteTask = (taskId, project) => {
    project.deleteTask(taskId);
    Storage.storeData("projects", projects)
    displayProjectTasks(project);
  };

  const setCurrentProject = (project) => {
    document.querySelector(".current-project").textContent = project.title;
    currentProject = project;
    displayProjectTasks(project);
  };

  const displayProjectTasks = (project) => {
    document.querySelector(".tasks").innerHTML = ""
    project.tasks.forEach(task => {
      createTaskElement(task);
    });
  };

  const displayProjects = (projects) => {
    projects.forEach(project => createProjectElement(project));
  };

  const loadProjects = () => {
    const loadedProjects = Storage.retrieveProjects("projects")
    projects = loadedProjects;
    displayProjects(projects)
    setCurrentProject(projects[0]);
  }

  const createTaskFromForm = (form) => {
    const data = Object.fromEntries(new FormData(form));
    const task = currentProject.createProjectTask(data);
    createTaskElement(task);
    Storage.storeData("projects", projects)
  }

  const createProjectFromForm = (form) => {
    const data = Object.fromEntries(new FormData(form));
    const project = createTodoProject(data["title"]);
    createProjectElement(project);
    Storage.storeData("projects", projects)
  }

  // Immediately create and focus default project
  (() => {
    if(Storage.retrieveProjects("projects")) return loadProjects();
    const defaultProject = createTodoProject("default project")
    createProjectElement(defaultProject)
    setCurrentProject(defaultProject);
  })();

  const taskForm = document.querySelector("#task-form");
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createTaskFromForm(taskForm);
    document.querySelector("#task-modal").close();
    e.target.reset();
  })

  const projectForm = document.querySelector("#project-form");
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createProjectFromForm(projectForm);
    document.querySelector("#project-modal").close();
    e.target.reset();
  })

  return { createTaskElement, createProjectElement, createTodoProject, displayProjectTasks };
})();