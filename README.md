# BigBurger Disparo - configurado

Painel web para gerenciar contatos autorizados e enviar mensagens pelo WhatsApp via Evolution API.

## Configuração aplicada neste ZIP

- EVOLUTION_API_URL: `https://corocre-trailside-outbound.ngrok-free.dev`
- EVOLUTION_API_KEY: configurada conforme print
- EVOLUTION_INSTANCE: `bidisparo`

## Importante

O CMD do ngrok precisa ficar aberto. Se fechar o ngrok, o envio para.

Se você abrir o ngrok de novo e ele gerar outro link, atualize a variável `EVOLUTION_API_URL` no Vercel ou no arquivo `api/send.js`.

## Como subir no Vercel

1. Apague os arquivos antigos do projeto no GitHub/Vercel.
2. Envie os arquivos deste ZIP.
3. Faça redeploy no Vercel.
4. Abra o painel e teste com seu próprio número primeiro.

## Uso responsável

Cadastre somente clientes que autorizaram receber mensagens.
