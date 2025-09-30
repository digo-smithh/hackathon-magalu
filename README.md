# hackathon-magalu

*DISCLAIMER: to run the terraform vm on MagaluCloud an API needs to be put in a terraform.tfvars file variable*


QuestTasks API

QuestTasks is a backend API for a task management application that uses AI to break down large goals into smaller, manageable tasks.

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
Bash

cd hackathon-magalu/back
# Running Locally

Create and activate a virtual environment:
Bash

python3 -m venv venv
source venv/bin/activate

Install the dependencies:
Bash

    pip install -r requirements.txt

    Create a .env file and add your environment variables:

    GOOGLE_API_KEY="your_google_api_key"
    SECRET_KEY="your_secret_key"
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES=30

🏃‍♀️ Running the Application

To run the application, use the following command:
Bash

uvicorn main:app --reload

The API will be available at http://localhost:8000.
