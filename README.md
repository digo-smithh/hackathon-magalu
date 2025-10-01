
# 🍍 Bob Esponja em: derrotando matérias

Bem-vindo ao Bob Esponja em: derrotando matérias, uma aplicação de lista de tarefas gamificada que transforma seus objetivos em missões épicas na Fenda do Biquíni\! Crie tarefas manualmente ou use o poder da Inteligência Artificial para gerar um plano de ação

Este repositório contém tanto o **Backend** (API em FastAPI) quanto o **Frontend** (aplicação em React).
# Durante o hackathon você poderá testar a aplicação [aqui](http://201.23.71.157:3000)
(logue com user string e senha string)
## ✨ Funcionalidades

  * **Autenticação de Usuário**: Sistema seguro de login.
  * **Criação de Missões**:
      * **Manual**: Crie missões passo a passo, definindo cada etapa, prazo e pontuação.
      * **Com Inteligência Artificial**: Descreva um objetivo (ex: "aprender a tocar violão") e deixe o Google Generative AI criar um plano de tarefas detalhado para você.
  * **Tela de Jogo Interativa**: Acompanhe o progresso da missão em duas visualizações:
      * **Lista de Tarefas**: Uma visão clássica para gerenciar as etapas.
      * **Mapa de Jogo**: Uma visualização gamificada que mostra o progresso dos jogadores em um mapa temático.
  * **Gamificação**: Ganhe pontos ao concluir tarefas, enfrente chefões (seus professores) e conclua seu objetivo final!

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


## 🎮 Como Usar

### 1️⃣ Primeiro Acesso

1. **Abra o site**
2. **Clique em "Criar Conta"**
3. **Preencha seus dados:**
   - Nome
   - Email
   - Senha
4. **Faça login** com suas credenciais

### 2️⃣ Criar uma Missão

#### Opção A: Criar Manualmente
1. Na tela inicial, clique em **"Criar Nova Missão"**
2. **Preencha:**
   - Nome da missão
   - Descrição
   - Escolha um boss
3. **Adicione tarefas:**
   - Clique em **"Adicionar Task"**
   - Preencha título, descrição, pontos, prazo
4. Clique em **"Criar Missão"**

#### Opção B: Criar com IA 🤖
1. Na tela inicial, clique em **"Criar com IA"**
2. **Escreva uma descrição livre** da sua missão
3. Clique em **"Gerar Missão com IA"**
4. **Aguarde o processamento** (2-5 segundos)
5. **Revise as tasks geradas:**
   - Edite qualquer informação
   - Adicione ou remova tasks
6. Clique em **"Salvar Missão"**

### 3️⃣ Jogar uma Missão

1. Na tela inicial, **clique em uma missão criada**
2. **Visualize suas tarefas**
3. **Marque tarefas como completas** clicando no checkbox
4. **Acompanhe seu progresso** no topo da tela

### Planos para o futuro

Uma possível melhoria para nosso jogo seria poder adicionar outros jogadores para completar as missões, assim o jogador poderia competir com seus amigos! Quem será que estudaria mais rápido para a prova??

## 📝 Licença

Este projeto é de código aberto para fins educacionais.

⚠️ **Nota:** Bob Esponja e personagens relacionados são propriedade da Nickelodeon/Viacom. Este projeto é uma homenagem feita por fãs sem fins lucrativos.

## 💬 Contato

Dúvidas ou sugestões? Entre em contato!
