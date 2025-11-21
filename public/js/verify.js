const SUPABASE_URL = 'https://bgfirtvqdaeddqttmjeu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmlydHZxZGFlZGRxdHRtamV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDQ1NTYsImV4cCI6MjA3OTI4MDU1Nn0.Cib0nGgjHW2nF64pN-Id4lAdHFsDL36bhRLYrGbzUtU';
const supabaseKey = 'sb_publishable_qlfUQU2yqNqWsACiqSTPGQ_wXh5hE1c';


const msg = document.getElementById("verifyMessage");
const retryContainer = document.getElementById("retryContainer");

async function verifyEmail() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
        msg.textContent = "Invalid or missing verification token.";
        msg.className = "text-red-400";
        return;
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-email`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'apikey': supabaseKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        const data = await response.json();
        console.log('Response:', data);

        if (data.success) {
            msg.textContent = data.message || "Your email has been successfully verified! 🎉";
            msg.className = "text-green-400";
        } else {
            msg.textContent = data.message || "Verification failed: Invalid or expired token.";
            msg.className = "text-red-400";
        }

    } catch (err) {
        console.error(err);
        msg.textContent = "Something went wrong. Please try again later.";
        msg.className = "text-red-400";
    }
}

verifyEmail();