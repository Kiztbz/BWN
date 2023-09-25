// Function to load a random quotation
function loadRandomQuotation() {
  // Define the file path
  const filePath = "./resources/quotes.txt"; // Adjust the path as needed

  // Use the Fetch API to fetch the file
  fetch(filePath)
    .then((response) => response.text())
    .then((fileContent) => {
      const quotations = fileContent.split("\n");
      const randomIndex = Math.floor(Math.random() * quotations.length);
      const randomQuotation = quotations[randomIndex];
      document.getElementById("quote").innerHTML = randomQuotation;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Load a random quotation when the page loads
window.addEventListener("load", loadRandomQuotation);
