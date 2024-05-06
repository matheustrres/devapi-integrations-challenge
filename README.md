<h1 align="center">
  <a href="https://github.com/godevapi/vagas/tree/master/integrations">
  Desafio de integrações DevApi
  </a>
</h1>

<p align="center">Aplicação de uma integração entre o Google Sheets e o HubSpot para desafio de
processo seletivo da empresa DevApi

## Variáveis de Ambiente

Para rodar este projeto, você precisará das seguintes variáveis de ambiente no arquivo .env:

`GOOGLE_PRIVATE_KEY=""`

`GOOGLE_CLIENT_EMAIL=""`

`HUBSPOT_ACCESS_TOKEN=""`

### Gerando credenciais do Google

Para obter as credenciais do Google, siga o passo a passo abaixo:

- Visite o **[Console do Google Cloud](https://console.cloud.google.com/)** e faça login com sua conta do Google.

- Selecione ou crie um projeto para criar a conta de serviço, feito no canto superior esquerdo do console.

- No painel de navegação à esquerda, clique em `APIs e serviços` e, depois, em `Credenciais`.

- Na aba `Credenciais`, clique em `CRIAR CREDENCIAIS`, no canto superior esquerdo, e selecione `Conta de serviço`.

- Após configurar e criar uma conta de serviço, gere as credenciais necessárias. Para isso, clique na conta de serviço e depois na guia `Chaves`. Em seguida, clique em `Adicionar chave`, selecione `Criar nova chave` e escolha o tipo de chave como `JSON`.

- Abra o arquivo JSON baixado, copie os valores das propriedades `"client_email"` e `"private_key"` e os repasse às variáveis `GOOGLE_CLIENT_EMAIL` e `GOOGLE_PRIVATE_KEY`, respectivamente, no arquivo .env.

### Gerando credenciais do HubSpot

Para obter as credenciais do HubSpot, siga o passo a passo abaixo:

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
pnpm start:prod
```

## Licença

Este projeto está licenciado sob a licença **[GPL 3.0](https://github.com/matheustrres/devapi-integrations-challenge/blob/main/LICENSE)**.
