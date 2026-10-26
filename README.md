# 🛡️ DiVinti Nexus Gateway — GraphQL Event Management API

<p align="center">
  <img src="https://shields.io" alt="GitHub Stars">
  <img src="https://shields.io" alt="GitHub Forks">
  <img src="https://shields.io" alt="License">
  <img src="https://shields.io" alt="OWASP Protected">
</p>

O **DiVinti Nexus Gateway** é uma API corporativa desenvolvida em GraphQL que gerencia o ecossistema completo de eventos corporativos da **DiVinti Enterprise**. O projeto expande uma atividade prática estruturada pela SEDUC-SP, transformando-a em uma infraestrutura resiliente, fortemente tipada e protegida contra vulnerabilidades clássicas de segurança de dados em grafos.

Este repositório foi construído com foco em **Cibersegurança e Desenvolvimento Seguro (Secure Coding)**, aplicando conceitos práticos para mitigar ataques comuns de negação de serviço (DoS) e garantindo a integridade relacional entre os dados.

---

## 🚀 Engenharia e Diferenciais do Projeto

Diferente de APIs tradicionais que apenas cobrem operações básicas de leitura de dados, esta arquitetura foi desenhada para simular um ambiente de produção real:

*   **Grafos Circulares de Alta Complexidade:** Relacionamentos bidirecionais completos entre Eventos, Palestrantes (Speakers), Locais (Locations), Patrocinadores (Sponsors) corporativos e Ingressos (Tickets).
*   **🛡️ Mitigação Anti-DoS (Query Depth Limiting):** Integração de algoritmos de validação estrutural que barram requisições abusivas ou aninhadas recursivamente antes que elas cheguem à camada de processamento da CPU.
*   **Defesa de Integridade Relacional:** Validação defensiva em tempo de execução nas *Mutations* de escrita para impedir corrupção ou inserção de chaves estrangeiras inválidas.
*   **Filtros de Busca Dinâmicos:** Filtros baseados em strings integrados nativamente nas consultas de grafos no servidor.

---

## 📐 Arquitetura do Grafo de Dados

A API unifica múltiplos microsserviços de dados em um único endpoint HTTP inteligente, resolvendo problemas clássicos do REST como *Overfetching* e *Underfetching*:

```text
       ┌───────────┐               ┌──────────────┐
       │  Sponsor  │◄─────────────►│    Event     │
       └───────────┘               └──────┬───────┘
                                          │
                  ┌───────────────────────┼───────────────────────┐
                  ▼                       ▼                       ▼
          ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
          │    Speaker    │       │   Location    │       │    Ticket     │
          └───────────────┘       └───────────────┘       └───────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

*   **Node.js** — Ambiente de execução assíncrono para o ecossistema Javascript.
*   **Express** — Framework minimalista para o servidor HTTP subjacente.
*   **GraphQL** — Linguagem de modelagem de grafos e runtime de consultas.
*   **express-graphql** — Middleware de acoplamento do ecossistema GraphQL ao Express.
*   **graphql-depth-limit** — Componente de segurança para análise de profundidade estática de queries.

---

## ⚙️ Instalação e Execução Local

### 1. Clonar o Repositório
```bash
git clone https://github.com
cd divinti-nexus-gateway
```

### 2. Instalar as Dependências do Projeto
```bash
npm install
```

### 3. Iniciar o Servidor do Gateway
```bash
npm start
```
O servidor inicializará exibindo logs de auditoria no terminal e estará acessível em: `http://localhost:4000/graphql`

---

## 🔍 Laboratório de Testes (Playbook GraphiQL)

Abra o painel interativo do GraphiQL em seu navegador e use os cenários abaixo para validar a robustez e a segurança da API:

### 1. A "Super Query" Corporativa (Leitura Completa)
Busca dados agregados de 5 domínios diferentes do grafo em apenas um único disparo de rede, trazendo parceiros reais do ecossistema tecnológicos da DiVinti (como *AWS, Google Cloud e CrowdStrike*):

```graphql
{
  events {
    name
    date
    location {
      name
      city
      capacity
    }
    speakers {
      name
      company
      expertise
    }
    sponsors {
      name
      tier
    }
    tickets {
      type
      price
    }
  }
}
```

### 2. Teste de Auditoria de Segurança (Bloqueio Anti-DoS)
A infraestrutura está configurada para aceitar **no máximo 4 níveis de profundidade** de aninhamento. Tente rodar esta query maliciosa de 5 níveis. O gateway bloqueará a execução instantaneamente para preservar a memória do servidor:

```graphql
# [REJEITADO PELO SISTEMA DE DEFESA DIVINTI]
{
  events {
    speakers {
      events {
        speakers {
          events {
            name
          }
        }
      }
    }
  }
}
```

### 3. Mutation com Validação Defensiva
Adicione novos registros ao grafo de maneira segura. Se o campo `locationId` enviado não constar na massa de dados estável do sistema, a API abortará a gravação emitindo um log detalhado de segurança (`[DiVinti Security Exception]`):

```graphql
mutation {
  createEvent(
    name: "Técnicas Avançadas de Exploração e Mitigação de Vulnerabilidades"
    date: "2026-12-10"
    locationId: "loc-1"
    speakerIds: ["sp-4", "sp-1"]
    sponsorIds: ["spon-1"]
  ) {
    id
    name
    date
  }
}
```

---

## 🔒 security.log — Diretrizes de Desenvolvimento Seguro

Este projeto segue as boas práticas de modelagem de APIs defendidas pela OWASP (*Open Web Application Security Project*):
1.  **Limitação de Recursos Dinâmicos:** Proteção explícita contra ataques de esgotamento de recursos causados por consultas circulares redundantes.
2.  **Tratamento Centralizado de Exceções:** Customização da função de tratamento de falhas (`customFormatErrorFn`) para evitar o vazamento de *stack traces* e caminhos internos do servidor para o usuário final.
3.  **Tipagem Estrita com Não-Nulidade:** Uso de restrições `GraphQLNonNull` em identificadores exclusivos (`GraphQLID`), forçando a validação e rejeitando requisições com payloads ausentes ou corrompidos já no nível de transporte de dados.

---

## 👤 Autor

*   **John Dimitry** — Técnico em Desenvolvimento de Sistemas com foco em Engenharia de Software e Segurança Cibernética.
*   **GitHub:** [@johndimitry](https://github.com)
*   **LinkedIn:** [John Dimitry](https://linkedin.com)

---
<p align="center">
  <i>Developed secure, coded with precision — DiVinti Enterprise 2026.</i>
</p>
