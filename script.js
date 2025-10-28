// ✅ Student ID Card Loader Script (Final with top-right logo)
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
          <div class="id-card" style="position: relative;">

            ${
              s["logo"]
                ? `<img src="${s["logo"]}" alt="logo" 
                     style="position:absolute; top:12px; right:12px; width:45px; height:45px; object-fit:contain;">`
                : ""
            }

            <div class="college-name" 
                 style="text-align:center; font-weight:700; color:#004080; margin-bottom:8px; font-size:1.05rem;">
              ${s["college name"] || ""}
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
