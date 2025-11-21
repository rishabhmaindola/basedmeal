const SUPABASE_URL = 'https://bgfirtvqdaeddqttmjeu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmlydHZxZGFlZGRxdHRtamV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDQ1NTYsImV4cCI6MjA3OTI4MDU1Nn0.Cib0nGgjHW2nF64pN-Id4lAdHFsDL36bhRLYrGbzUtU';
const supabaseKey = 'sb_publishable_qlfUQU2yqNqWsACiqSTPGQ_wXh5hE1c';

const supabaseDB = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);  

const form = document.getElementById("optinForm");
const submitBtn = form.querySelector("button[type='submit']");
const buttonText = document.getElementById("buttonText");
const spinner = document.getElementById("spinner");
const responseMsg = document.getElementById("responseMessage");
const formResponse = document.getElementById("formResponse");
const retryContainer = document.getElementById("retryContainer");


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    responseMsg.textContent = "";
    responseMsg.style.color = "white";

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showResponseWithRetry("Please enter a valid email.", "text-red-500");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
        const token = crypto.randomUUID();
        const bodyData = { email, token };

        const response = await fetch(`${SUPABASE_URL}/functions/v1/dynamic-function`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'apikey': supabaseKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();
        console.log('Response:', data);

        if (!data.success) {
            showResponseWithRetry(data.message || "Email saved, but failed to send verification email.", "text-red-500");
        } else {
            showResponse(data.message || "Verification email sent to your inbox.", "text-green-500");
        }

    } catch (err) {
        console.error(err);
        showResponseWithRetry(err.message || "Something went wrong. Please try again.", "text-red-500");

    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Join Waitlist";
    }
}
);

function showResponse(message, colorClass) {
    responseMsg.textContent = message;
    responseMsg.className = `text-center ${colorClass}`;
    form.classList.add("hidden");
    formResponse.classList.remove("hidden");
    retryContainer.innerHTML = "";
}

function showResponseWithRetry(message, colorClass) {
    showResponse(message, colorClass);

    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Retry";
    retryBtn.className = "mt-3 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition";

    retryBtn.addEventListener("click", () => {
        formResponse.classList.add("hidden");
        form.classList.remove("hidden");
        form.email.focus();
        responseMsg.textContent = "";
        retryContainer.innerHTML = "";
    });

    retryContainer.appendChild(retryBtn);
}
