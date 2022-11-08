import API from "./../../../src/TimcoApi.js"

document.querySelector('.login__form').addEventListener('submit', async e => {
    e.preventDefault();

    const newRecruiter = {
        name: e.target[0].value,
        //orgName: e.target[1].value,
        email: e.target[1].value,
        password: e.target[2].value,
        // phone: '000',
        // aboutMe: 'default description',
        // profileImage: '///'
    }
    const res = await AttemptRegistration(newRecruiter);
    if(res.status === 'error') {
        console.error(res.message);
        let inputEmail = document.getElementById('recruiterEmail');

        let labelEmail = document.getElementById('create-recruiter-email-label');
        let errEmailExistEle = document.getElementById('email-exists-err');
        switch (res.message) {
            case 'create/email-company-exists':
                
                errEmailExistEle.style.display = 'block';
                errEmailExistEle.style.color = 'red'; 
                labelEmail.style.color = 'red'; 
                inputEmail.style.borderColor = 'red';
                break;
            default:
                break;
        }
    }
})


const AttemptRegistration =  (recruiter) => {
   return API.SignUpRecruiter(recruiter);
   
}