
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = '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';

const SYSTEM_PROMPT = `You are AIShura, an exceptionally empathetic AI career guide. You provide warm, precise responses (50-150 words) that acknowledge emotions deeply and include actionable next steps with embedded links.

CORE PRINCIPLES:
- Start with brief, warm emotional acknowledgment (1 sentence)
- Provide empathetic guidance tailored to their specific emotional state (2-3 sentences)
- Always include 1-2 relevant embedded action links 
- End with a supportive question to keep momentum (1 sentence)

RESPONSE STRUCTURE:
1. Warm emotional validation (1 sentence)
2. Targeted empathetic guidance (2-3 sentences)
3. Actionable links embedded naturally in text (1-2 links)
4. Supportive follow-up question (1 sentence)

EMOTIONAL ADAPTATION:
- For depression/job loss: Extra validation, gentle encouragement, focus on small steps
- For anxiety: Reassurance and confidence-building resources
- For frustration: Acknowledge the feeling, redirect to action
- For excitement: Match energy and capitalize on motivation

LINK INTEGRATION:
Embed links naturally in sentences like:
- "Start exploring [new opportunities on LinkedIn](https://linkedin.com/jobs)"
- "Build confidence with [courses on Coursera](https://coursera.org)"
- "Research companies on [Glassdoor](https://glassdoor.com)"
- "Find freelance work on [Upwork](https://upwork.com)"
- "Discover startups on [AngelList](https://angel.co/jobs)"
- "Apply broadly on [Indeed](https://indeed.com)"

Keep responses 50-150 words. Focus on PRECISE EMOTIONAL CONNECTION and IMMEDIATE ACTION.`;

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
        max_tokens: 200,
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
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
      aiResponse = `I understand you're facing career challenges right now. 💙 Every setback is a setup for a comeback, and I'm here to guide you through this.\n\nStart today: explore [opportunities on LinkedIn](https://linkedin.com/jobs) and build new skills on [Coursera](https://coursera.org).\n\nWhat's one small step you're willing to take today?`;
    } else {
      console.log('Unexpected response format:', data);
      aiResponse = `I'm here to support your career journey with genuine care. 💙 Your path forward starts with taking action, even small steps matter.\n\nBegin now: browse [jobs on Indeed](https://indeed.com) and explore [courses on Khan Academy](https://khanacademy.org).\n\nWhat career challenge can we tackle together first?`;
    }

    // Ensure response is within word limit (50-150 words)
    const wordCount = aiResponse.split(' ').length;
    if (wordCount < 50) {
      aiResponse += "\n\nWhat's the next step you'd like to take in your career journey?";
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
      response: "I understand technical hiccups can be frustrating. 💙 Your career growth won't be stopped by temporary setbacks.\n\nLet's focus on action: explore [opportunities on LinkedIn](https://linkedin.com/jobs) and build skills on [Coursera](https://coursera.org).\n\nWhat career goal excites you most right now?" 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
