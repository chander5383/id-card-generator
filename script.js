async function loadExcel() {
  const fileUrl = 'https://raw.githubusercontent.com/YOUR_USERNAME/id-card-generator/main/students.xlsx';
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);
  generateCards(data);
}

function generateCards(students) {
  const container = document.getElementById('cards');
  students.forEach(student => {
    const card = document.createElement('div');
    card.className = 'id-card';
    const studentLink = `student.html?id=${encodeURIComponent(student['ID No'])}`;
    card.innerHTML = `
      <img src="${student['Logo']}" class="logo watermark">
      <div class="college-name">${student['College Name']}</div>
      <p><strong>ID No:</strong> ${student['ID No']}</p>
      <p><strong>Name:</strong> ${student['Name']}</p>
      <p><strong>Branch:</strong> ${student['Branch']}</p>
      <div class="photo">
        <img src="${student['Photo']}" />
        <div id="qr-${student['Roll']}"></div>
      </div>
    `;
    container.appendChild(card);

    new QRCode(document.getElementById(`qr-${student['Roll']}`), {
      text: studentLink,
      width: 100,
      height: 100
    });
  });
}

loadExcel();
