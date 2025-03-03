import streamlit as st
import pandas as pd
import os
import plotly.express as px

# File to store the budget logs
CSV_FILE = "new.csv"
BUDGET_FILE = "ai_budget_log.csv"

# Function to load expense data
def load_data():
    if os.path.exists(CSV_FILE):
        return pd.read_csv(CSV_FILE)
    else:
        return pd.DataFrame(columns=["Date", "Category", "Amount", "Note", "% of Salary Spent"])

# Function to save expense data
def save_data(df):
    df.to_csv(CSV_FILE, index=False)

# Function to load budget limits
def load_budget_limits():
    if os.path.exists(BUDGET_FILE):
        return pd.read_csv(BUDGET_FILE)
    else:
        return pd.DataFrame(columns=["Category", "Percentage_AI", "Salary"])

# Streamlit UI
st.title("💰 Monthly Budget Tracker with Alerts & Visualization")

# Ask for salary (store in session state)
if "salary" not in st.session_state:
    st.session_state.salary = None

salary = st.number_input("Enter your monthly salary:", min_value=0.0, format="%.2f")

if st.button("Save Salary"):
    st.session_state.salary = salary
    st.success(f"Salary saved: ₹{salary:.2f}")

# Load budget limits
df_budget = load_budget_limits()

if st.session_state.salary:
    st.subheader(f"💼 Monthly Salary: ₹{st.session_state.salary:.2f}")
    
    # User Input Fields
    date = st.date_input("Select Date")
    category = st.selectbox("Category", df_budget["Category"].unique() if not df_budget.empty else 
                            ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other", "Savings", "Rent"])
    amount = st.number_input("Amount Spent", min_value=0.0, format="%.2f")
    note = st.text_area("Notes (Optional)")
    
    if st.button("Add Expense"):
        if amount > 0:
            # Load existing data
            df = load_data()
            
            # Calculate % of salary spent
            percent_spent = (amount / st.session_state.salary) * 100
            
            # Add new entry
            new_entry = pd.DataFrame({
                "Date": [date], 
                "Category": [category], 
                "Amount": [amount], 
                "Note": [note], 
                "% of Salary Spent": [round(percent_spent, 2)]
            })
            
            df = pd.concat([df, new_entry], ignore_index=True)
            save_data(df)
            st.success("✅ Expense Added Successfully!")
            
            # Check if spending exceeds budget limit
            if not df_budget.empty and category in df_budget["Category"].values:
                category_limit = df_budget[df_budget["Category"] == category]["Percentage_AI"].values[0]
                total_spent_category = df[df["Category"] == category]["Amount"].sum()
                allowed_budget = (category_limit / 100) * st.session_state.salary
                
                # Calculate spending percentage
                category_spent_percentage = (total_spent_category / allowed_budget) * 100
                
                # Display progress bar for category spending
                st.progress(min(category_spent_percentage / 100, 1.0))  
                
                # Alert if 50% of budget is used
                if total_spent_category >= 0.5 * allowed_budget:
                    st.warning(f"⚠️ You have used **50%** of your budget for {category}. "
                               f"Limit: ₹{allowed_budget:.2f}, Spent: ₹{total_spent_category:.2f}")

                # Alert if budget is exceeded
                if total_spent_category > allowed_budget:
                    st.error(f"🚨 You have **exceeded** your budget for {category}! "
                             f"Limit: ₹{allowed_budget:.2f}, Spent: ₹{total_spent_category:.2f}")
        else:
            st.error("❌ Please enter a valid amount.")
    
    # Load and display expense data
    st.subheader("📊 Expense Summary")
    df = load_data()
    if not df.empty:
        st.dataframe(df)

else:
    st.warning("⚠️ Please enter and save your salary first.")

    # Load data to display
    
    
else:
    st.warning("Please enter and save your salary first.")