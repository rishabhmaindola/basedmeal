const RESEND_API_KEY = 're_6Wawp5Z1_JUXHS2QiFiwbBZP7XecJdjwm';
const SUPABASE_URL = 'https://bgfirtvqdaeddqttmjeu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmlydHZxZGFlZGRxdHRtamV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDQ1NTYsImV4cCI6MjA3OTI4MDU1Nn0.Cib0nGgjHW2nF64pN-Id4lAdHFsDL36bhRLYrGbzUtU';
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
        responseMsg.textContent = "Please enter a valid email.";
        responseMsg.style.color = "red";
        return;
    }

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
        const { data: existing } = await supabaseDB
            .from("basedmeal-waitlist")
            .select("id")
            .eq("email", email)
            .maybeSingle();

        if (existing) {
            responseMsg.textContent = "This email is already registered.";
            responseMsg.style.color = "red";
            return;
        }

        const token = crypto.randomUUID();

        const { error: insertError } = await supabaseDB
            .from("basedmeal-waitlist")
            .insert([{
                email,
                verification_token: token,
                verified: false
            }]);

        if (insertError) {
            responseMsg.textContent = "Failed to save email. Try again.";
            responseMsg.style.color = "red";
            return;
        }

        const { data: funcResult, error: funcError } = await supabaseDB
            .functions
            .invoke("send-verification", {
                body: { email, token }
            });

        if (funcError) {
            responseMsg.textContent =
                "Email saved, but failed to send verification email.";
            responseMsg.style.color = "red";
            return;
        }


        responseMsg.textContent =
            "Email saved! Check your inbox for a verification link.";
        responseMsg.style.color = "green";
        form.reset();

    } catch (err) {
        responseMsg.textContent = err.message || "Something went wrong.";
        responseMsg.style.color = "red";

    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Join Waitlist";
    }
});



function showResponse(message, colorClass) {
    responseMessage.textContent = message;
    responseMessage.className = `text-center ${colorClass} `;
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
    });

    retryContainer.appendChild(retryBtn);
}
