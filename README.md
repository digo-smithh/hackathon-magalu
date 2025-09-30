# QuestTasks

*DISCLAIMER: to run the terraform vm on MagaluCloud an API needs to be put in a terraform.tfvars file variable*


QuestTasks API

QuestTasks is a backend API for a task management application that uses AI to break down large study goals into smaller, manageable tasks.

🚀 Features

    AI-Powered Task Generation: Automatically generate a list of tasks from a single prompt.

    User and Mission Management: Create users, organize tasks into missions, and track participants.

    Authentication: Secure your application with JWT-based authentication.

🛠️ Technologies

    FastAPI

    SQLModel

    Google Generative AI

    Terraform

⚙️ Getting Started

Prerequisites

    Python 3.10+

    An active Google AI API key

Installation

    Clone the repository:
    Bash

git clone https://github.com/digo-smithh/hackathon-magalu.git

Navigate to the backend directory:
```bash
cd hackathon-magalu/back
```bash
# Running Locally

Create and activate a virtual environment:
Bash

python3 -m venv venv
source venv/bin/activate

Install the dependencies:
```bash

    pip install -r requirements.txt

    Create a .env file and add your environment variables:

    GOOGLE_API_KEY="your_google_api_key"
    SECRET_KEY="your_secret_key"
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES=30
```
🏃‍♀️ Running the Application

To run the application, use the following command:

```bash
uvicorn main:app --reload
```
The API will be available at http://localhost:8000.


☁️ Deployment with Terraform

You can also deploy the application to a virtual machine in the cloud using Terraform.

Prerequisites

    Terraform installed on your local machine.

    A Magalu Cloud API key.

Steps

    Navigate to the root of the project directory.

    Create a terraform.tfvars file. This file will hold your secret keys and is ignored by Git to prevent you from accidentally committing secrets.

    Add your secrets to the terraform.tfvars file:
    Terraform

api_key        = "your_magalu_cloud_api_key"
google_api_key = "your_google_api_key"
jwt_secret_key = "your_jwt_secret_key"

Initialize Terraform:

```
terraform init
```
Apply the Terraform plan to create the infrastructure:

```bash
    terraform apply

    Terraform will show you a plan and ask for confirmation before creating the resources. Type yes to proceed.
```
Once the process is complete, Terraform will output the IP address of the virtual machine. The API will be running and accessible at http://<your_vm_ip>:8000.

Tearing Down the Infrastructure

To destroy the resources created by Terraform and avoid incurring further costs, run:

```bash
terraform destroy
```