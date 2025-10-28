// ✅ Student ID Card Loader Script (Final)
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1mFO4VfkTJRbWyToBP2BSobb44HVDVfPrL04R7UdflYg/export?format=csv&gid=0";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cards");
  container.innerHTML = "Loading...";

  Papa.parse(SHEET_CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const data = results.data.map((row) => {
        const clean = {};
        Object.keys(row).forEach((k) => {
          clean[k.trim().toLowerCase()] = (row[k] || "").trim();
        });
        return clean;
      });

      if (!data || data.length === 0) {
        container.innerHTML =
          "<p style='color:red;text-align:center;'>❌ No student data found.</p>";
        return;
      }

      container.innerHTML = data
        .map(
          (s) => `
          <div class="id-card">
            <div class="college-name" style="display:flex;justify-content:center;align-items:center;gap:6px;">
              <span>${s["college name"] || ""}</span>
              ${s["logo"]
                ? `<img src="${s["logo"]}" alt="logo" style="width:28px;height:28px;object-fit:contain;">`
                : ""}
            </div>

            <div class="photo-box">
              ${s["photo"] ? `<img src="${s["photo"]}" alt="photo">` : ""}
            </div>

            <div class="info">
              <p><strong>ID:</strong> ${s["id no"]}</p>
              <p><strong>Name:</strong> ${s["name"]}</p>
              <p><strong>Branch:</strong> ${s["branch"]}</p>
            </div>

            <div class="qr">
              <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                window.location.origin +
                  window.location.pathname.replace('index.html', '') +
                  'student.html?id=' +
                  s["id no"]
              )}&size=100x100" alt="QR" />
            </div>

            <a class="view-btn" href="student.html?id=${encodeURIComponent(
              s["id no"]
            )}">View Full ID</a>
          </div>
        `
        )
        .join("");
    },
    error: (err) => {
      console.error("Error loading sheet:", err);
      container.innerHTML =
        "<p style='color:red;text-align:center;'>❌ Error loading Google Sheet.</p>";
    },
  });
});
