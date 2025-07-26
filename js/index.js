async function displayData() {
    const headerDisplay = headerTemplate();
}

async function init() {
    try{
        await displayData();
    } catch (error) {
    console.error("An error occurred:", error);
  }
}

init();