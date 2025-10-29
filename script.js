// update this if your sheet URL changes
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1mFO4VfkTJRbWyToBP2BSobb44HVDVfPrL04R7UdflYg/export?format=csv&gid=0";

let allData = [];
const container = document.getElementById("cards");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const branchSelect = document.getElementById("filterBranch");
const courseSelect = document.getElementById("filterCourse");
const exportCSVBtn = document.getElementById("exportCSV");
const downloadAllPDFBtn = document.getElementById("downloadAllPDF");
const themeToggle = document.getElementById("themeToggle");

// --- Theme: remember preference ---
(function loadTheme(){
  const t = localStorage.getItem('theme');
  if(t === 'dark'){ document.body.classList.add('dark'); themeToggle.checked = true; }
})();
themeToggle.addEventListener('change', ()=>{
  if(themeToggle.checked){ document.body.classList.add('dark'); localStorage.setItem('theme','dark'); }
  else { document.body.classList.remove('dark'); localStorage.setItem('theme','light'); }
});

// --- Load sheet ---
Papa.parse(SHEET_CSV_URL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: (results) => {
    allData = results.data.map(r => {
      const clean = {};
      Object.keys(r).forEach(k => clean[k.trim().toLowerCase()] = (r[k] || '').trim());
      return clean;
    });

    populateFilters(allData);
    loader.style.display = 'none';
    container.style.display = 'grid';
    renderCards(allData);
  },
});

// --- populate dynamic filters ---
function populateFilters(data){
  const branches = new Set();
  const courses = new Set();
  data.forEach(s => {
    if(s['branch']) branches.add(s['branch']);
    if(s['course']) courses.add(s['course']);
  });
  Array.from(branches).sort().forEach(b => {
    const o = document.createElement('option'); o.value=b; o.textContent=b; branchSelect.appendChild(o);
  });
  Array.from(courses).sort().forEach(c => {
    const o = document.createElement('option'); o.value=c; o.textContent=c; courseSelect.appendChild(o);
  });
}

