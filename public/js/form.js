const SUPABASE_URL = 'https://bgfirtvqdaeddqttmjeu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmlydHZxZGFlZGRxdHRtamV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDQ1NTYsImV4cCI6MjA3OTI4MDU1Nn0.Cib0nGgjHW2nF64pN-Id4lAdHFsDL36bhRLYrGbzUtU';
const supabaseDB = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("optinForm");
const submitBtn = form.querySelector("button[type='submit']");
const buttonText = document.getElementById("buttonText");
const spinner = document.getElementById("spinner");
const responseMessage = document.getElementById("responseMessage");
const formResponse = document.getElementById("formResponse");
const retryContainer = document.getElementById("retryContainer");

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
        const { data: existing, error: fetchError } = await supabaseDB
            .from('basedmeal-waitlist')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existing) {
            throw new Error("This email is already registered.");
        }

        const { data, error } = await supabaseDB
            .from('basedmeal-waitlist')
            .insert([{ email }]);

        if (error) {
            if (error.message.includes("duplicate key")) {
                showResponse("This email is already registered.", "text-red-500");
                return;
            }
            throw error;
        }

        showResponse("Email successfully saved! Thank you.", "text-green-500");
        form.reset();

    } catch (err) {
        console.error(err);
        showResponseWithRetry(err.message || "Something went wrong.", "text-red-500");
    } finally {
        submitBtn.disabled = false;
        buttonText.textContent = "Join Waitlist";
        spinner.classList.add("hidden");
    }
});

function showResponse(message, colorClass) {
    responseMessage.textContent = message;
    responseMessage.className = `text-center ${colorClass}`;
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
