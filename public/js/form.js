const form = document.getElementById("optinForm");
const submitBtn = document.getElementById("submitBtn");
const buttonText = document.getElementById("buttonText");
const spinner = document.getElementById("spinner");
const retryContainer = document.getElementById("retryContainer");
const responseMessage = document.getElementById("responseMessage");
const formResponse = document.getElementById("formResponse");

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLYMAYL4E79J8ioXEWxGjnaR1yhEoVtaBlQW-T5-MczxUVQqJIm4eTtO0L4J1kYkzT0A/exec';

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showResponse("Please enter a valid email address.", "text-red-500");
        return;
    }

    submitBtn.disabled = true;
    buttonText.textContent = "Sending...";
    spinner.classList.remove("hidden");

    try {
        // Send email as JSON
        const payload = { email: email };
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log("STATUS:", response.status);
        console.log("RAW RESPONSE:", text);

        let data;
        try {
            data = JSON.parse(text);
            console.log("JSON PARSED:", data);
        } catch (_) {
            throw new Error("Response was not JSON");
        }

        if (data.result === "success") {
            showResponse("Email successfully saved! Thank you.", "text-green-500");
            form.reset();
        } else {
            const errMsg = data.error || "Failed to save email";
            throw new Error(errMsg);
        }

    } catch (error) {
        console.error("Error:", error);
        showResponseWithRetry(`Something went wrong: ${error.message}`, "text-red-500");
    } finally {
        submitBtn.disabled = false;
        buttonText.textContent = "Join Waitlist";
        spinner.classList.add("hidden");
    }
});

function showResponse(message, textColorClass) {
    responseMessage.textContent = message;
    responseMessage.className = `text-center ${textColorClass}`;
    form.classList.add("hidden");
    formResponse.classList.remove("hidden");
    retryContainer.innerHTML = "";
}

function showResponseWithRetry(message, textColorClass) {
    showResponse(message, textColorClass);

    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Retry";
    retryBtn.className = "mt-3 px-4 py-2 bg-gradient-to-br from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white rounded transition";

    retryBtn.addEventListener("click", () => {
        formResponse.classList.add("hidden");
        form.classList.remove("hidden");
        form.email.focus();
    });

    retryContainer.appendChild(retryBtn);
} 
