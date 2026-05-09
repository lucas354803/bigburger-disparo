create table clientes (
  id uuid primary key,
  nome text,
  telefone text,
  cidade text,
  bairro text,
  bloqueado boolean default false,
  created_at timestamp default now()
);

create table campanhas (
  id uuid primary key,
  nome text,
  mensagem text,
  status text,
  created_at timestamp default now()
);
