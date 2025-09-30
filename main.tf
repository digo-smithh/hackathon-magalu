# main.tf

terraform {
  required_providers {
    mgc = {
      source = "magalucloud/mgc"
    }
  }
}

variable "api_key" {
  type      = string
  sensitive = true
}

provider "mgc" {
  region  = "br-se1"
  api_key = var.api_key
}

# The completed resource block with values from your 'terraform show' output
resource "mgc_virtual_machine_instances" "bobesponja_vm" {
  name           = "bobesponja"
  machine_type   = "BV1-2-10"
  image          = "cloud-ubuntu-24.04 LTS"
  ssh_key_name   = "hackathon"
}
