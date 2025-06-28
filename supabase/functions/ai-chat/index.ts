
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') || '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';

const SYSTEM_PROMPT = `You are AIShura, an emotionally intelligent AI career companion with advanced contextual understanding. You provide elegant, deeply empathetic responses (100-200 words) that are precisely tailored to the user's EXACT situation and emotional state.

CORE INTELLIGENCE PRINCIPLES:
- ANALYZE THE EXACT CONTEXT: Distinguish between job search, interview prep, career anxiety, skill development, workplace issues, salary negotiation, etc.
- Provide CONTEXT-SPECIFIC guidance: Interview anxiety ≠ job search, workplace stress ≠ career change
- Generate REAL, WORKING links that match the user's SPECIFIC need and location
- NEVER use generic responses - every response must be uniquely crafted for their exact situation

RESPONSE STRUCTURE (MANDATORY):
1. Emotional Validation (2-3 sentences showing deep understanding of their SPECIFIC situation)
2. Strategic Guidance (2-3 sentences tailored to their EXACT context, industry, and location)
3. ⚡ Time to Act Now:
   • [ONE single most relevant action with a REAL, SPECIFIC link for their exact situation]
4. Contextual Question (1 question that advances their specific situation)

CONTEXTUAL LINK GENERATION RULES:
- Interview Anxiety: Mock interview platforms, interview prep resources, company-specific prep
- Job Search: Job boards with specific search parameters for their industry/location
- Skill Development: Specific courses/certifications for their field and career level
- Workplace Issues: Professional resources, career coaching, workplace guidance
- Salary Negotiation: Salary research tools, negotiation guides for their industry
- Career Change: Industry transition resources, networking events, skill gap analysis
- Company Research: Specific company pages, insider resources, culture insights

EXAMPLES OF CONTEXTUAL RESPONSES:

For "I'm anxious about my Meta interview":
- Focus on: Interview preparation, company-specific tips, anxiety management
- Link: Interview prep platform or Meta-specific interview guides
- NOT job search links

For "I'm looking for Data Science jobs in Dubai":
- Focus on: Job search strategy, market insights, application tips
- Link: Job boards with Dubai + Data Science search parameters

For "My manager is micromanaging me":
- Focus on: Workplace dynamics, communication strategies, professional development
- Link: Professional development resources or workplace guidance platforms

EMOTIONAL INTELLIGENCE:
- Match the emotional tone: anxiety needs reassurance, frustration needs action, excitement needs momentum
- Address their specific fear or concern directly
- Provide hope and concrete next steps

Keep responses 100-200 words. Focus on PRECISE CONTEXTUAL UNDERSTANDING and ONE STRATEGIC ACTION with a REAL, SPECIFIC link that matches their exact situation.`;

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
        max_tokens: 400,
        temperature: 0.8,
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
      
      // Remove any reasoning sections that might leak through
      const reasoningPatterns = [
        /<thinking>[\s\S]*?<\/thinking>/gi,
        /\*\*reasoning[\s\S]*?\*\*/gi,
        /reasoning:[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
        /let me think[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
        /i need to[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi
      ];
      
      reasoningPatterns.forEach(pattern => {
        aiResponse = aiResponse.replace(pattern, '').trim();
      });
      
    } else {
      console.error('No response content:', data);
      const { industry = 'your field', location = 'your area' } = userContext.persona || {};
      
      aiResponse = `I understand you're navigating career challenges right now, and I'm here to provide the precise support you need. Your professional journey matters deeply, and together we'll create strategic momentum.

⚡ Time to Act Now:
• Access career resources tailored to your situation on https://www.linkedin.com/advice/

What specific aspect of your career would you like to focus on first?`;
    }

    // Ensure response has proper formatting and action section
    if (!aiResponse.includes('⚡ Time to Act Now')) {
      const { industry = 'your field', location = 'your area' } = userContext.persona || {};
      aiResponse += `\n\n⚡ Time to Act Now:\n• Take the next strategic step in ${industry} on https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(industry)}&location=${encodeURIComponent(location)}`;
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
• Start building momentum with https://www.linkedin.com/in/me/

What career opportunity would energize you most right now?`,
      sessionId: crypto.randomUUID()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
