const copyBtn = document.getElementById("copyBtn");
const responseBox = document.getElementById("response");
let sentences;

copyBtn.addEventListener("click", copyChat);

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
