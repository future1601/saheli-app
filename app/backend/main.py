from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import pandas as pd
import os
from datetime import datetime
import google.generativeai as genai
import uvicorn
from FinChatbot import ask_question
from sam import generate_budget_analysis
import json

# Configure your Google Generative AI API key
genai.configure(api_key="REMOVED_SECRET")

# Initialize the chat model
model = genai.GenerativeModel("gemini-2.0-flash")
chat = model.start_chat(history=[])

app = FastAPI(host="192.168.160.147", port=8081)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you'd want to restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File paths
NEW_CSV_FILE = "new.csv"
BUDGET_LOG_CSV_FILE = "budget_log.csv"
AI_BUDGET_FILE = "ai_budget_log.csv"
ALERTS_FILE = "budget_alerts.json"

# Ensure CSV files exist
def ensure_csv_exists(file_path, columns):
    if not os.path.exists(file_path):
        pd.DataFrame(columns=columns).to_csv(file_path, index=False)

# Initialize CSV files
ensure_csv_exists(NEW_CSV_FILE, ["Date", "Category", "Amount", "Note", "% of Salary Spent"])
ensure_csv_exists(BUDGET_LOG_CSV_FILE, ["Category", "Percentage_AI"])

# Ensure alerts file exists
def ensure_alerts_file_exists():
    if not os.path.exists(ALERTS_FILE):
        with open(ALERTS_FILE, 'w') as f:
            json.dump({"alerts": []}, f)

# Call this function in your app initialization
ensure_alerts_file_exists()

# Pydantic models for request bodies
class ChatRequest(BaseModel):
    question: str
    user_id: Optional[str] = "anonymous"

class ExpenseRequest(BaseModel):
    date: str
    category: str
    amount: float
    note: Optional[str] = ""
    income: float

class BudgetRequest(BaseModel):
    income: float

class BudgetAlert(BaseModel):
    category: str
    date: str
    message: str
    limit: float
    spent: float
    severity: str

@app.post("/ask")
def ask_chatbot(chat_req: ChatRequest):
    question = chat_req.question
    if not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    # Call the imported function from FinChatbot.py
    answer_text = ask_question(question)
    return {"response": answer_text}

@app.post("/api/addExpense")
async def add_expense(data: dict):
    try:
        # Extract data from request
        date = data.get("date", "")
        category = data.get("category", "")
        amount = data.get("amount", 0)
        note = data.get("note", "")
        income = data.get("income", 0)
        
        # Validate inputs
        if not date or not category or amount <= 0:
            raise HTTPException(status_code=400, detail="Invalid input data")
        
        # Calculate percentage of salary spent
        percentage = (amount / income) * 100 if income > 0 else 0
        
        # Create a new row for the CSV
        new_row = {
            "Date": date,
            "Category": category,
            "Amount": amount,
            "Note": note,
            "% of Salary Spent": percentage
        }
        
        # Check if budget_log.csv exists
        budget_log_file = "budget_log.csv"
        if os.path.exists(budget_log_file):
            # Append to existing file
            df = pd.read_csv(budget_log_file)
            df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        else:
            # Create new file
            df = pd.DataFrame([new_row])
        
        # Save to CSV
        df.to_csv(budget_log_file, index=False)
        
        # Check if we need to send a budget alert
        budget_alert = None
        
        # Check if ai_budget_log.csv exists (contains budget limits)
        ai_budget_file = "ai_budget_log.csv"
        if os.path.exists(ai_budget_file):
            try:
                budget_df = pd.read_csv(ai_budget_file)
                
                # Get budget percentage for this category
                category_budget = budget_df[budget_df["Category"] == category]
                
                if not category_budget.empty:
                    budget_percentage = category_budget.iloc[0]["Percentage"]
                    budget_limit = (budget_percentage / 100) * income
                    
                    # Calculate total spent in this category
                    category_spent = df[df["Category"] == category]["Amount"].sum()
                    
                    # If spent more than budget, create alert
                    if category_spent > budget_limit:
                        budget_alert = {
                            "category": category,
                            "limit": budget_limit,
                            "spent": category_spent,
                            "percentage": budget_percentage
                        }
            except Exception as e:
                print(f"Error checking budget: {str(e)}")
                # Continue without budget alert if there's an error
        
        return {
            "success": True,
            "message": "Expense added successfully",
            "budget_alert": budget_alert
        }
        
    except Exception as e:
        print(f"Error adding expense: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add expense: {str(e)}")

