import Project from "./project.js";

export default (() => {
  const storeData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  const retrieveProjects = (key) => {
    const projects = JSON.parse(localStorage.getItem(key))
    if(!projects) return;
    return projects.map(project => Project.fromJSON(project));
  }

  return {storeData, retrieveProjects }
})();