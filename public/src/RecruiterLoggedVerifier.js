import API from "./TimcoApi.js"

(() => {


    if (!API.IsRecruiterLogged()) API.GoToStudentLogin();

})()