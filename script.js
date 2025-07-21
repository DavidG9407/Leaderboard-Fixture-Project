const form = document.getElementById("scoreForm");
const matchList = document.getElementById("matchList");
const leaderboardTable = document.querySelector("#leaderboardTable tbody");

let matches = JSON.parse(localStorage.getItem("matches")) || {};

function saveMatches() {
  localStorage.setItem("matches", JSON.stringify(matches));
}

function renderMatches() {
  matchList.innerHTML = "";
  matches.forEach(match => {
    const item = document.createElement("li");
    item.textContent = '${match.team1} ${match.score1} - ${match.score2} ${match.team2};
    matchList.appendChild(item);
  });
}

function renderLeaderboard() {
  const leaderboard = {};

  matches.forEach(({ team1, score1, team2, score2 }) => {
    if (!leaderboard[team1]) leaderboard[team1] = {played: 0, wins: 0, losses: 0, gd: 0};
    if (!leaderboard[team2]) leaderboard[team2] = {played: 0, wins: 0, losses: 0, gd: 0);

    leaderboard[team1].player++;
    leaderboard[team2].played++;

    leaderboard[team1].gd += score1 - score2;
    leaderboard[team2].gd += score2 - score1;

    if (score1 > score2) {
      leaderboard[team1].wins++;
      leaderboard[team2].lossess++;
    } 
    else if (score2 > score1> {
      leaderboard[team2].wins++;
      leaderboard[team1].losses++;
    }
  });
  
  const sortedTeams = Object.entries(leaderboard).sort((a, b) => {
    const teamA = a[1];
    const teamB = b[1];
    if (teamB.wins !== teamA.wins) return teamB.wins - teamA.wins;
    return teamB.gd - teamA.gd;
  });
  
  leaderboardTable.innerHTML = "";
  sortedTeams.forEach(([name, data]) => {
    const row = document.createElement("tr");
    row.innerHTML = '
      <td>${name}</td>
      <td>${data.played}</td>
      <td>${data.wins}</td>
      <td>${data.losses}</td>
      <td>${data.gd}</td>
    ';
    leaderboardTable.appendChild(row);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const team1 = document.getElementById("team1").value.trim();
  const score1 = parseInt(document.getElementById("score1").value);
  const team2 = document.getElementById("team2").value.trim();
  const score2 = parseInt(document.getElementById("score2").value);

  if (team1 && team2 && !isNaN(score1) && !isNaN(score2)) {
    matches.push({ team1, score1, team2, score2 });
    saveMatches();
    renderMatches();
    renderLeaderboard();
    form.reset();
  }
});

// Rendering
renderMatches();
renderLeaderboard();
