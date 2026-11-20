# Formulário de contato com Google Sheets

Projeto vanilla (HTML, CSS e JavaScript) para receber mensagens em uma planilha do Google Sheets por meio de um web app do Google Apps Script. Não há dependências, etapa de build ou servidor backend próprio.

## Como funciona

1. `index.html` apresenta o formulário.
2. `js/script.js` valida os campos e envia `nome`, `email` e `mensagem` em JSON.
3. `doc/app-script.js` recebe os dados e adiciona uma linha à aba `Form` da planilha, criando o cabeçalho se a aba estiver vazia.
4. `js/config.js` fornece a URL do web app. Esse arquivo local é ignorado pelo Git; use `js/config.example.js` como modelo.

## Configurar o Google Apps Script

### Criar o script vinculado à planilha

1. Crie uma planilha no Google Sheets. Renomeie uma das abas para `Form`, respeitando as letras maiúsculas.
2. Na planilha, abra **Extensões > Apps Script**. Isso cria um projeto vinculado à planilha, que permite ao script acessá-la com `SpreadsheetApp.getActiveSpreadsheet()`.
3. No editor do Apps Script, abra o arquivo `Code.gs`, remova o conteúdo de exemplo e cole todo o conteúdo de `doc/app-script.js`.
4. Salve o projeto. Não execute `doPost` pelo botão **Executar**: essa função precisa receber uma requisição HTTP, que será enviada pelo formulário.

O handler `doPost` procura a aba `Form`, cria o cabeçalho `Data`, `Nome`, `Email`, `Mensagem` se a aba estiver vazia e acrescenta os dados recebidos. Se a aba não existir ou tiver outro nome, o envio falhará.

### Implantar como app da Web

1. No Apps Script, clique em **Implantar > Nova implantação**.
2. Abra as opções de tipo de implantação, escolha **App da Web** e configure:
   - **Executar como:** sua conta (a conta que tem acesso de edição à planilha).
   - **Quem pode acessar:** **Qualquer pessoa** para permitir envios sem login. Essa configuração torna o endpoint público; qualquer pessoa com a URL poderá enviar dados ao script.
3. Clique em **Implantar** e siga as etapas de autorização do Google. Revise as permissões e autorize o script usando a conta proprietária da planilha.
4. Copie a **URL do app da Web** apresentada pelo Google. Use a URL de produção terminada em `/exec`, não uma URL de teste terminada em `/dev`.

Se a opção **Qualquer pessoa** não estiver disponível, as políticas da conta Google Workspace podem restringir implantações públicas. Use uma conta ou configuração autorizada pelo administrador. Não é necessário compartilhar a planilha com os visitantes do formulário: o app é executado como o proprietário.

### Atualizar uma implantação existente

Salvar alterações no editor não atualiza automaticamente um app da Web já implantado. Abra **Implantar > Gerenciar implantações**, edite a implantação, selecione uma nova versão e implante novamente. A URL `/exec` existente normalmente permanece a mesma.

Para validar a configuração, envie uma mensagem pelo formulário e confirme se uma linha foi adicionada à aba `Form`. O navegador usa `no-cors` e não consegue ler a resposta do Apps Script, então a confirmação deve ser feita na planilha.

## Configurar e executar localmente

Na raiz do projeto, crie o arquivo de configuração local a partir do exemplo:

```powershell
Copy-Item js\config.example.js js\config.js
```

Edite `js/config.js` e substitua `COLE_A_URL_DO_WEB_APP_AQUI` pela URL `/exec` obtida na implantação:

```js
const API_URL = 'URL_DO_SEU_WEB_APP';
```

`js/config.js` está no `.gitignore`; mantenha a URL de implantação nesse arquivo, não em `index.html` ou `js/script.js`.

## Publicar o formulário

Publique `index.html`, `css/` e `js/` em qualquer hospedagem de site estático. Como `js/config.js` não é versionado, configure a URL do web app nesse arquivo também no ambiente de publicação. O formulário deve ser servido por HTTP ou HTTPS, não aberto diretamente como arquivo local.

## Para deploy (Netlify)

```Build command
test -n "$API_URL" && echo "const API_URL = '$API_URL';" > js/config.js
```

## Dados gravados

A aba `Form` recebe as colunas `Data`, `Nome`, `Email` e `Mensagem`. O web app precisa ter acesso de edição à planilha e a implantação deve permitir que os usuários do formulário o acessem.
