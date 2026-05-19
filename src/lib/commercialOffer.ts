import { SERVICES } from "@/components/landing/data";

export function downloadCommercialOffer() {
  const date = new Date().toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const rowsHtml = SERVICES.map(
    (s, i) => `
      <tr>
        <td class="num">${i + 1}</td>
        <td>
          <div class="srv-title">${s.title}</div>
          <div class="srv-desc">${s.desc}</div>
        </td>
        <td class="price">${s.price}</td>
      </tr>`,
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Коммерческое предложение — Страйк Сервис</title>
<style>
  @page { size: A4; margin: 18mm 14mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    color: #0f172a;
    margin: 0;
    padding: 0;
    font-size: 12pt;
    line-height: 1.5;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 14px;
    border-bottom: 3px solid #0ea5e9;
    margin-bottom: 22px;
  }
  .logo {
    font-size: 22pt;
    font-weight: 900;
    letter-spacing: 1px;
    color: #0ea5e9;
  }
  .logo span { color: #0f172a; }
  .header-right {
    text-align: right;
    font-size: 9.5pt;
    color: #475569;
    line-height: 1.6;
  }
  h1 {
    font-size: 20pt;
    font-weight: 800;
    margin: 0 0 6px;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .subtitle {
    color: #64748b;
    font-size: 11pt;
    margin-bottom: 22px;
  }
  .intro {
    background: #f0f9ff;
    border-left: 4px solid #0ea5e9;
    padding: 14px 18px;
    margin-bottom: 22px;
    font-size: 11pt;
    color: #334155;
    border-radius: 4px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 22px;
  }
  thead th {
    background: #0f172a;
    color: #fff;
    padding: 11px 12px;
    text-align: left;
    font-size: 10.5pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  thead th.num { width: 36px; text-align: center; }
  thead th.price { width: 130px; text-align: right; }
  tbody td {
    border-bottom: 1px solid #e2e8f0;
    padding: 12px;
    vertical-align: top;
  }
  tbody td.num {
    text-align: center;
    color: #94a3b8;
    font-weight: 700;
  }
  .srv-title {
    font-weight: 700;
    font-size: 11pt;
    color: #0f172a;
    margin-bottom: 3px;
  }
  .srv-desc {
    color: #64748b;
    font-size: 9.5pt;
    line-height: 1.45;
  }
  tbody td.price {
    text-align: right;
    font-weight: 800;
    color: #0ea5e9;
    font-size: 12pt;
    white-space: nowrap;
  }
  .benefits {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 22px;
  }
  .benefits h3 {
    margin: 0 0 10px;
    font-size: 12pt;
    color: #0f172a;
  }
  .benefits ul {
    margin: 0;
    padding-left: 18px;
    color: #334155;
    font-size: 10.5pt;
  }
  .benefits li { margin-bottom: 4px; }
  .contacts {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    color: #fff;
    border-radius: 10px;
    padding: 18px 22px;
    margin-bottom: 18px;
  }
  .contacts h3 {
    margin: 0 0 8px;
    font-size: 13pt;
  }
  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px 18px;
    font-size: 10.5pt;
  }
  .contacts-grid b { font-weight: 700; }
  .requisites {
    border-top: 1px solid #e2e8f0;
    padding-top: 14px;
    font-size: 8.5pt;
    color: #64748b;
    line-height: 1.55;
  }
  .requisites .label {
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 7.5pt;
  }
  .req-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px 18px;
    margin-top: 4px;
  }
  .actions {
    text-align: center;
    margin: 30px 0 10px;
    padding-top: 18px;
  }
  .actions .btn {
    display: inline-block;
    padding: 10px 0;
    color: #475569;
    font-size: 10pt;
  }
  @media print {
    .no-print { display: none !important; }
  }
  .no-print {
    position: fixed;
    top: 14px;
    right: 14px;
    z-index: 1000;
    display: flex;
    gap: 10px;
  }
  .no-print button {
    background: #0ea5e9;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(14,165,233,0.35);
  }
  .no-print button.secondary {
    background: #fff;
    color: #0f172a;
    border: 1px solid #cbd5e1;
  }
</style>
</head>
<body>

<div class="no-print">
  <button onclick="window.print()">Сохранить в PDF</button>
  <button class="secondary" onclick="window.close()">Закрыть</button>
</div>

<div class="header">
  <div>
    <div class="logo">СТРАЙК<span> СЕРВИС</span></div>
    <div style="color:#64748b;font-size:9.5pt;margin-top:4px;">Климатические системы под ключ</div>
  </div>
  <div class="header-right">
    <b>ООО «Страйк Сервис»</b><br>
    г. Тюмень, ул. Широтная, 165 к.3<br>
    +7 (495) 123-45-67<br>
    info@techservice.ru<br>
    straikservis.ru
  </div>
</div>

<h1>Коммерческое предложение</h1>
<div class="subtitle">от ${date}</div>

<div class="intro">
  Уважаемый клиент! Благодарим за интерес к нашим услугам. Ниже представлен перечень
  работ по обслуживанию, монтажу и ремонту климатического оборудования с актуальной стоимостью.
  Цены указаны без учёта индивидуальных скидок — итоговая стоимость согласовывается после выезда мастера.
</div>

<table>
  <thead>
    <tr>
      <th class="num">№</th>
      <th>Услуга</th>
      <th class="price">Стоимость</th>
    </tr>
  </thead>
  <tbody>
    ${rowsHtml}
  </tbody>
</table>

<div class="benefits">
  <h3>Почему выбирают нас</h3>
  <ul>
    <li>Авторизованный сервисный центр ведущих производителей климатической техники</li>
    <li>Выезд мастера в течение 2 часов, работаем 365 дней в году</li>
    <li>Гарантия на все виды работ до 3 лет</li>
    <li>Оригинальные запчасти и сертифицированные материалы</li>
    <li>Более 5000 довольных клиентов в Тюмени и области</li>
  </ul>
</div>

<div class="contacts">
  <h3>Связаться с нами</h3>
  <div class="contacts-grid">
    <div><b>Телефон:</b> +7 (495) 123-45-67</div>
    <div><b>Email:</b> info@techservice.ru</div>
    <div><b>Адрес:</b> г. Тюмень, ул. Широтная, 165 к.3</div>
    <div><b>Сайт:</b> straikservis.ru</div>
  </div>
</div>

<div class="requisites">
  <div class="label">Реквизиты организации</div>
  <div class="req-grid">
    <div><b>ООО «Страйк Сервис»</b></div>
    <div><b>ИНН / КПП:</b> 7203487449 / 720301001</div>
    <div><b>ОГРН:</b> 1197232021832</div>
    <div><b>Лицензия:</b> 72.ОЦ.04.003.Л.000033.04.26</div>
    <div style="grid-column:1/-1;"><b>ЕРУЛ:</b> № Л064-00111-72/04921336</div>
  </div>
</div>

<div class="actions">
  <div class="btn">Предложение действительно в течение 30 дней с даты составления</div>
</div>

<script>
  setTimeout(function() { window.print(); }, 350);
</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");

  if (!win) {
    const a = document.createElement("a");
    a.href = url;
    a.download = "Коммерческое-предложение-Страйк-Сервис.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
