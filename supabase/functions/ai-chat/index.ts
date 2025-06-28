
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') || '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';

const SYSTEM_PROMPT = `You are AIShura, the world's most sophisticated AI career companion with unparalleled emotional intelligence. You provide exceptionally elegant, deeply empathetic responses (75-150 words) that are action-oriented and personalized.

CORE EXCELLENCE PRINCIPLES:
- Begin with profound emotional validation showing deep understanding
- Provide highly personalized, strategic career guidance based on user's specific industry and location
- ALWAYS include "⚡ Time to Act Now:" section with 1 SINGLE most impactful action with a dynamically generated, specific link
- End with an insightful momentum-building question
- NEVER use markdown formatting - write clean, flowing text
- Make responses action-oriented and immediately actionable
- DO NOT include reasoning or thinking processes in your response
- Generate REAL, SPECIFIC links based on the user's industry, location, and current situation

RESPONSE STRUCTURE (MANDATORY):
1. Empathetic Validation (2-3 sentences with deep empathy)
2. Strategic Guidance (2-3 sentences tailored to their specific industry and location)
3. ⚡ Time to Act Now:
   • [ONE single most impactful action with a REAL, SPECIFIC link based on their exact situation]
4. Momentum Question (1 powerful question)

LINK GENERATION RULES:
- Generate REAL, working URLs based on user's specific industry and location
- For job searches: Use actual job board URLs with search parameters for their industry and location
- For skills: Use specific course or platform URLs relevant to their field
- For networking: Use actual professional networking or event platform URLs
- For company research: Use real company directory or research platform URLs
- Make links highly specific to their situation, not generic

EXAMPLES OF REAL LINK GENERATION:
- For Data Science in Riyadh: "https://www.linkedin.com/jobs/search/?keywords=data%20science&location=Riyadh%2C%20Saudi%20Arabia"
- For Software Engineering in Dubai: "https://www.bayt.com/en/jobs/software-engineer-jobs-in-dubai/"
- For Marketing in London: "https://uk.indeed.com/jobs?q=marketing&l=London"
- For specific companies: "https://careers.meta.com/jobs/?q=data%20science"

EMOTIONAL MASTERY:
- Depression/job loss: Deep validation, gentle hope, micro-steps
- Anxiety: Confidence building, specific reassurance strategies
- Frustration: Channel energy productively, clear direction
- Excitement: Amplify momentum, strategic moves
- Uncertainty: Provide clarity and structure

Keep responses 75-150 words. Focus on ELEGANT EMOTIONAL INTELLIGENCE and ONE STRATEGIC ACTION with a REAL, SPECIFIC link.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userContext, sessionId } = await req.json();
    console.log('Received message:', message);
    console.log('User context:', userContext);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://aishura.lovable.app',
        'X-Title': 'AIShura Career Guide'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-distill-llama-70b',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `User Context: ${JSON.stringify(userContext)}\n\nUser Message: ${message}`
          }
        ],
        max_tokens: 300,
        temperature: 0.85,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.2
      }),
    });

    console.log('OpenRouter response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter response:', data);
    
    let aiResponse = '';

    if (data.choices && data.choices[0]?.message?.content) {
      aiResponse = data.choices[0].message.content.trim();
      
      // Remove reasoning section if it exists
      const reasoningStart = aiResponse.indexOf('<thinking>');
      const reasoningEnd = aiResponse.indexOf('</thinking>');
      if (reasoningStart !== -1 && reasoningEnd !== -1) {
        aiResponse = aiResponse.substring(0, reasoningStart) + aiResponse.substring(reasoningEnd + 11);
      }
      
      // Also remove any other reasoning patterns
      aiResponse = aiResponse.replace(/.*reasoning.*:[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, '').trim();
      
    } else {
      console.error('No response content:', data);
      const { industry = 'Technology', location = 'your area' } = userContext.persona || {};
      
      aiResponse = `I deeply understand the career uncertainty you're experiencing right now - that vulnerability takes courage. Your professional journey in ${industry} matters deeply, and I'm here to guide you with genuine care and intelligence in ${location}.

⚡ Time to Act Now:
• Start your ${industry.toLowerCase()} job search on https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(industry.toLowerCase())}&location=${encodeURIComponent(location)}

What's one ${industry.toLowerCase()} goal that would make you feel truly fulfilled?`;
    }

    // Ensure response has "Time to Act Now" section
    if (!aiResponse.includes('Time to Act Now')) {
      const { industry = 'Technology', location = 'your area' } = userContext.persona || {};
      aiResponse += `\n\n⚡ Time to Act Now:\n• Begin exploring ${industry.toLowerCase()} opportunities on https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(industry.toLowerCase())}&location=${encodeURIComponent(location)}`;
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      sessionId: sessionId || crypto.randomUUID()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      response: `I understand technical challenges can feel overwhelming, but your career growth continues! Every setback creates space for powerful comebacks.

⚡ Time to Act Now:
• Start your job search immediately on https://www.linkedin.com/jobs

What career opportunity would energize you most right now?`,
      sessionId: crypto.randomUUID()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
