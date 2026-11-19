// Arquivo configurado para receber os dados do formulário e salvar na planilha do Google Sheets.

function doPost(e) {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const aba = planilha.getSheetByName("Form");

  if (!aba) {
    throw new Error('A aba "Form" não existe.');
  }

  if (aba.getLastRow() === 0) {
    aba.appendRow(["Data", "Nome", "Email", "Mensagem"]);
  }

  const dados = JSON.parse(e.postData.contents);
  aba.appendRow([
    new Date(),
    dados.nome || "",
    dados.email || "",
    dados.mensagem || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ sucesso: true }))
    .setMimeType(ContentService.MimeType.JSON);
}