# BigBurger Disparo

Painel web simples para gerenciar contatos autorizados e enviar mensagens pelo WhatsApp via Evolution API.

## Como subir no GitHub/Vercel

1. Envie todos os arquivos deste ZIP para a raiz do repositório.
2. No Vercel, importe o repositório.
3. Framework: `Other`.
4. Não precisa build command.
5. Abra o link do Vercel.

## Envio real com Evolution API

No Vercel, vá em **Environment Variables** e cadastre:

- `EVOLUTION_API_URL`
- `EVOLUTION_API_KEY`
- `EVOLUTION_INSTANCE`

Sem essas variáveis, o painel abre em modo teste.

## Uso responsável

Cadastre somente clientes que autorizaram receber mensagens.