@app.post("/api/generateBudget")
async def generate_budget(data: dict):
    try:
        income = data.get("income", 0)
        
        # Check if income is valid
        if income <= 0:
            raise HTTPException(status_code=400, detail="Invalid income amount")
        
        # Define the allowed categories
        allowed_categories = ["Food", "Transport", "Shopping", "Other", "Savings", "Rent"]
        
        # Read expense data from CSV
        expense_file = "budget_log.csv"
        if not os.path.exists(expense_file):
            # If no expense data exists, create a default budget based on 50-30-20 rule
            budget = {
                "Food": 15,
                "Transport": 10,
                "Rent": 25,
                "Shopping": 15,
                "Other": 15,
                "Savings": 20
            }
            
            # Create a default actual spending pattern (empty)
            actual = {category: 0 for category in budget.keys()}
            
            analysis = """
# Budget Analysis

Based on the 50-30-20 rule, here's a recommended budget breakdown for your monthly income of ₹{income}:

## Needs (50%): ₹{needs_amount}
- Food: 15% (₹{food_amount})
- Transport: 10% (₹{transport_amount})
- Rent: 25% (₹{rent_amount})

## Wants (30%): ₹{wants_amount}
- Shopping: 15% (₹{shopping_amount})
- Other: 15% (₹{other_amount})

## Savings (20%): ₹{savings_amount}
- Savings: 20% (₹{savings_amount})

## Actionable Steps:
- Track your expenses regularly to stay within budget
- Prioritize needs over wants
- Aim to save at least 20% of your income each month
- Review your budget monthly and adjust as needed
- Consider automating your savings to ensure consistency
            """.format(
                income=income,
                needs_amount=income * 0.5,
                food_amount=income * 0.15,
                transport_amount=income * 0.1,
                rent_amount=income * 0.25,
                wants_amount=income * 0.3,
                shopping_amount=income * 0.15,
                other_amount=income * 0.15,
                savings_amount=income * 0.2
            )
            
            return {
                "budget": budget,
                "actual": actual,
                "analysis": analysis
            }
        
        # If expense data exists, read and analyze it
        df = pd.read_csv(expense_file)
        
        # Filter to only include allowed categories
        df = df[df['Category'].isin(allowed_categories)]
        
        # Calculate total spending by category
        category_spending = df.groupby('Category')['Amount'].sum().reset_index()
        
        # Calculate percentage of total spending for each category
        total_spending = category_spending['Amount'].sum()
        category_spending['Percentage'] = (category_spending['Amount'] / income * 100).round(1)
        
        # Create actual spending dictionary
        actual = dict(zip(category_spending['Category'], category_spending['Percentage']))
        
        # Categorize expenses into needs, wants, and savings
        needs_categories = ['Food', 'Transport', 'Rent']
        wants_categories = ['Shopping', 'Other']
        savings_categories = ['Savings']
        
        # Calculate current spending in each major category
        current_needs = sum(category_spending[category_spending['Category'].isin(needs_categories)]['Percentage'])
        current_wants = sum(category_spending[category_spending['Category'].isin(wants_categories)]['Percentage'])
        current_savings = sum(category_spending[category_spending['Category'].isin(savings_categories)]['Percentage'])
        
        # Target percentages based on 50-30-20 rule
        target_needs = 50
        target_wants = 30
        target_savings = 20
        
        # Adjust budget based on current spending patterns
        budget = {}
        
        # Distribute budget for needs
        needs_df = category_spending[category_spending['Category'].isin(needs_categories)]
        if not needs_df.empty:
            needs_total = needs_df['Percentage'].sum()
            for _, row in needs_df.iterrows():
                if needs_total > 0:
                    budget[row['Category']] = (row['Percentage'] / needs_total * target_needs).round(1)
                else:
                    budget[row['Category']] = 0
        
        # Distribute budget for wants
        wants_df = category_spending[category_spending['Category'].isin(wants_categories)]
        if not wants_df.empty:
            wants_total = wants_df['Percentage'].sum()
            for _, row in wants_df.iterrows():
                if wants_total > 0:
                    budget[row['Category']] = (row['Percentage'] / wants_total * target_wants).round(1)
                else:
                    budget[row['Category']] = 0
        
        # Distribute budget for savings
        savings_df = category_spending[category_spending['Category'].isin(savings_categories)]
        if not savings_df.empty:
            for _, row in savings_df.iterrows():
                budget[row['Category']] = target_savings
        
        # Add missing categories with default values
        for category in allowed_categories:
            if category not in budget:
                if category in needs_categories:
                    budget[category] = target_needs / len(needs_categories)
                elif category in wants_categories:
                    budget[category] = target_wants / len(wants_categories)
                elif category in savings_categories:
                    budget[category] = target_savings
        
        # Generate analysis text
        analysis = f"""
# Budget Analysis

Based on your spending patterns and the 50-30-20 rule, here's a recommended budget breakdown for your monthly income of ₹{income}:

## Needs (50%): ₹{income * 0.5}
"""
        
        for category in needs_categories:
            if category in budget and budget[category] > 0:
                analysis += f"- {category}: {budget[category]}% (₹{(income * budget[category] / 100):.2f})\n"
        
        analysis += f"""
## Wants (30%): ₹{income * 0.3}
"""
        
        for category in wants_categories:
            if category in budget and budget[category] > 0:
                analysis += f"- {category}: {budget[category]}% (₹{(income * budget[category] / 100):.2f})\n"
        
        analysis += f"""
## Savings (20%): ₹{income * 0.2}
"""
        
        for category in savings_categories:
            if category in budget and budget[category] > 0:
                analysis += f"- {category}: {budget[category]}% (₹{(income * budget[category] / 100):.2f})\n"
        
        # Add comparison with current spending
        analysis += f"""
## Current vs. Recommended:
- Needs: {current_needs:.1f}% vs. {target_needs}%
- Wants: {current_wants:.1f}% vs. {target_wants}%
- Savings: {current_savings:.1f}% vs. {target_savings}%

## Actionable Steps:
"""
        
        # Generate actionable steps based on the comparison
        if current_needs > target_needs:
            analysis += f"- Reduce spending on needs by {(current_needs - target_needs):.1f}%\n"
        
        if current_wants > target_wants:
            analysis += f"- Cut back on wants by {(current_wants - target_wants):.1f}%\n"
        
        if current_savings < target_savings:
            analysis += f"- Increase savings by {(target_savings - current_savings):.1f}%\n"
        
        # Add general advice
        analysis += """- Track your expenses regularly to stay within budget
- Prioritize needs over wants
- Aim to save at least 20% of your income each month
- Review your budget monthly and adjust as needed
- Consider automating your savings to ensure consistency
"""
        
        return {
            "budget": budget,
            "actual": actual,
            "analysis": analysis
        }
        
    except Exception as e:
        print(f"Error generating budget: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate budget: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/getBudgetAlerts")
