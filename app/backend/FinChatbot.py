import google.generativeai as genai

# Function to interact with the chatbot
def ask_question(question):
    # This function should be called from FastAPI
    instruction = "You are a financial agent. Only answer questions related to finance. If the question is not about finance, politely refuse to answer."
    
    # Initialize the model for each request to ensure fresh context
    model = genai.GenerativeModel("gemini-2.0-flash")
    chat = model.start_chat(history=[])
    
    response = chat.send_message(f"{instruction}\n\nUser: {question}")
    return response.text