import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load the .env file to get the API key
load_dotenv()

try:
    # Configure the client with your key
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

    print("Fetching available models...\n")

    # List all available models
    for model in genai.list_models():
      # Check if the model supports the 'generateContent' method
      if 'generateContent' in model.supported_generation_methods:
        print(f"- {model.name}")

except Exception as e:
    print(f"An error occurred: {e}")