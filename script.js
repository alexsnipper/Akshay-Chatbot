document.getElementById('queryForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const userInput = document.getElementById('userInput').value;
    const responseContainer = document.getElementById('responseContainer');

    responseContainer.innerHTML = 'Loading...'; // Show loading message

    try {
        const response = await fetch('http://127.0.0.1:5000/api/chat', { // Update this URL based on your backend setup
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: userInput }),
        });

        const data = await response.json();
        if (response.ok) {
            // Format the raw response from LLaMA for readability
            responseContainer.innerHTML = formatResponse(data.answer);
        } else {
            responseContainer.innerHTML = 'Error: ' + data.error;
        }
    } catch (error) {
        responseContainer.innerHTML = 'Error: ' + error.message;
    }
});

// Function to format the raw response into a structured and readable format
function formatResponse(text) {
    // Split the response into sections based on the steps
    const sections = text.split('Step');
    let formattedResponse = '';

    // Handle the case when the first section isn't a step (e.g., introduction)
    if (sections[0]) {
        formattedResponse += `<p>${sections[0].trim()}</p>`;
    }

    // Loop through each section and format it
    sections.slice(1).forEach((section, index) => {
        const stepTitle = `Step ${section.split(':')[0].trim()}`;
        const stepContent = section.split(':')[1]?.trim();

        if (stepTitle && stepContent) {
            formattedResponse += `
                <h3>${stepTitle}</h3>
                <p>${stepContent}</p>
            `;
        }
    });

    // Return the final formatted response
    return formattedResponse;
}
