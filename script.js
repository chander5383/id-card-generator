/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Poppins", sans-serif;
  background: #eef3f9;
  color: #222;
}

/* Header and Footer */
header, footer {
  text-align: center;
  background: #0a58ca;
  color: #fff;
  padding: 10px 0;
}

footer {
  font-size: 0.9rem;
}

/* ========== CARD GRID ========== */
.card-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 30px;
  padding: 40px 20px;
}

/* ========== CARD ========== */
.id-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  text-align: center;
  width: 320px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease;
}

.id-card:hover {
  transform: translateY(-5px);
}

.id-card.single {
  width: 420px;
  max-width: 95%;
  margin: 40px auto;
  padding: 35px 25px;
}

/* Watermark Logo */
.id-card::before {
  content: "";
  background: url('') no-repeat center;
  background-size: 200px;
  opacity: 0.08;
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* Apply dynamic watermark logo in JS */
.id-card.has-watermark::before {
  opacity: 0.08;
}

/* College Name */
.college-name {
  font-weight: 700;
  color: #004080;
  margin-bottom: 8px;
  font-size: 1.1rem;
  z-index: 1;
}

/* Photo */
.photo-box {
  display: flex;
  justify-content: center;
  z-index: 1;
}
.photo-box img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
}

/* Info */
.info {
  text-align: left;
  margin-top: 15px;
  padding: 0 10%;
  z-index: 1;
}
.info p {
  margin: 5px 0;
  font-size: 0.9rem;
}

/* Logo */
.logo.watermark {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 60px;
  opacity: 0.5;
  pointer-events: none; /* Disable hover move */
}

/* QR */
.qr {
  display: flex;
  justify-content: center;
  margin: 15px 0;
  z-index: 1;
}

/* Buttons */
.view-btn, .download-btn {
  background: #0a58ca;
  color: #fff;
  padding: 8px 15px;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 5px;
  display: inline-block;
  transition: background 0.3s;
  z-index: 1;
}

.view-btn:hover, .download-btn:hover {
  background: #063b8b;
}

/* Responsive */
@media (max-width: 768px) {
  .id-card {
    width: 90%;
  }
  .id-card.single {
    width: 90%;
    margin-top: 20px;
  }
}
