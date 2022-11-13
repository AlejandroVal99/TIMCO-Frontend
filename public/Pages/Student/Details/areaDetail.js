import parseJWT from "../../../src/utils/parseJWT.js"

const token = localStorage.getItem("token");
const userData = parseJWT(token).data;
console.log(userData); 

const getUserData = () => {
    if (userData !== null) {
      let userName = userData.name;
      
  
      const userNameSideBar = document.getElementById("userName");
  
  
      userNameSideBar.innerHTML = userName;
      
    }
  };

  getUserData();