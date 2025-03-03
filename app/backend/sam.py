import pandas as pd
import os
import google.generativeai as genai

# Configure the API key
genai.configure(api_key="apikey")

# Initialize the chat
model = genai.GenerativeModel("gemini-2.0-flash")
chat = model.start_chat()

# File paths
CSV_FILE = "budget_log.csv"
AI_BUDGET_FILE = "ai_budget_log.csv"

# Function to interact with AI for budget insights
def generate_budget_analysis(df, salary):
    instruction = """You are a financial advisor. Given the user's spending data, generate:

1. A **realistic budget breakdown** while following the **Needs-Wants-Savings** framework:
  
   Strictly format the budget breakdown like this:

   Food: XX%  
   Transport: XX%  
   Rent: XX%  
   Shopping: XX%    
   Savings: XX% 
   Others: XX% 

2. **Actionable Steps to Stick to This Budget (1-liner points):**  
   - **For every category that is being reduced or increased, provide specific, actionable steps for the user to achieve the change.**  
   - **Do NOT simply state the adjustment; explain how the user can implement it.**  
   - **Ensure total reduction aligns with best financial practices.** 

3. **Ensure the total percentage adds up to 100%** while subtly adjusting allocations to fit financial best practices. **Include the 'Others' category in the breakdown.**

4. **Do not add extra information or analysis beyond what is requested.**
"""
    df["Date"] = pd.to_datetime(df["Date"])  # Convert Date column to datetime
    category_totals = df.groupby("Category")["% of Salary Spent"].sum().to_dict()

    response = chat.send_message(f"{instruction}\n\nUser Salary: ₹{salary}\nExpenses: {category_totals}")
    return response.text, category_totals

# Load data function
def load_data():
    if os.path.exists(CSV_FILE):
        return pd.read_csv(CSV_FILE)
    else:
        return pd.DataFrame(columns=["Date", "Category", "Amount", "Note", "% of Salary Spent"])

# Save AI budget data
def save_ai_budget(df):
    df.to_csv(AI_BUDGET_FILE, index=False)
