const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1mFO4VfkTJRbWyToBP2BSobb44HVDVfPrL04R7UdflYg/export?format=csv&gid=0";

let allData = [];
const container = document.getElementById("cards");

// ✅ Load Data
Papa.parse(SHEET_CSV_URL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: (results) => {
    allData = results.data.map(r => {
      const clean = {};
      Object.keys(r).forEach(k => clean[k.trim().toLowerCase()] = (r[k] || "").trim());
      return clean;
    });
    renderCards(allData);
  },
});

// ✅ Render student cards
function renderCards(data) {
  container.innerHTML = "";
  if (data.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:red;font-weight:bold;">No matching students found.</p>`;
    return;
  }

  data.forEach(s => {
    const card = document.createElement("div");
    card.className = "id-card";

    const studentId = s["id no"] || s["id"] || s["roll"] || "";
    const studentUrl =
      window.location.origin +
      window.location.pathname.replace("index.html", "") +
      "student.html?id=" + encodeURIComponent(studentId);

    card.innerHTML = `
      <div class="college-header">
        <div class="college-name">${s["college name"] || ""}</div>
        ${s["logo"] ? `<img src="${s["logo"]}" alt="logo">` : ""}
      </div>

      <div class="photo-box">
        ${s["photo"] ? `<img src="${s["photo"]}" alt="photo">` : ""}
      </div>

      <div class="info">
        <p><strong>ID:</strong> ${studentId}</p>
        <p><strong>Name:</strong> ${s["name"] || ""}</p>
        <p><strong>Branch:</strong> ${s["branch"] || ""}</p>
      </div>

      <div class="qr-box">
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(studentUrl)}&size=120x120" alt="QR">
      </div>

      <a class="btn" href="student.html?id=${encodeURIComponent(studentId)}">View Full ID</a>
    `;

    container.appendChild(card);
  });
}

// ✅ Live Search Filter
document.getElementById("searchInput").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();

  const filtered = allData.filter(s =>
    (s["id no"] || "").toLowerCase().includes(term) ||
    (s["id"] || "").toLowerCase().includes(term) ||
    (s["name"] || "").toLowerCase().includes(term) ||
    (s["roll"] || "").toLowerCase().includes(term) ||
    (s["branch"] || "").toLowerCase().includes(term) ||
    (s["course"] || "").toLowerCase().includes(term)
  );

  renderCards(filtered);
});
