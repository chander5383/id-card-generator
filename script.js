// Replace with your Google Sheet CSV export link
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/GOOGLE_SHEET_ID/export?format=csv&gid=0";

function loadCsvAndGenerate() {
  Papa.parse(SHEET_CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const students = results.data.map(row => {
        const clean = {};
        Object.keys(row).forEach(k => clean[k.trim()] = row[k]);
        return clean;
      });
      generateCards(students);
    },
    error: function(err) {
      document.getElementById('cards').innerText = "❌ Error loading data.";
      console.error(err);
    }
  });
}

function generateCards(students) {
  const container = document.getElementById('cards');
  container.innerHTML = "";

  students.forEach(student => {
    const card = document.createElement('div');
    card.className = "id-card";

    const studentLink = `student.html?id=${encodeURIComponent(student['ID No'])}`;
    card.innerHTML = `
      <div class="card-inner">
        ${student['Logo'] ? `<img src="${student['Logo']}" class="logo watermark">` : ''}
        <div class="college-name">${student['College Name'] || ''}</div>
        <div class="photo-box">
          ${student['Photo'] ? `<img src="${student['Photo']}" alt="Photo">` : ''}
        </div>
        <div class="info">
          <p><strong>ID:</strong> ${student['ID No']}</p>
          <p><strong>Name:</strong> ${student['Name']}</p>
          <p><strong>Branch:</strong> ${student['Branch']}</p>
        </div>
        <div class="qr" id="qr-${student['ID No']}"></div>
        <a href="${studentLink}" class="view-btn">View Full ID</a>
      </div>
    `;
    container.appendChild(card);

    new QRCode(document.getElementById(`qr-${student['ID No']}`), {
      text: studentLink,
      width: 80,
      height: 80
    });
  });
}

document.addEventListener("DOMContentLoaded", loadCsvAndGenerate);
