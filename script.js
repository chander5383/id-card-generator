const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1mFO4VfkTJRbWyToBP2BSobb44HVDVfPrL04R7UdflYg/export?format=csv&gid=0";

Papa.parse(SHEET_CSV_URL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: (results) => {
    const data = results.data.map(r => {
      const clean = {};
      Object.keys(r).forEach(k => clean[k.trim().toLowerCase()] = (r[k] || "").trim());
      return clean;
    });

    const container = document.getElementById("cards");
    container.innerHTML = "";

    data.forEach(s => {
      const card = document.createElement("div");
      card.className = "id-card";

      card.innerHTML = `
        <div class="college-header">
          <div class="college-name">${s["college name"] || ""}</div>
          ${s["logo"] ? `<img src="${s["logo"]}" alt="logo">` : ""}
        </div>

        <div class="photo-box">
          ${s["photo"] ? `<img src="${s["photo"]}" alt="photo">` : ""}
        </div>

        <div class="info">
          <p><strong>ID:</strong> ${s["id no"] || s["id"] || ""}</p>
          <p><strong>Name:</strong> ${s["name"] || ""}</p>
          <p><strong>Branch:</strong> ${s["branch"] || ""}</p>
        </div>

        <div class="qr-box">
          <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
            window.location.origin + window.location.pathname.replace("index.html", "") +
            "student.html?id=" + encodeURIComponent(s["id no"] || s["id"] || s["roll"])
          )}&size=120x120" alt="QR">
        </div>

        <a class="btn" href="student.html?id=${encodeURIComponent(s["id no"] || s["id"] || s["roll"])}">View Full ID</a>
      `;

      container.appendChild(card);
    });
  },
});
