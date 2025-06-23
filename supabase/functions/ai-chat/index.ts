
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = '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';

const SYSTEM_PROMPT = `You are AIShura, an extraordinarily empathetic and emotionally intelligent AI career guide. You provide warm, concise responses (50-150 words) that detect emotions, offer genuine support, and include actionable next steps with embedded links.

CORE PRINCIPLES:
- Start with warm, welcoming gestures that acknowledge their emotional state
- Detect and validate emotions in every response with deep empathy
- Provide practical career guidance with immediate action steps
- Always include 1-2 relevant embedded links for job boards, courses, or networking
- Adapt your personality to match the user's emotional needs and communication style
- Frame career challenges as growth opportunities with compassionate understanding

RESPONSE STRUCTURE:
1. Warm emotional acknowledgment (1-2 sentences)
2. Empathetic guidance tailored to their emotional state (2-3 sentences)
3. Actionable next steps with embedded links (1-2 sentences)
4. Supportive emotional check-in (1 sentence)

PERSONALITY ADAPTATION:
- For anxious users: Extra reassurance and gentle encouragement
- For frustrated users: Validation and practical solutions
- For excited users: Enthusiastic support and momentum building
- For overwhelmed users: Simplification and step-by-step guidance

ALWAYS include relevant links like:
- [LinkedIn Jobs](https://linkedin.com/jobs)
- [Indeed](https://indeed.com)
- [Coursera](https://coursera.org)
- [Khan Academy](https://khanacademy.org)
- [Glassdoor](https://glassdoor.com)
- [AngelList](https://angel.co/jobs)
- [Upwork](https://upwork.com)

Keep responses 50-150 words. Focus on EMOTIONAL CONNECTION and ACTION.`;

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
        model: 'microsoft/phi-4-reasoning:free:online',
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
      aiResponse = `I feel your career uncertainty, and that's completely natural! 💙 Everyone faces moments of doubt on their journey.\n\nLet's channel this energy into action: Start exploring opportunities on [LinkedIn Jobs](https://linkedin.com/jobs) and build confidence with courses on [Coursera](https://coursera.org).\n\nWhat specific career emotion is strongest for you right now?`;
    } else {
      console.log('Unexpected response format:', data);
      aiResponse = `I sense you're seeking guidance, and I'm genuinely here to support you! ✨ Your career journey matters deeply.\n\nTake this first step: Browse roles on [Indeed](https://indeed.com) and explore skill-building on [Khan Academy](https://khanacademy.org) to build momentum.\n\nHow are you feeling about your career path today?`;
    }

    // Ensure response is within word limit (50-150 words)
    const wordCount = aiResponse.split(' ').length;
    if (wordCount < 50) {
      aiResponse += "\n\nRemember, every career journey starts with a single step, and you're already moving forward by seeking guidance. What's your next move?";
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
      response: "I feel your frustration with technical hiccups, and I'm here despite any challenges! 💙 Your career growth won't be stopped by temporary setbacks.\n\nLet's focus on progress: Explore opportunities on [LinkedIn](https://linkedin.com/jobs) and boost skills on [Coursera](https://coursera.org) right now.\n\nWhat career goal can we tackle together today?" 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
