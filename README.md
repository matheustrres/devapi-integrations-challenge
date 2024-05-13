<h1 align="center">
  Desafio de integrações DevApi
  </a>
</h1>

<p align="center">Aplicação de uma integração entre o Google Sheets e o HubSpot para <a href="https://github.com/godevapi/vagas/tree/master/integrations" target="_blank">desafio técnico</a> de
processo seletivo da empresa DevApi

<p align="center">
  • <a href="#funcionalidades">Funcionalidades</a><br>
  • <a href="#variaveis-de-ambiente">Variáveis de ambiente</a><br>
  • <a href="#rodando-localmente">Rodando localmente</a><br>
  • <a href="#rodando-os-testes">Rodando os testes</a><br>
  • <a href="#ferramentas-utilizadas">•Ferramentas utilizadas</a>
</p>

## Funcionalidades

- Integração entre as plataformas Google Sheets e HubSpot CRM
- Autenticação de usuário nas plataformas mencionadas
- Importação de contatos de uma planilha do Google Sheets diretamente para o HubSpot

## Variaveis de ambiente

Para rodar este projeto, você irá precisar das seguintes variáveis de ambiente:

`GOOGLE_API_KEY=""`
`GOOGLE_SPREADSHEET_ID`="1VUP5yPfk25qgDYBB1PrpC-S5hjjGbrKOhmJ_tibeWwA"
`GOOGLE_SPREADSHEET_RANGE`="Página1!A1:E30"

`HUBSPOT_ACCESS_TOKEN=""`

Lembre-se de criar seu arquivo .env corretamente:

```bash
cp -r .env.sample .env
```

### Gerando Chave de API do Google

Para obter uma Chave de API do Google, siga o passo a passo abaixo:

- Visite o **[Console do Google Cloud](https://console.cloud.google.com/)** e faça login com sua conta do Google.

- Selecione ou crie um novo projeto, feito no canto superior esquerdo do console.

- No painel de navegação à esquerda, clique em `APIs e serviços` e, depois, em `Credenciais`.

- Na aba `Credenciais`, clique em `+ CRIAR CREDENCIAIS`, no barra de navegação superior, e selecione `Chave de API`.

- Copie a Chave de API gerada e cole como o valor da chave de ambiente `GOOGLE_API_KEY`, no arquivo .env.

### Gerando token de acesso do HubSpot

Para obter o token de acesso do HubSpot, siga o passo a passo abaixo:

- Na sua conta **[HubSpot](https://app.hubspot.com/home)**, clique no ícone de configurações (engrenagem) na barra de navegação superior.

- No menu da barra lateral esquerda, acesse `Integrações` > `Aplicativos privados`.

- Selecione ou crie um novo aplicativo. Apenas lembre-se de adicionar o escopo `crm.objects.contacts` tanto para leitura quanto para escrita.

- Após criado o aplicativo, copie o token de acesso que será exibido na tela e o repasse para a variável `HUBSPOT_ACCESS_TOKEN` no arquivo .env.

## Rodando localmente

Clone o projeto:

```bash
git clone https://github.com/matheustrres/devapi-integrations-challenge.git
```

Entre no diretório do projeto:

```bash
cd devapi-integrations-challenge
```

Instale as dependências necessárias:

```bash
pnpm install
```

Inicie o servidor para fazer a migração de contatos do Google Sheets para o Hubspot:

```bash
pnpm start
```

## Rodando os testes

Para rodar os testes, execute o seguinte comando:

```bash
pnpm test
```


## Ferramentas utilizadas

- Node.js
- Javascript

## Licença

Este projeto está licenciado sob a licença **[GPL 3.0](https://github.com/matheustrres/devapi-integrations-challenge/blob/main/LICENSE)**.
