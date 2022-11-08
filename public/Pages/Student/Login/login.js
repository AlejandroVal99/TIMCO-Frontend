import API from "./../../../src/TimcoApi.js";

document.querySelector(".login__form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const student = {
    email: e.target[0].value,
    password: e.target[1].value,
  };

  const res = await AttemptLogin(student);
  if (res.status === "error") {
    let inputEmail = document.getElementById("studentEmail");
    let inputPassword = document.getElementById("studentPassword");

    let labelEmail = document.getElementById("login-student-email-label");
    let labelPassword = document.getElementById("login-student-password-label");
    let errEmailWrong = document.getElementById("email-password-error");
    switch (res.message) {
      case "auth/user-not-found":
        errEmailWrong.style.display = "block";
        errEmailWrong.style.color = "red";
        labelEmail.style.color = "red";
        inputEmail.style.borderColor = "red";
        labelPassword.style.color = "red";
        inputPassword.style.borderColor = "red";
        break;
      case "auth/invalid-password":
        errEmailWrong.style.display = "block";
        errEmailWrong.style.color = "red";
        labelEmail.style.color = "red";
        inputEmail.style.borderColor = "red";
        labelPassword.style.color = "red";
        inputPassword.style.borderColor = "red";
        break;
      default:
        break;
    }
  }
});

const AttemptLogin = (student) => {
  return API.LoginStudent(student);
};
