import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ChapterDetail() {
  const { chapterId } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Look-up object for each chapter's content
  const chaptersContent: Record<string, { title: string; body: string }> = {
    "1": {
      title: "Chapter 1: Introduction to Compounding",
      body: `Definition of Compounding:
Compounding refers to the process where the interest earned on an initial investment (or principal) is added back to the principal amount. ...

Definition of Compounding:
Compounding refers to the process where the interest earned on an initial principal is added back to the principal. This new, larger total then earns additional interest in subsequent periods, causing your investment or savings to grow at an accelerating rate over time.

Why It Matters:
• Encourages early and consistent investing
• Transforms small contributions into significant amounts
• Ideal for long-term savings goals (e.g., retirement)

Example:
• Principal: ₹1,000
• Annual Interest Rate: 5%
• After 1 Year: ₹1,050
• After 2 Years: ₹1,102.50

`,
    },
    "2": {
      title: "Chapter 2: Managing Agricultural Income and Expenses",
      body: `Farmers face unique challenges in budgeting and expense management...
Overview:
Farmers and those in agricultural industries often face irregular income cycles, usually tied to harvest or market seasons. Expenses like seeds, fertilizers, and labor are ongoing, making consistent budgeting a challenge.

Key Points:
• Maintain separate accounts for farm-related income and expenses
• Track pre-harvest (planting, fertilizers) and post-harvest (transport, marketing) costs
• Plan for irregular cash flow periods by saving when revenue is high
• Build an emergency fund for unforeseen events (drought, pest infestation, etc.)

Tip:
Regularly reviewing and updating your farm budget ensures accurate expense tracking and better reinvestment planning.

`,
    },
    "3": {
      title: "Chapter 3: Creating a Simple and Practical Budget",
      body: `A practical budget helps track income & expenses effectively...
Budget Basics:
A budget is a plan that helps you monitor your income and control your expenses. It prevents overspending and ensures you consistently save.

Steps to Build a Budget:
1. List all income sources (salary, side business, etc.).
2. Identify fixed expenses (rent, utilities) and variable expenses (food, entertainment).
3. Allocate a portion of your income to savings or emergency funds every month.
4. Revisit your budget monthly and adjust for new expenses or changes in income.

Tools:
• Use spreadsheets or budgeting apps for detailed tracking
• Envelope method for cash expenses
• Aim to save 10–15% of your monthly income if possible

Remember:
Budgeting is an ongoing process. Adjust as your finances or goals change over time.

`,
    },
    "4": {
      title: "Chapter 4: Investing in Land",
      body: `Investing in land can be lucrative, but requires due diligence...
Why Land?
Land can potentially appreciate over time, and it provides opportunities for agriculture, leasing, or real estate development.

Considerations:
• Location directly impacts value and future resale prospects
• Zoning laws, regulations, and infrastructure can affect usability
• Ongoing costs: property taxes, maintenance, or improvements
• Liquidity is lower compared to stocks or bonds (it can take longer to sell land)

Pros:
• Tangible asset with potential for long-term gains
• Versatile uses (farming, real estate projects)

Cons:
• High initial investment
• Selling can be time-consuming

`,
    },
    "5": {
      title: "Chapter 5: Investing in Stocks",
      body: `Stocks can offer significant returns, but also come with risk...
Stock Basics:
When you purchase a stock, you're buying partial ownership in a company. Your returns come from dividends (profits shared) or capital gains (selling the stock at a higher price).

Key Terms:
• Shares: Units of ownership in a company
• Dividends: Periodic payouts if the company distributes profits
• Capital Gains: Profit from selling a stock at a higher price than you paid

Strategies:
• Diversify to reduce risk
• Combine short-term (trading) and long-term (investing) approaches
• Research company fundamentals and market conditions

Risks:
• Volatile market prices can lead to losses
• Requires regular monitoring or a trusted financial advisor

`,
    },
    "6": {
      title: "Chapter 6: Financial Security in Retirement Planning",
      body: `Retirement planning is crucial for long-term financial stability...
Why Retirement Planning?
Planning early for retirement ensures financial stability and comfort when you no longer have a regular income.

Key Steps:
1. Determine your target retirement age and savings goals
2. Estimate future living expenses (housing, healthcare, travel)
3. Contribute regularly to pension or retirement accounts (even small amounts grow over time)
4. Consider life and health insurance for added protection
5. Review and adjust your retirement plan every few years

Advice:
Starting early leverages compounding growth. Consistent contributions—no matter how small—will grow significantly if given enough time.

`,
    },
  };

  useEffect(() => {
    if (chapterId && chaptersContent[chapterId]) {
      setTitle(chaptersContent[chapterId].title);
      setContent(chaptersContent[chapterId].body);
    }
  }, [chapterId]);

  return (
    <View style={styles.container}>
      {/* Title Card */}
      <View style={styles.chapterCard}>
        <Text style={styles.chapterCardTitle}>{title}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.contentText}>{content}</Text>
      </ScrollView>

      {/* Take Quiz Button */}
      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => {
          // Make sure we pass the same chapterId to the Quiz
          // so it loads the correct set of questions
          if (chapterId) {
            // e.g., /quiz?chapterId=3
            // But in your code you said: "/(tabs)/learn/Quiz"
            // So let's do that:
            // e.g. router.push(`/(tabs)/learn/Quiz?chapterId=3`)
            router.push(`/(tabs)/learn/Quiz?chapterId=${chapterId}`);
          }
        }}
      >
        <Text style={styles.quizButtonText}>Take Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 16,
    paddingTop: 60,
  },
  chapterCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  chapterCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F1F",
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  contentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  quizButton: {
    backgroundColor: "#0F766E",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  quizButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
