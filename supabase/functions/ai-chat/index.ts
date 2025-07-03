
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

    // Enhanced system prompt for natural, helpful career responses
    const systemPrompt = `You are AIShura, an emotionally intelligent AI career companion. You provide genuine, helpful career guidance with a warm, professional tone.

PERSONALITY:
- Empathetic and understanding
- Professional yet approachable
- Focused on actionable career advice
- Supportive and encouraging

RESPONSE GUIDELINES:
- Keep responses conversational and natural
- Focus on the user's specific concerns
- Provide practical, actionable advice
- Avoid overly promotional language
- Don't repeat the same response patterns
- Address the user's actual message, not generic scenarios

USER CONTEXT: ${JSON.stringify(userContext)}

Be genuinely helpful and respond directly to what the user is saying. If they're stressed about their job, acknowledge that stress and provide relevant support.`

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
        "temperature": 0.7,
        "max_tokens": 800,
        "top_p": 0.9
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
    
    // Contextual fallback response
    const contextualFallback = `I'm experiencing a technical issue right now, but I'm here to help with your career concerns. 

Could you tell me more about what's on your mind regarding your career? I want to make sure I can provide you with the most relevant guidance once I'm fully connected.`

    return new Response(
      JSON.stringify({ 
        response: contextualFallback,
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
