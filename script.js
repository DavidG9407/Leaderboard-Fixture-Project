let teams = JSON.parse(localStorage.getItem("teams")) || [];
let results = JSON.parse(localStorage.getItem("results")) || [];
const adminKey = "admin123"; //Change to desired admin password

//Saving to local storage
function saveData() {
  localStorage.setItem("teams", JSON.stringify(teams));
  localStorage.setItem("results", JSON.stringify(results));
}

//Adding new team
document.getElementById("teamForm").addEventListener("submit", e => {
  e.preventDefault();
  const teamName = document.getElementById("teamName").value.trim();
  if (teamName && !teams.includes(teamName)) {
    teams.push(teamName);
    saveData();
    updateTeams();
    document.getElementById("teamName").value = "";
  }
  else if (teams.includes(teamName)) {
    alert("Team already exists");
  }
});

//Update team lists and team display
function updateTeams() {
  const teamList = document.getElementById("teamList");
  const team1Select = document.getElementById("team1");
  const team2Select = document.getElementById("team2");

  teamList.innerHTML = "";
  team1Select.innerHTML = "<option value=''>Select Team</option>";
  team2Select.innerHTML = "<option value=''>Select Team</option>";
  
  teams.forEach(team => {
    //Display teams list
    const li = document.createElement("li");
    li.textContent = team;
    teamList.appendChild(li);
  
    //Add to match entries
    [team1Select, team2Select].forEach(select => {
      const option = document.createElement("option");
      option.value = team;
      option.textContent = team;
      select.appendChild(option);
    });
  });
}

//Submitting match result
document.getElementById("matchForm").addEventListener("submit", e => {
  e.preventDefault();
  const t1 = document.getElementById("team1").value;
  const t2 = document.getElementById("team2").value;
  const s1 = parseInt(document.getElementById("score1").value);
  const s2 = parseInt(document.getElementById("score2").value);
  const password = document.getElementById("adminPassword").value;

  if (password !== adminKey) {
    alert("Incorrect admin password.");
    return;
  }

  if (!t1 || !t2 || t1 === t2) {
    alert("Please select two different teams.");
    return;
  }

  if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
    alert("Please enter valid scores.");
    return;
  }

  //Add match results
  results.push({ t1, s1, t2, s2 });
  saveData();
  updateResults();
  updateLeaderboard();
  e.target.reset();
});

//Display all results with delete
function updateResults() {
  const list = document.getElementById("resultsList");
  list.innerHTML = "";

  results.forEach((r, index) => {
    const li = document.createElement("li");
    li.textContent = `${r.t1} ${r.s1} - ${r.s2} ${r.t2}`;

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.title = "Delete this match results";

    del.onclick = () => {
      const pw = prompt("Enter admin password to delete:");
      if (pw === adminKey) {
        results.splice(index, 1);
        saveData();
        updateResults();
        updateLeaderboard();
      }
      else {
        alert("Incorrect password");
      }
    };

    li.appendChild(del);
    list.appendChild(li);
  });
}

//Calculate + Update Leaderboard
function updateLeaderboard() {
  const board = {};

  teams.forEach(t => {
    board[t] = { points: 0, played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0, gd: 0 };
  });
  
  results.forEach(r => {
    const a = board[r.t1], b = board[r.t2];
    a.played++; b.played++;
    a.gf += r.s1; a.ga += r.s2;
    b.gf += r.s2; b.ga += r.s1
  
    if (r.s1 > r.s2) {
      a.won++; b.lost++; a.points += 3;
    }
    else if (r.s1 < r.s2) {
      b.won++; a.lost++; b.points += 3;
    }
    else {
      a.draw++; b.draw++; a.points++; b.points++;
    }
    a.gd = a.gf - a.ga
    b.gd = b.gf - b.ga
  });
  
  const tbody = document.getElementById("leaderboardBody");
  tbody.innerHTML = "";
  
  //Sort by points, then gd, then gf
  Object.entries(board).sort((a, b) => {
    const pointsDiff = b[1].points - a[1].points;
    if (pointsDiff !== 0) return pointsDiff;
    const gdDiff = b[1].gd - a[1].gd
    if (gdDiff !== 0) return gdDiff;
    return b[1].gf - a[1].gf;
  }).forEach(([team, stats]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${team}</td>
      <td>${stats.points}</td>
      <td>${stats.played}</td>
      <td>${stats.won}</td>
      <td>${stats.draw}</td>
      <td>${stats.lost}</td>
      <td>${stats.gf}</td>
      <td>${stats.ga}</td>
      <td>${stats.gd}</td>
    `;
    tbody.appendChild(row);
  });
}

//Initalizes
updateTeams();
updateResults();
updateLeaderboard();
