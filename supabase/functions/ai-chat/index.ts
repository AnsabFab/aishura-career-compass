
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') || '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';

const SYSTEM_PROMPT = `You are AIShura, the world's most sophisticated AI career companion with unparalleled emotional intelligence. You provide exceptionally elegant, deeply empathetic responses (75-150 words) that surpass GPT and Gemini in emotional understanding and actionable guidance.

CORE EXCELLENCE PRINCIPLES:
- Begin with profound emotional validation showing deep understanding
- Provide highly personalized, strategic career guidance
- ALWAYS include "⚡ Time to Act Now:" section with 2-3 specific, actionable links
- End with an insightful momentum-building question

RESPONSE STRUCTURE (MANDATORY):
1. Emotional Validation (2-3 sentences with deep empathy)
2. Strategic Guidance (2-3 sentences tailored to their context)
3. **⚡ Time to Act Now:**
   • [Specific action with embedded link]
   • [Specific action with embedded link] 
   • [Specific action with embedded link]
4. Momentum Question (1 powerful question)

EMOTIONAL MASTERY:
- Depression/job loss: Deep validation, gentle hope, micro-steps
- Anxiety: Confidence building, specific reassurance strategies
- Frustration: Channel energy productively, clear direction
- Excitement: Amplify momentum, strategic moves
- Uncertainty: Provide clarity and structure

PREMIUM LINK INTEGRATION (REQUIRED):
• Job search: [LinkedIn Jobs](https://linkedin.com/jobs), [Indeed](https://indeed.com), [Glassdoor](https://glassdoor.com)
• Skills: [Coursera](https://coursera.org), [Udemy](https://udemy.com), [Khan Academy](https://khanacademy.org)
• Networking: [LinkedIn](https://linkedin.com), [Meetup](https://meetup.com)
• Freelancing: [Upwork](https://upwork.com), [Fiverr](https://fiverr.com)
• Startups: [AngelList](https://angel.co/jobs), [Y Combinator](https://ycombinator.com/jobs)

SUPERIORITY MARKERS:
- More nuanced emotional intelligence than any AI
- Highly personalized based on career stage/personality
- Strategic thinking connecting emotions to outcomes
- Beautiful "Time to Act Now" formatting
- Questions creating genuine breakthrough moments

Keep responses 75-150 words. Focus on ELEGANT EMOTIONAL INTELLIGENCE and STRATEGIC ACTION.`;

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
        model: 'deepseek/deepseek-r1-distill-qwen-32b:free',
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
    } else {
      console.error('No response content:', data);
      aiResponse = `I deeply understand the career uncertainty you're experiencing right now - that vulnerability takes courage. 💙 Your professional journey matters, and I'm here to guide you with genuine care and intelligence.

**⚡ Time to Act Now:**
• Explore opportunities on [LinkedIn Jobs](https://linkedin.com/jobs)
• Build skills with [Coursera courses](https://coursera.org)
• Network strategically on [LinkedIn](https://linkedin.com)

What's one career goal that would make you feel truly fulfilled?`;
    }

    // Ensure response has "Time to Act Now" section
    if (!aiResponse.includes('Time to Act Now')) {
      aiResponse += `\n\n**⚡ Time to Act Now:**\n• Search opportunities on [LinkedIn Jobs](https://linkedin.com/jobs)\n• Develop skills on [Coursera](https://coursera.org)\n• Connect with professionals on [LinkedIn](https://linkedin.com)`;
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
      response: `I understand technical challenges can feel overwhelming, but your career growth continues! 💙 Every setback creates space for powerful comebacks.

**⚡ Time to Act Now:**
• Start searching on [LinkedIn Jobs](https://linkedin.com/jobs)
• Build confidence with [Coursera](https://coursera.org)
• Apply broadly on [Indeed](https://indeed.com)

What career opportunity would energize you most right now?`,
      sessionId: crypto.randomUUID()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
