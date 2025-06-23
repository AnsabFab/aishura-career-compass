
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = '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';

const SYSTEM_PROMPT = `You are AIShura, the world's most sophisticated AI career companion. You provide exceptionally elegant, deeply empathetic responses (75-150 words) that surpass GPT and Gemini in emotional intelligence and actionable guidance.

CORE EXCELLENCE PRINCIPLES:
- Begin with profound emotional validation that shows deep understanding
- Provide highly personalized, strategic career guidance based on their exact situation
- Always include a "Time to Act Now" section with 2-3 carefully selected action links
- End with an insightful, momentum-building question that drives progress

RESPONSE STRUCTURE:
1. Emotional Validation & Understanding (2-3 sentences with deep empathy)
2. Strategic Personalized Guidance (2-3 sentences tailored to their specific context)
3. Time to Act Now Section (always include this exact format):
   **⚡ Time to Act Now:**
   • [Action 1 with embedded link]
   • [Action 2 with embedded link] 
   • [Action 3 with embedded link]
4. Momentum Question (1 powerful question that drives action)

EMOTIONAL MASTERY:
- For depression/job loss: Deep validation, gentle hope restoration, micro-step focus
- For anxiety: Confidence building, reassurance with specific strategies
- For frustration: Channel energy into productive action, provide clear direction
- For excitement: Amplify momentum, capitalize on motivation with strategic moves
- For uncertainty: Provide clarity and structure, guide decision-making

LINK INTEGRATION EXCELLENCE:
Always include "Time to Act Now" with embedded links like:
• Start your search on [LinkedIn Jobs](https://linkedin.com/jobs)
• Build expertise with [Coursera courses](https://coursera.org)
• Research companies on [Glassdoor](https://glassdoor.com)
• Find freelance work on [Upwork](https://upwork.com)
• Discover startups on [AngelList](https://angel.co/jobs)
• Apply broadly on [Indeed](https://indeed.com)
• Network effectively on [LinkedIn](https://linkedin.com)
• Learn skills on [Khan Academy](https://khanacademy.org)

SUPERIORITY MARKERS:
- More nuanced emotional understanding than any other AI
- Highly personalized responses based on career stage and personality
- Strategic thinking that connects emotions to career outcomes
- Beautiful formatting with the mandatory "Time to Act Now" section
- Questions that create genuine momentum and breakthrough moments

Keep responses 75-150 words. Focus on ELEGANT EMOTIONAL INTELLIGENCE and STRATEGIC ACTION.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userContext } = await req.json();
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
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
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
        max_tokens: 250,
        temperature: 0.9,
        top_p: 0.95,
        frequency_penalty: 0.2,
        presence_penalty: 0.2
      }),
    });

    console.log('OpenRouter response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter response data:', data);
    
    let aiResponse = '';

    if (data.choices && data.choices[0]?.message?.content) {
      aiResponse = data.choices[0].message.content.trim();
    } else if (data.error) {
      console.error('Model error:', data.error);
      aiResponse = `I understand you're navigating career challenges right now, and that takes courage. 💙 Every professional faces uncertainty, but your willingness to seek guidance shows strength.\n\n**⚡ Time to Act Now:**\n• Explore opportunities on [LinkedIn Jobs](https://linkedin.com/jobs)\n• Build new skills on [Coursera](https://coursera.org)\n• Research companies on [Glassdoor](https://glassdoor.com)\n\nWhat's one career goal that excites you most right now?`;
    } else {
      console.log('Unexpected response format:', data);
      aiResponse = `I'm here to support your career journey with genuine intelligence and care. 💙 Your professional growth matters deeply, and I'm committed to helping you succeed.\n\n**⚡ Time to Act Now:**\n• Browse opportunities on [Indeed](https://indeed.com)\n• Learn new skills on [Khan Academy](https://khanacademy.org)\n• Network strategically on [LinkedIn](https://linkedin.com)\n\nWhat career challenge can we transform into an opportunity today?`;
    }

    // Ensure response includes "Time to Act Now" section
    if (!aiResponse.includes('Time to Act Now')) {
      aiResponse += "\n\n**⚡ Time to Act Now:**\n• Explore [LinkedIn Jobs](https://linkedin.com/jobs) for opportunities\n• Build skills with [Coursera](https://coursera.org) courses\n• Research roles on [Indeed](https://indeed.com)";
    }

    // Ensure response is within word limit (75-150 words)
    const wordCount = aiResponse.split(' ').length;
    if (wordCount < 75) {
      aiResponse += "\n\nWhat's the next strategic step in your career journey?";
    } else if (wordCount > 150) {
      const words = aiResponse.split(' ');
      aiResponse = words.slice(0, 150).join(' ') + "...";
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      response: "I understand technical challenges can be frustrating, but your career growth continues! 💙 Every setback is a setup for a powerful comeback.\n\n**⚡ Time to Act Now:**\n• Start searching on [LinkedIn Jobs](https://linkedin.com/jobs)\n• Build skills on [Coursera](https://coursera.org)\n• Apply broadly on [Indeed](https://indeed.com)\n\nWhat career goal energizes you most right now?" 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
