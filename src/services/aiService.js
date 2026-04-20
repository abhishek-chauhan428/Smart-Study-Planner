import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Generates a smart study strategy using the Gemini API.
 * 
 * @param {string} goal - The user's goal for the next week.
 * @param {Object} metrics - The user's study metrics.
 * @param {number} metrics.totalStudyMinutes - Total study minutes logged.
 * @param {number} metrics.avgFocus - Average focus rating.
 * @param {number} metrics.completionRate - Task completion rate.
 * @param {number} metrics.pendingTasks - Number of pending tasks.
 * @returns {Promise<string>} The markdown-formatted study plan.
 */
export async function generateStudyStrategy(goal, metrics) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error('Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' })

  const prompt = `
You are an expert AI Study Coach. The user wants a study plan for the upcoming week based on their recent metrics and a specific goal.

User's Weekly Goal: "${goal}"

User's Recent Metrics:
- Total Study Time: ${metrics.totalStudyMinutes} minutes
- Average Focus Rating: ${metrics.avgFocus}/5
- Task Completion Rate: ${metrics.completionRate}%
- Pending Tasks: ${metrics.pendingTasks}

Based on these metrics and the goal, provide a concise, actionable, and encouraging study plan for the upcoming week.
Format your response in Markdown. Include:
1. A brief analysis of their current metrics (e.g. praising good focus, suggesting breaks if time is high but focus is low, etc).
2. Actionable advice tailored to their goal.
3. A suggested weekly structure or routine to achieve the goal while balancing their pending tasks.

Keep it structured, encouraging, and under 300 words if possible.
`

  let retries = 5
  let delay = 2000 // Start with a 2s delay

  while (retries > 0) {
    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      const errorMessage = error.message.toLowerCase()
      // Check if it's a rate limit or server overload error
      if (errorMessage.includes('503') || errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('overloaded')) {
        retries -= 1
        if (retries === 0) {
          console.error('Error generating strategy after retries:', error)
          throw new Error('The AI service is currently experiencing extremely high demand. Please try again in a few minutes.')
        }
        // Wait for the delay period before retrying
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff (1.5s -> 3s -> 6s)
      } else {
        // If it's a different kind of error (e.g., bad API key), fail immediately
        console.error('Error generating strategy:', error)
        throw new Error(`Failed to generate study strategy. Details: ${error.message}`)
      }
    }
  }
}
