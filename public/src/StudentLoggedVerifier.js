import API from "./TimcoApi.js"

(() => {
    if (!API.IsStudentLogged()) API.GoToStudentLogin();
})()