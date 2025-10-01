
# 🍍 QuestTasks: A Missão na Fenda do Biquíni

Bem-vindo ao QuestTasks, uma aplicação de lista de tarefas gamificada que transforma seus objetivos em missões épicas na Fenda do Biquíni\! Crie tarefas manualmente ou use o poder da Inteligência Artificial para gerar um plano de ação, compita com amigos em um mapa interativo e ganhe pontos para se tornar o maior aventureiro.

Este repositório contém tanto o **Backend** (API em FastAPI) quanto o **Frontend** (aplicação em React).

## ✨ Funcionalidades

  * **Autenticação de Usuário**: Sistema seguro de login e criação de contas via JWT.
  * **Gerenciamento de Missões e Usuários**: Crie usuários e organize tarefas em missões compartilhadas.
  * **Criação de Missões**:
      * **Manual**: Crie missões passo a passo, definindo cada etapa, prazo e pontuação.
      * **Com Inteligência Artificial**: Descreva um objetivo (ex: "aprender a tocar violão") e deixe o Google Generative AI criar um plano de tarefas detalhado para você.
  * **Tela de Jogo Interativa**: Acompanhe o progresso da missão em duas visualizações:
      * **Lista de Tarefas**: Uma visão clássica para gerenciar as etapas.
      * **Mapa de Jogo**: Uma visualização gamificada que mostra o progresso dos jogadores em um mapa temático.
  * **Gamificação**: Ganhe pontos ao concluir tarefas, enfrente "chefões" e veja a tarefa final valer o dobro de pontos\!

## 🛠️ Tecnologias Utilizadas

### Backend

  * **Framework**: FastAPI
  * **ORM**: SQLModel (combinação de SQLAlchemy e Pydantic)
  * **Inteligência Artificial**: Google Generative AI
  * **Autenticação**: JWT (python-jose) e Hashing de senhas (argon2-cffi)
  * **Servidor ASGI**: Uvicorn
  * **Infraestrutura como Código**: Terraform para deploy na MagaluCloud

### Frontend

  * **Framework**: React
  * **Build Tool**: Vite
  * **Linguagem**: TypeScript
  * **Estilização**: Tailwind CSS
  * **Componentes**: shadcn/ui
  * **Ícones**: Lucide React
  * **Requisições HTTP**: Axios

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação completa (Backend e Frontend) localmente.

### 1\. Backend (API)

Primeiro, configure e inicie o servidor da API.

  * **Pré-requisitos**: Python 3.10+

<!-- end list -->

1.  **Navegue até a pasta do backend:**

    ```bash
    cd hackathon-magalu/back
    ```

2.  **Crie e ative um ambiente virtual:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    # No Windows, use: venv\Scripts\activate
    ```

3.  **Instale as dependências:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure as variáveis de ambiente:**
    Crie um arquivo chamado `.env` na pasta `back/` e adicione suas chaves:

    ```env
    GOOGLE_API_KEY="sua_chave_de_api_do_google"
    SECRET_KEY="uma_chave_secreta_forte_para_jwt"
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

5.  **Inicie o servidor:**

    ```bash
    uvicorn main:app --reload
    ```

    A API estará rodando em `http://localhost:8000`.

### 2\. Frontend (Aplicação Web)

Com o backend rodando, configure e inicie a interface do usuário em um **novo terminal**.

  * **Pré-requisitos**: Node.js 18+

<!-- end list -->

1.  **Navegue até a pasta do frontend:**

    ```bash
    cd hackathon-magalu/sponge-bob
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    O projeto estará disponível em `http://localhost:3000`.

## ☁️ Deploy com Terraform na MagaluCloud

O projeto está configurado para ser implantado em uma máquina virtual na MagaluCloud usando Terraform.

  * **Pré-requisitos**: Terraform instalado.

<!-- end list -->

1.  **Navegue até a raiz do projeto:**

    ```bash
    cd hackathon-magalu
    ```

2.  **Crie o arquivo de variáveis secretas:**
    Crie um arquivo chamado `terraform.tfvars` e adicione suas chaves:

    ```hcl
    api_key        = "sua_chave_de_api_da_magalu_cloud"
    google_api_key = "sua_chave_de_api_do_google"
    jwt_secret_key = "uma_chave_secreta_forte_para_jwt"
    ```

3.  **Inicialize e aplique o Terraform:**

    ```bash
    terraform init
    terraform apply
    ```

    Confirme a aplicação digitando `yes`. Ao final, o Terraform fornecerá o endereço de IP da VM onde a API estará rodando.

4.  **Para remover a infraestrutura:**

    ```bash
    terraform destroy
    ```