// --- utilities ---
function highlight(text, term){
  if(!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if(idx === -1) return text;
  return text.slice(0,idx) + `<span class="highlight">${text.slice(idx, idx+term.length)}</span>` + text.slice(idx+term.length);
}

// --- render cards ---
function renderCards(data){
  container.innerHTML = '';
  if(data.length === 0){
    container.innerHTML = `<p style="text-align:center;color:red;font-weight:bold;">No matching students found.</p>`;
    return;
  }

  const term = (searchInput.value||'').trim().toLowerCase();

  data.forEach(s => {
    const studentId = s['id no'] || s['id'] || s['roll'] || '';
    const studentUrl = window.location.origin + window.location.pathname.replace('index.html','') + 'student.html?id=' + encodeURIComponent(studentId);

    const card = document.createElement('div'); card.className = 'id-card';

    const nameHtml = highlight(s['name'] || '', term);
    const idHtml = highlight(studentId, term);
    const branchHtml = highlight(s['branch']||'', term);

    card.innerHTML = `
      <div class="college-header">
        <div class="college-name">${s['college name'] || ''}</div>
        ${s['logo'] ? `<img src="${s['logo']}" alt="logo">` : ''}
      </div>

      <div class="photo-box">
        ${s['photo'] ? `<img src="${s['photo']}" alt="photo">` : `<img src="https://via.placeholder.com/86" alt="photo">`}
      </div>

      <div class="info">
        <p><strong>ID:</strong> ${idHtml}</p>
        <p><strong>Name:</strong> ${nameHtml}</p>
        <p><strong>Branch:</strong> ${branchHtml}</p>
      </div>

      <div class="qr-box">
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(studentUrl)}&size=120x120" alt="QR">
      </div>

      <a class="btn" href="student.html?id=${encodeURIComponent(studentId)}">View Full ID</a>
    `;

    container.appendChild(card);
  });
}

// --- live filters/search ---
function getFiltered(){
  const term = (searchInput.value||'').trim().toLowerCase();
  const branch = branchSelect.value;
  const course = courseSelect.value;

  return allData.filter(s => {
    if(branch && (s['branch']||'') !== branch) return false;
    if(course && (s['course']||'') !== course) return false;
    if(!term) return true;
    return ((s['id no']||'').toLowerCase().includes(term) ||
            (s['id']||'').toLowerCase().includes(term) ||
            (s['name']||'').toLowerCase().includes(term) ||
            (s['roll']||'').toLowerCase().includes(term) ||
            (s['branch']||'').toLowerCase().includes(term) ||
            (s['course']||'').toLowerCase().includes(term));
  });
}

searchInput.addEventListener('input', () => renderCards(getFiltered()));
branchSelect.addEventListener('change', () => renderCards(getFiltered()));
courseSelect.addEventListener('change', () => renderCards(getFiltered()));

// --- Export filtered CSV ---
exportCSVBtn.addEventListener('click', () => {
  const filtered = getFiltered();
  if(filtered.length === 0){ alert('No records to export'); return; }

  // create CSV text
  const keys = Object.keys(filtered[0]);
  const rows = [keys.join(',')].concat(filtered.map(r => keys.map(k => `"${(r[k]||'').replace(/"/g,'""')}"`).join(',')));
  const csv = rows.join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'students_export.csv'; document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
});

// --- Download All Filtered as single PDF ---
downloadAllPDFBtn.addEventListener('click', async () => {
  const filtered = getFiltered();
  if(filtered.length === 0){ alert('No records to download'); return; }

  // create hidden container to render cards for PDF
  const wrap = document.createElement('div');
  wrap.style.position='fixed'; wrap.style.left='-9999px'; wrap.style.top='-9999px';
  document.body.appendChild(wrap);

  // render each card and convert to canvas & add to PDF
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit:'px', format:'a4' });

  for(let i=0;i<filtered.length;i++){
    const s = filtered[i];
    const studentId = s['id no'] || s['id'] || s['roll'] || '';
    const html = buildPrintableCardHTML(s);
    wrap.innerHTML = html;
    // wait images load
    await waitForImages(wrap);
    const canvas = await html2canvas(wrap.firstElementChild, {scale:2, useCORS:true, backgroundColor:'#fff'});
    const imgData = canvas.toDataURL('image/png');
    // fit image to PDF page width
    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = canvas.width / canvas.height;
    const imgWidth = pageWidth - 40;
    const imgHeight = imgWidth / ratio;
    if(i>0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
  }

  // cleanup
  document.body.removeChild(wrap);
  pdf.save('students_bulk.pdf');
});

// helper: create printable card HTML string (simple)
function buildPrintableCardHTML(s){
  return `
    <div style="width:800px;padding:20px;background:#fff;border-radius:12px;font-family:Poppins, Arial;">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="font-weight:700;color:${getComputedStyle(document.documentElement).getPropertyValue('--primary')||'#0a58ca'}">${s['college name']||''}</div>
      </div>
      <div style="text-align:center;margin-top:12px">
        ${s['logo']?`<img src="${s['logo']}" style="width:80px;height:80px;object-fit:contain" crossorigin="anonymous">`:''}
      </div>
      <div style="display:flex;gap:20px;align-items:center;margin-top:14px">
        <div><img src="${s['photo']||'https://via.placeholder.com/100'}" style="width:120px;height:120px;border-radius:8px;object-fit:cover" crossorigin="anonymous"></div>
        <div>
          <p><strong>ID No:</strong> ${s['id no']||''}</p>
          <p><strong>Name:</strong> ${s['name']||''}</p>
          <p><strong>Branch:</strong> ${s['branch']||''}</p>
          <p><strong>Course:</strong> ${s['course']||''}</p>
          <p><strong>Valid Upto:</strong> ${s['valid upto']||''}</p>
        </div>
      </div>
    </div>
  `;
}

// wait for images to load inside element
function waitForImages(el, timeout=8000){
  const imgs = Array.from(el.querySelectorAll('img'));
  if(imgs.length===0) return Promise.resolve();
  return Promise.race([
    Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(res=>{img.onload=res; img.onerror=res}))),
    new Promise((_, rej) => setTimeout(()=>rej('image load timeout'), timeout))
  ]);
}
