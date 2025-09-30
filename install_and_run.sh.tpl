#!/bin/bash
# Script para configurar e rodar o backend do QuestTasks na VM

# Aguarda a inicialização completa do sistema e da rede
sleep 20

# Atualiza os pacotes e instala as dependências do sistema
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y git python3-pip python3-venv

# Clona o repositório do projeto
# ATENÇÃO: Confirme se esta é a URL correta do seu repositório Git
git clone https://github.com/digo-smithh/hackathon-magalu.git /home/ubuntu/hackathon-magalu

# Navega para a pasta do backend
cd /home/ubuntu/hackathon-magalu/back

# --- CRIA O ARQUIVO .ENV COM AS VARIÁVEIS INJETADAS PELO TERRAFORM ---
cat > .env <<EOL
GOOGLE_API_KEY="${google_api_key}"
SECRET_KEY="${jwt_secret_key}"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOL

# Muda o dono de todos os arquivos do projeto para o usuário 'ubuntu'
chown -R ubuntu:ubuntu /home/ubuntu/hackathon-magalu

# Executa os próximos comandos como o usuário 'ubuntu' para evitar problemas de permissão
sudo -u ubuntu bash <<'EOF'
# Navega para a pasta correta dentro do sub-shell
cd /home/ubuntu/hackathon-magalu/back

# Cria e ativa o ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instala as dependências do Python a partir do requirements.txt
pip install -r requirements.txt

# Inicia o servidor FastAPI em segundo plano usando 'nohup'
# Isso garante que o servidor continue rodando mesmo após o script terminar
nohup uvicorn main:app --host 0.0.0.0 --port 8000 &
EOF