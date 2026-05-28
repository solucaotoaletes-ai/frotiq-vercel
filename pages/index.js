export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{__html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FROTIQ - Vistoria de Veículos</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0a0d13; 
            color: #e4e7eb;
            line-height: 1.6;
          }
          .container { display: flex; height: 100vh; }
          .sidebar { 
            width: 250px; 
            background: #0f1219; 
            border-right: 1px solid #1a2335; 
            padding: 20px;
            overflow-y: auto;
          }
          .sidebar h2 { 
            font-size: 18px; 
            margin-bottom: 30px;
            color: #f5b81e;
          }
          .menu-item { 
            padding: 12px 15px; 
            margin: 5px 0; 
            border-radius: 8px; 
            cursor: pointer;
            background: transparent;
            border: none;
            color: #8b92a9;
            font-size: 14px;
            width: 100%;
            text-align: left;
            transition: all 0.2s;
          }
          .menu-item:hover { 
            background: #1a2335; 
            color: #e4e7eb;
          }
          .menu-item.active { 
            background: #f5b81e;
            color: #0a0d13;
            font-weight: 600;
          }
          .main {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .header {
            padding: 20px 28px;
            border-bottom: 1px solid #1a2335;
            background: #0f1219;
          }
          .header h1 { 
            font-size: 20px; 
            margin-bottom: 5px;
          }
          .header p { 
            font-size: 12px; 
            color: #8b92a9;
          }
          .content {
            flex: 1;
            overflow-y: auto;
            padding: 28px;
          }
          .card {
            background: #131820;
            border: 1px solid #1a2335;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .card-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #e4e7eb;
          }
          .vistoria-item {
            background: #0f1219;
            border: 1px solid #1a2335;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .vistoria-item:hover {
            border-color: #f5b81e;
            background: #1a2335;
          }
          .vistoria-item.active {
            border-color: #f5b81e;
            background: #1a23351a;
          }
          .vistoria-placa {
            font-size: 14px;
            font-weight: 600;
            color: #e4e7eb;
            font-family: 'Courier New', monospace;
          }
          .vistoria-info {
            font-size: 12px;
            color: #8b92a9;
            margin-top: 5px;
          }
          .details {
            margin-top: 20px;
            padding: 20px;
            background: #0f1219;
            border-radius: 10px;
            border: 1px solid #1a2335;
          }
          .detail-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          .detail-item {
            background: #131820;
            padding: 12px;
            border-radius: 8px;
          }
          .detail-label {
            font-size: 11px;
            color: #8b92a9;
            text-transform: uppercase;
          }
          .detail-value {
            font-size: 14px;
            font-weight: 600;
            color: #e4e7eb;
            margin-top: 5px;
          }
          .photos {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .photo-link {
            background: #131820;
            border: 1px solid #1a2335;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            text-decoration: none;
            color: #f5b81e;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 12px;
            font-weight: 500;
          }
          .photo-link:hover {
            border-color: #f5b81e;
            background: #1a2335;
          }
          .items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 10px;
          }
          .item-badge {
            background: #131820;
            border-radius: 8px;
            padding: 10px;
            font-size: 11px;
            border: 1px solid #1a2335;
          }
          .item-name {
            font-size: 10px;
            color: #8b92a9;
            margin-bottom: 5px;
            text-transform: uppercase;
          }
          .item-status {
            font-size: 12px;
            font-weight: 600;
          }
          .status-ok { color: #10b981; }
          .status-problema { color: #ef4444; }
          .status-aviso { color: #f5b81e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="sidebar">
            <h2>🚛 FROTIQ</h2>
            <button class="menu-item active" onclick="showVistoria()">✓ Vistoria</button>
          </div>
          
          <div class="main">
            <div class="header">
              <h1>Vistoria de Veículos</h1>
              <p>Solução Locadora de Toaletes Ltda.</p>
            </div>
            
            <div class="content">
              <div class="card">
                <div class="card-title">Histórico de Vistorias</div>
                <div id="vistoriasList"></div>
              </div>
              
              <div id="detailsPanel" style="display:none;">
                <div class="details" id="detailsContent"></div>
              </div>
            </div>
          </div>
        </div>

        <script>
          const vistorias = [
            {
              id: 1,
              data: "2026-05-06 15:30",
              unidade: "Várzea Grande",
              placa: "RAI5B96",
              km: 123,
              motorista: "Felipe",
              fotos: {
                frontal: "https://drive.google.com/open?id=1Ff1PNr4FE5o0cS2yNxr9A97XvcGXJbK9",
                lateral_motorista: "https://drive.google.com/open?id=1iSYXwM9yszzcw2eyDwsWrXIyokojMjG3",
                traseira: "https://drive.google.com/open?id=10xPXpYj8-qWw3sWZxCgwRta_7tFpe956",
                lateral_carona: "https://drive.google.com/open?id=1P895I4uON4odURSr0LfuUyHDc69Zcoh8"
              },
              itens: {
                "Parabrisa": "Bom",
                "Pneus Dianteiros": "Bom",
                "Pneus Traseiros": "Bom",
                "Radiador": "Acima do Meio",
                "Óleo": "Acima do Meio",
                "Freio": "No meio",
                "Embreagem": "No meio",
                "Pisca": "Funciona",
                "Seta Direita": "Funciona",
                "Seta Esquerda": "Funciona",
                "Farol Baixo": "Não funciona",
                "Farol Alto": "Funciona",
                "Luz de Ré": "Funciona",
                "Sirene de Ré": "Funciona",
                "Limpador": "Funciona",
                "Macaco": "Possui",
                "Chave de Roda": "Possui",
                "Triângulo": "Não possui",
                "Documento": "Não possui"
              }
            },
            {
              id: 2,
              data: "2026-05-28 07:22",
              unidade: "Sinop",
              placa: "BAV6C31",
              km: 347070,
              motorista: "Tayná",
              fotos: {
                frontal: "https://drive.google.com/open?id=1uq0H8DLaZtwo0mUhKLAX03DwhJuUjWet",
                lateral_motorista: "https://drive.google.com/open?id=1ExABTwQ_lvYSW1ckw54PTr9nS-2pHh2x",
                traseira: "https://drive.google.com/open?id=130cPyJ4WBtIeqd7sJYxmjupXCGzgWlAw",
                lateral_carona: "https://drive.google.com/open?id=1MhOKnJey2fc9-cxNHKlvs7yYYUEA7UuW"
              },
              itens: {
                "Parabrisa": "Bom",
                "Pneus Dianteiros": "Bom",
                "Pneus Traseiros": "Bom",
                "Radiador": "Acima do Meio",
                "Óleo": "Acima do Meio",
                "Freio": "Acima do Meio",
                "Embreagem": "Acima do Meio",
                "Pisca": "Funciona",
                "Seta Direita": "Funciona",
                "Seta Esquerda": "Funciona",
                "Farol Baixo": "Funciona",
                "Farol Alto": "Funciona",
                "Luz de Ré": "Funciona",
                "Sirene de Ré": "Funciona",
                "Limpador": "Funciona",
                "Macaco": "Possui",
                "Chave de Roda": "Possui",
                "Triângulo": "Possui",
                "Documento": "Possui"
              }
            },
            {
              id: 3,
              data: "2026-05-28 07:32",
              unidade: "Sinop",
              placa: "RAI5B96",
              km: 256422,
              motorista: "Ayanderson",
              fotos: {
                frontal: "https://drive.google.com/open?id=1cI32psdKJXUFxxXoR_KhX6XQP0VYKM1o",
                lateral_motorista: "https://drive.google.com/open?id=1on63Z9ObgX_FztMURb2gzcZc3AoSaL1z",
                traseira: "https://drive.google.com/open?id=1HcHqgpbW6JSfhDBeC8vJBb84BEtpP3FG",
                lateral_carona: "https://drive.google.com/open?id=1Suo-lsmSlzoba4T0V9DhguLcSPyvvsE-"
              },
              itens: {
                "Parabrisa": "Bom",
                "Pneus Dianteiros": "Bom",
                "Pneus Traseiros": "Bom",
                "Radiador": "No meio",
                "Óleo": "No meio",
                "Freio": "No meio",
                "Embreagem": "No meio",
                "Pisca": "Funciona",
                "Seta Direita": "Funciona",
                "Seta Esquerda": "Funciona",
                "Farol Baixo": "Funciona",
                "Farol Alto": "Funciona",
                "Luz de Ré": "Funciona",
                "Sirene de Ré": "Funciona",
                "Limpador": "Funciona",
                "Macaco": "Possui",
                "Chave de Roda": "Possui",
                "Triângulo": "Possui",
                "Documento": "Possui"
              }
            }
          ];

          function getStatus(valor) {
            if (!valor) return "não especificado";
            const s = String(valor).toLowerCase();
            if (s.includes("funciona") || s.includes("bom") || s.includes("acima") || s.includes("possui")) return "ok";
            if (s.includes("não funciona") || s.includes("não possui")) return "problema";
            return "aviso";
          }

          function getStatusClass(status) {
            if (status === "ok") return "status-ok";
            if (status === "problema") return "status-problema";
            return "status-aviso";
          }

          function getStatusLabel(status) {
            if (status === "ok") return "✓ OK";
            if (status === "problema") return "✗ Problema";
            return "! Atenção";
          }

          function renderVistoriasList() {
            const html = vistorias.map((v, i) => \`
              <div class="vistoria-item \${i === 0 ? 'active' : ''}" onclick="showDetails(\${i})">
                <div>
                  <div class="vistoria-placa">\${v.placa} • \${v.motorista.split(' ')[0]}</div>
                  <div class="vistoria-info">\${new Date(v.data).toLocaleDateString('pt-BR')} • \${v.unidade}</div>
                </div>
              </div>
            \`).join('');
            document.getElementById('vistoriasList').innerHTML = html;
          }

          function showDetails(index) {
            const v = vistorias[index];
            const itemsHtml = Object.entries(v.itens).map(([nome, valor]) => {
              const status = getStatus(valor);
              const statusClass = getStatusClass(status);
              return \`
                <div class="item-badge">
                  <div class="item-name">\${nome}</div>
                  <div class="item-status \${statusClass}">\${getStatusLabel(status)}</div>
                </div>
              \`;
            }).join('');

            const html = \`
              <div>
                <div class="detail-grid">
                  <div class="detail-item">
                    <div class="detail-label">Placa</div>
                    <div class="detail-value">\${v.placa}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Motorista</div>
                    <div class="detail-value">\${v.motorista}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Quilometragem</div>
                    <div class="detail-value">\${v.km.toLocaleString('pt-BR')}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Unidade</div>
                    <div class="detail-value">\${v.unidade}</div>
                  </div>
                </div>
                
                <h3 style="margin: 20px 0 15px; color: #e4e7eb;">Fotos do Veículo</h3>
                <div class="photos">
                  <a href="\${v.fotos.frontal}" target="_blank" class="photo-link">📸 Frontal</a>
                  <a href="\${v.fotos.lateral_motorista}" target="_blank" class="photo-link">📸 Lateral Motor</a>
                  <a href="\${v.fotos.traseira}" target="_blank" class="photo-link">📸 Traseira</a>
                  <a href="\${v.fotos.lateral_carona}" target="_blank" class="photo-link">📸 Lateral Carona</a>
                </div>
                
                <h3 style="margin: 20px 0 15px; color: #e4e7eb;">Status dos Itens</h3>
                <div class="items-grid">
                  \${itemsHtml}
                </div>
              </div>
            \`;
            
            document.getElementById('detailsContent').innerHTML = html;
            document.getElementById('detailsPanel').style.display = 'block';
            
            document.querySelectorAll('.vistoria-item').forEach((el, i) => {
              el.classList.toggle('active', i === index);
            });
          }

          function showVistoria() {
            // Menu click
          }

          renderVistoriasList();
          showDetails(0);
        </script>
      </body>
      </html>
    `}} />
  )
}