async def get_budget_alerts():
    try:
        if os.path.exists(ALERTS_FILE):
            with open(ALERTS_FILE, 'r') as f:
                data = json.load(f)
                return data
        else:
            return {"alerts": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get alerts: {str(e)}")

@app.post("/api/clearBudgetAlerts")
async def clear_budget_alerts():
    try:
        # Create an empty alerts structure
        empty_alerts = {"alerts": []}
        
        # Write the empty alerts to the file
        with open(ALERTS_FILE, 'w') as f:
            json.dump(empty_alerts, f)
            
        return {"success": True, "message": "All budget alerts have been cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear alerts: {str(e)}")

# Add this helper function to save alerts
def save_alert(alert):
    try:
        if os.path.exists(ALERTS_FILE):
            with open(ALERTS_FILE, 'r') as f:
                data = json.load(f)
        else:
            data = {"alerts": []}
        
        # Add the new alert
        data["alerts"].append(alert)
        
        # Keep only the most recent 20 alerts
        if len(data["alerts"]) > 20:
            data["alerts"] = data["alerts"][-20:]
        
        # Save the updated alerts
        with open(ALERTS_FILE, 'w') as f:
            json.dump(data, f)
    except Exception as e:
        print(f"Error saving alert: {str(e)}")

@app.get("/api/getBudgetData")
async def get_budget_data(period: str = "daily"):
    try:
        # Define the budget log file path correctly
        BUDGET_LOG_FILE = "budget_log.csv"
        
        # Check if file exists
        if not os.path.exists(BUDGET_LOG_FILE):
            return {
                "labels": ["Food", "Transport", "Rent", "Shopping", "Others"],
                "expenses": [0.8, 0.6, 20.0, 0.7, 0.5]
            }
        
        # Read the budget log CSV file
        df = pd.read_csv(BUDGET_LOG_FILE)
        
        # Check if dataframe is empty
        if df.empty:
            return {
                "labels": ["Food", "Transport", "Rent", "Shopping", "Others"],
                "expenses": [0.8, 0.6, 20.0, 0.7, 0.5]
            }
        
        # Group by category and sum the percentage of salary spent
        category_data = df.groupby('Category')['% of Salary Spent'].sum().reset_index()
        
        # Sort by percentage spent in descending order and take top 5 categories
        category_data = category_data.sort_values('% of Salary Spent', ascending=False).head(5)
        
        # Get labels (categories) and values (percentage spent)
        labels = category_data['Category'].tolist()
        percentages = category_data['% of Salary Spent'].tolist()
        
        return {
            "labels": labels,
            "expenses": percentages
        }
        
    except Exception as e:
        print(f"Error in getBudgetData: {str(e)}")
        # Return sample data as fallback
        return {
            "labels": ["Food", "Transport", "Rent", "Shopping", "Others"],
            "expenses": [0.8, 0.6, 20.0, 0.7, 0.5]
        }

@app.post("/api/saveBudget")
async def save_budget(data: dict):
    try:
        budget = data.get("budget", {})
        
        if not budget:
            raise HTTPException(status_code=400, detail="No budget data provided")
        
        # Create a DataFrame from the budget data
        budget_df = pd.DataFrame({
            "Category": list(budget.keys()),
            "Percentage": list(budget.values())
        })
        
        # Save to ai_budget_log.csv
        budget_df.to_csv("ai_budget_log.csv", index=False)
        
        return {"message": "Budget saved successfully"}
        
    except Exception as e:
        print(f"Error saving budget: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save budget: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
