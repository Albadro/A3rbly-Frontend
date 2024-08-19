const copyBtn = document.getElementById("copyBtn");
const responseBox = document.getElementById("response");
const sendBtn = document.getElementById("send_button");
const actionBar = document.getElementById("actionBar");
const sendButton = document.getElementById("send_button");
const container = document.getElementById("container");
const inputBox = document.getElementById("user_input");
let sentences;
let inputAllowed = true;

// send with button and Enter key
sendButton.addEventListener("click", inputCheck);
inputBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        inputCheck();
    }
});
copyBtn.addEventListener("click", copyChat);

function disableInput(bol) {
    // allow or prevent user from inputing

    //if bol is true the input box will be disabled
    inputBox.disabled = bol;
    if (bol) {
        inputAllowed = !bol;
    } else {
        setTimeout(() => {
            inputAllowed = !bol;
        }, 2000);
    }
    if (bol) {
        inputBox.blur();
        inputBox.classList.add("disabled");
        sendBtn.classList.add("loading");
    } else {
        inputBox.classList.remove("disabled");
        sendBtn.classList.remove("loading");
        inputBox.focus();
    }
}
function classOnOff(element, cls, delay) {
    if (!element.classList.contains(cls)) {
        element.classList.add(cls);
    }
    setTimeout(() => {
        if (element.classList.contains(cls)) {
            element.classList.remove(cls);
        }
    }, delay);
}
function bubbleIt() {
    if (sendBtn.classList.contains("animate")) {
        sendBtn.classList.remove("animate"); //reset animation
    }
    sendBtn.classList.add("animate");
    setTimeout(function () {
        sendBtn.classList.remove("animate");
    }, 700);
}
function copiable(bol) {
    // show the copy button if not shown
    if (bol && actionBar.classList.contains("uncopiable")) {
        actionBar.classList.remove("uncopiable");
    } else if (!bol && !actionBar.classList.contains("uncopiable")) {
        actionBar.classList.add("copiable");
    }
}
function spaceForResponse() {
    container.classList.add("response-exists");
    responseBox.classList.add("visible");
}
function errorResponse(response, cnslMsg) {
    if (cnslMsg !== undefined) {
        console.error("Error:", cnslMsg);
    }
    spaceForResponse();
    responseBox.classList.add("err");
    responseBox.innerHTML = response;
    disableInput(false);
    copiable(false);
}

function inputCheck() {
    if (inputAllowed) {
        const txt = inputBox.value;
        if (txt.length > 0) {
            let spaces = 0;
            disableInput(true);
            for (let i = 0; i < txt.length; i++) {
                if (txt[i] === " ") {
                    spaces++;
                }
            }
            if (spaces !== txt.length && spaces > 0) {
                // it is not all spaces and it is more than a word
                bubbleIt(); //move it to where there is not error message from the server can enter
                sendReceive();
            } else {
                classOnOff(inputBox, "err", 275);
                errorResponse("خطأ، يجب إدخال جملة !");
            }
        } else {
            //input is empty
            classOnOff(inputBox, "err", 275);
        }
    }
}
function sendReceive() {
    fetch("/chat", {
        // send to server

        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputBox.value }),
    })
        // recieve response
        .then((response) => response.json())
        .then((data) => {
            spaceForResponse();
            if (responseBox.classList.contains("err")) {
                // in case if the last response was an error
                responseBox.classList.remove("err");
            }
            responseBox.innerHTML = marked.parse(data.response);
            disableInput(false);
            copiable(true);
        })
        .catch((error) => {
            errorResponse("حدث خطأ، أعد المحاولة!", error);
        });
}
function copyChat() {
    if (responseBox.children.length > 2) {
        sentences = document.querySelectorAll("#response > p");
        const signature = "\n\n----- https://a3rbly.pplo.dev -----\n\n";
        let copied = "";
        for (let sentence of sentences) {
            copied += sentence.textContent;
        }
        copied += signature;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard
                .writeText(copied)
                .then(() => {
                    classOnOff(copyBtn, "success", 300);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    classOnOff(copyBtn, "err", 300);
                });
        } else {
            //if the clipboard API is blocked
            const tempTextArea = document.createElement("textarea");
            tempTextArea.value = copied;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand("copy");
            document.body.removeChild(tempTextArea);
        }
    } else {
        classOnOff(copyBtn, "err", 300);
    }
}
