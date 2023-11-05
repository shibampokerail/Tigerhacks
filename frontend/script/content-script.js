alert("hi")
const displayResponse = (displayText) => {
    chrome.storage.local.set({responseData: {response: displayText}});
}

const previousResponses = {}

function updateTabInfo() {
    const currentURL = window.location.href;
    const currentTitle = document.title;
    const data = {
        title: currentTitle,
        url: currentURL
    };

    if (currentURL in previousResponses) {
        const responseContent = previousResponses[currentURL];
        displayResponse(responseContent);
        console.log(responseContent)

    } else {
        console.log("sending request")
        displayResponse("loading...");
        PROD = 'https://34.29.82.110/submit'
        DEV = 'http://127.0.0.1:5000/submit'
        fetch( PROD , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(responseData => {
                previousResponses[responseData["url"]] = responseData["response"];
                console.log(responseData)
                displayResponse(previousResponses[responseData["url"]]);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}
updateTabInfo();