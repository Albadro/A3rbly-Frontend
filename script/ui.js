const copyBtn = document.getElementById("copyBtn");
const responseBox = document.getElementById("response");
const sendBtn = document.getElementById("send_button");
const actionBar = document.getElementById("actionBar");
const sendButton = document.getElementById("send_button");
const container = document.getElementById("container");
const inputBox = document.getElementById("user_input");
let sentences;
const usableChars = [
    "ء",
    "آ",
    "أ",
    "ؤ",
    "إ",
    "ئ",
    "ا",
    "ب",
    "ة",
    "ت",
    "ث",
    "ج",
    "ح",
    "خ",
    "د",
    "ذ",
    "ر",
    "ز",
    "س",
    "ش",
    "ص",
    "ض",
    "ط",
    "ظ",
    "ع",
    "غ",
    "ف",
    "ق",
    "ك",
    "ل",
    "م",
    "ن",
    "ه",
    "و",
    "ى",
    "ي",
    ".",
    "،",
    ",",
    ";",
    "؛",
    "!",
    "؟",
    "_",
    "-",
];

sendButton.addEventListener("click", sendFakeMessage);
// sendButton.addEventListener("click", sendMessage);
inputBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        // sendMessage();
        sendFakeMessage();
    }
});
copyBtn.addEventListener("click", copyChat);
sendBtn.addEventListener("click", bubbleIt);

function inputCheck(text) {}

function sendFakeMessage() {
    // delete this func
    function pushResponse() {
        responseBox.innerHTML = `<p>صف ذا ثنا كم جاد شخص قد سما دم طيبا زد في تقى ضع ظالما:</p>
<p>  صف: فعل أمر مبني على السكون</p>
<p> ذا: مفعول به أول منصوب بالالف</p>
<p>  ثنا: مفعول به ثان منصوب بالفتحة</p>
<p>  كم: خبرية مبنية على السكون </p>
<p>  جاد: فعل ماضٍ مبني على الفتح </p>
<p>  شخص: فاعل مرفوع بالضمة </p>
<p> قد: حرف تحقيق مبني على السكون</p>
<p>  سما: فعل ماضٍ مبني على الفتح </p>
<p> دم: فاعل مرفوع بالضمة</p>
<p>  طيبا: حال منصوب بالفتحة</p>
<p>  زد: فعل أمر مبني على السكون</p>
<p>  في: حرف جر مبني على السكون</p>
<p>  التقى: اسم مجرور بالكسرة</p>
<p>  ضع: فعل أمر مبني على السكون</p>
<p>  ظالما: مفعول به منصوب بالفتحة </p>`;
    }
    function disableInputbox(bol) {
        //if input is true the input box will be disabled
        inputBox.disabled = bol;
        if (bol) {
            inputBox.blur();
            inputBox.classList.add("disabled");
        } else {
            inputBox.classList.remove("disabled");
            inputBox.focus();
            inputBox.select();
        }
    }

    sendBtn.classList.add("loading");
    disableInputbox(true);

    // temp function to test the responses for frontend
    console.log("we are faking a response");

    setTimeout(() => {
        pushResponse();
        disableInputbox(false);
        container.classList.add("response-exists");
        responseBox.classList.toggle("visible");
        actionBar.classList.remove("uncopiable");
        sendBtn.classList.remove("loading");
    }, 5000);
}
function sendMessage() {
    // Clear the input field and disable the button while processing
    sendButton.classList.add("loading");

    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputBox.value }),
    })
        .then((response) => response.json())
        .then((data) => {
            sendButton.classList.remove("loading");
            responseBox.innerHTML = marked.parse(data.response);
            responseBox.classList.add("visible");
            if (!actionBar.classList.contains("copiable")) {
                // show the copy button if not shown
                actionBar.classList.add("copiable");
            }
            // Focus the input field and select its content
            inputBox.focus();
            inputBox.select();
        })
        .catch((error) => {
            console.error("Error:", error);
            sendButton.classList.remove("loading");
            responseBox.innerHTML = "حدث خطأ، أعد المحاولة!";
            responseBox.classList.add("visible");
        });
}

function copyChat() {
    if (responseBox.hasChildNodes()) {
        sentences = document.querySelectorAll("#response > *");
    } else {
        // err nothing to copy
    }
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
                //success
            })
            .catch((err) => {
                // err
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
}
function bubbleIt() {
    if (sendBtn.classList.contains("animate")) {
        sendBtn.classList.remove("animate"); //reset animation
    }
    sendBtn.classList.add("animate");
    setTimeout(function () {
        sendBtn.classList.remove("animate");
        console.log("the button should have been animated");
    }, 700);
}
