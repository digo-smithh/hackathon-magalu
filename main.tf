# main.tf

terraform {
  required_providers {
    mgc = {
      source = "magalucloud/mgc"
    }
  }
}

# Variável para a chave da API da MagaluCloud (sensível)
variable "api_key" {
  type      = string
  sensitive = true
}

# Variável para a chave da API do Google (sensível)
variable "google_api_key" {
  type      = string
  sensitive = true
}

# Variável para a chave secreta do JWT (sensível)
variable "jwt_secret_key" {
  type      = string
  sensitive = true
}

provider "mgc" {
  region  = "br-se1"
  api_key = var.api_key
}

# Processa o arquivo de template, injetando as variáveis secretas
data "template_file" "startup_script" {
  template = file("${path.module}/install_and_run.sh.tpl")
  vars = {
    google_api_key = var.google_api_key
    jwt_secret_key = var.jwt_secret_key
  }
}

# Recurso para criar a instância da Máquina Virtual
resource "mgc_virtual_machine_instances" "bobesponja_vm" {
  name           = "bobesponja"
  machine_type   = "BV1-2-10"
  image          = "cloud-ubuntu-24.04 LTS"
  ssh_key_name   = "hackathon"
  
  # Adiciona o conteúdo do script processado para ser executado na inicialização
  user_data      = data.template_file.startup_script.rendered
}

# Recurso para configurar a regra de firewall
resource "mgc_firewall_rules" "allow_backend_access" {
  firewall_name = "default" # Use o nome do seu firewall, 'default' é o padrão
  
  rule {
    action    = "accept"
    direction = "inbound"
    protocol  = "tcp"
    port      = "8000"
    source    = "0.0.0.0/0" # Permite acesso de qualquer lugar da internet
  }
}