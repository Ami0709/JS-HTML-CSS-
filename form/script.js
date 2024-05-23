let userName=document.getElementById("txtUserName")
let email=document.getElementById("txtEmail");
let pwd=document.getElementById("txtPwd");
let conPwd=document.getElementById("txtConPwd");
let form=document.querySelector("form");

function validateInput() {
    if(userName.value.trim()===""){
        let parent=userName.parentElement;
        let messageEle=parent.querySelector("small");
        messageEle.style.visibility="visible";
        messageEle.innerText="User Name cannot be empty";
    }
    else{
        let parent=userName.parentElement;
        let messageEle=parent.querySelector("small");
        messageEle.style.visibility="hidden";
        messageEle.innerText="";
    }
}
document.querySelector("button")
.addEventListener("click", (event) =>{
    event.preventDefault();
    validateInput();
});

function onSuccess(input,message){
    let parent=userName.parentElement;
        let messageEle=parent.querySelector("small");
        messageEle.style.visibility="visible";
        messageEle.innerText=input;
}

function onError(input,message)
{
    let parent=userName.parentElement;
        let messageEle=parent.querySelector("small");
        messageEle.style.visibility="visible";
        messageEle.innerText="User Name cannot be empty";
}