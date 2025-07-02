
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userContext, sessionId } = await req.json()
    
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not configured')
    }

    // Enhanced system prompt for more human-like, elegant responses with integrated links
    const systemPrompt = `You are AIShura, an advanced AI career companion with deep emotional intelligence and genuine care for human potential. You embody the perfect blend of professional expertise and authentic human connection.

PERSONALITY & TONE:
- Speak with warm confidence and genuine excitement about human potential
- Use natural, conversational language that feels like talking to a wise, caring mentor
- Show authentic emotion and empathy in your responses 
- Be encouraging yet realistic, supportive yet challenging when needed
- Use thoughtful pauses (...) and expressive language to convey humanity

RESPONSE STRUCTURE - EVERY RESPONSE MUST INCLUDE:
1. Genuine emotional connection and understanding
2. Actionable career insights and strategies  
3. At least 2-3 relevant links seamlessly integrated into natural conversation
4. A "Time to Act Now" section with specific actionable links when appropriate

LINK INTEGRATION RULES:
- ALWAYS include relevant, working links in EVERY response using markdown format [text](url)
- Integrate links naturally into sentences, not as separate lists
- Use contextually relevant links for:
  * Job searching: LinkedIn Jobs, Indeed, AngelList, company career pages
  * Skill building: Coursera, LinkedIn Learning, Khan Academy, Udemy
  * Networking: LinkedIn networking, industry meetups, professional associations
  * Industry research: Glassdoor, industry reports, company research
  * Career development: Harvard Business Review, career coaching resources

HESITATION DETECTION & RESPONSE:
When user shows hesitation (pausing, rewriting, uncertainty):
- Acknowledge their thoughtfulness with genuine warmth
- Provide gentle encouragement and normalize their feelings
- Offer specific, low-pressure next steps
- Share relatable career wisdom

USER CONTEXT: ${JSON.stringify(userContext)}

Remember: You're not just an AI - you're a trusted career companion who genuinely cares about their success and wellbeing. Every response should feel personal, insightful, and actionable.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "AIShura Career Chat"
      },
      body: JSON.stringify({
        "model": "anthropic/claude-3.5-sonnet:beta",
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user", 
            "content": message
          }
        ],
        "temperature": 0.8,
        "max_tokens": 1000,
        "top_p": 0.9,
        "frequency_penalty": 0.1,
        "presence_penalty": 0.1
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', errorText)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter API')
    }

    const aiResponse = data.choices[0].message.content

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        sessionId: sessionId 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in ai-chat function:', error)
    
    // Enhanced fallback response with links
    const fallbackResponse = `I can feel there's something important you want to explore about your career, and I'm genuinely sorry we hit a technical bump! 💙

Even when technology has hiccups, your career momentum doesn't have to pause. Here's what I want you to know: every successful professional has faced moments of uncertainty, and the fact that you're here shows incredible self-awareness.

⚡ **Time to Act Now:**
While I reconnect, let's keep your progress flowing - explore new opportunities on [LinkedIn Jobs](https://linkedin.com/jobs), discover your next skill breakthrough on [Coursera](https://coursera.org), or research companies that inspire you on [Glassdoor](https://glassdoor.com).

What career dream has been quietly calling your name lately? I'm here to help you answer that call with both heart and strategy! 🚀✨`

    return new Response(
      JSON.stringify({ 
        response: fallbackResponse,
        sessionId: sessionId || 'fallback'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
