import translateText from '/home/mors/saheli-app/app/translateText.js';

export async function translateQuizData(quizData, targetLanguage) {
  if (targetLanguage === 'en') return quizData;

  try {
    const translatedQuiz = await Promise.all(
      quizData.map(async (question) => ({
        ...question,
        question: await translateText(question.question, targetLanguage),
        options: await Promise.all(
          question.options.map(option => translateText(option, targetLanguage))
        )
      }))
    );
    return translatedQuiz;
  } catch (error) {
    console.error('Error translating quiz:', error);
    return quizData;
  }
} 