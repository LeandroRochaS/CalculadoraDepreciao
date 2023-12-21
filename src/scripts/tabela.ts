import jspdf from "jspdf";

export function exportTableToPdf(table: HTMLTableElement) {
  const dados = [];
  for (let i = 0; i < table.rows.length; i++) {
    const cedula = table.rows[i].cells[0].innerText;
    const linha = {
      cedula,
      valor1: table.rows[i].cells[1].innerText,
      valor2: table.rows[i].cells[2].innerText,
      valor3: table.rows[i].cells[3].innerText,
      valor4: table.rows[i].cells[4].innerText,
      valor5: table.rows[i].cells[5].innerText,
    };
    dados.push(linha);
  }

  // Criar um novo documento PDF
  const doc = new jspdf();

  // Adicionar título ao PDF
  doc.text("Relatorio de Depreciação", 10, 10);

  // Gerar tabela no PDF
  let y = 20;
  doc.setFontSize(8); // Reduzir o tamanho da fonte para 8 pontos

  for (const linha of dados) {
    doc.text(linha.cedula, 10, y);
    doc.text(linha.valor1, 20, y);
    doc.text(linha.valor2, 50, y);
    doc.text(linha.valor3, 90, y);
    doc.text(linha.valor4, 130, y);
    doc.text(linha.valor5, 180, y);
    y += 10;
  }

  // Salvar o PDF
  doc.save("tabela.pdf");
}
