let repoContainer = document.querySelector(".repositories");
let btn = document.querySelector(".search-btn");
let input = document.querySelector(".search-input");

btn.addEventListener("click", async function () {
  let username = input.value;
  await showRepositories(username);
});

async function showRepositories(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const repositories = await response.json();

    repoContainer.innerHTML = "";
    if (repositories.length === 0) {
      repoContainer.innerHTML = "<p>No repositories found for this user.</p>";
      return;
    }

    let currentRow;
    let reposInCurrentRow = 0;
    let rowIndex = 0;

    // Determine the number of repos per row based on screen width
    let reposPerRow;
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1025) {
      reposPerRow = rowIndex % 2 === 0 ? 2 : 3;
    } else if (screenWidth >= 768) {
      reposPerRow = 2;
    } else {
      reposPerRow = 1;
    }

    repositories.forEach((repo, index) => {
      // Determine the number of repos per row based on screen width and row index
      let reposPerRow;
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1025) {
        reposPerRow = rowIndex % 2 === 0 ? 2 : 3;
      } else if (screenWidth >= 768) {
        reposPerRow = 2;
      } else {
        reposPerRow = 1;
      }

      if (reposInCurrentRow === 0) {
        currentRow = document.createElement("div");
        currentRow.classList.add("repo-row");
        currentRow.classList.add(rowIndex % 2 === 0 ? "odd-row" : "even-row");
        repoContainer.appendChild(currentRow);
        rowIndex++;
      }

      let repoElement = document.createElement("div");
      repoElement.classList.add("repo");
      repoElement.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description available"}</p>
            <a href="${repo.html_url}" target="_blank">View Repository</a>
        `;
      currentRow.appendChild(repoElement);

      reposInCurrentRow++;
      if (reposInCurrentRow === reposPerRow) {
        reposInCurrentRow = 0;
      }
    });
  } catch (error) {
    console.error("Error fetching repositories:", error);
    alert("Error fetching repositories. Please try again.");
  }
}
