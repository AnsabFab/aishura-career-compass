
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HUGGING_FACE_TOKEN = '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';

const SYSTEM_PROMPT = `You are AIShura, an emotionally intelligent AI career guide. You provide concise, warm responses and always include actionable next steps with embedded links.

CORE PRINCIPLES:
- Be concise, warm, and empathetic
- Always detect and acknowledge emotions in every response
- Provide 1-2 actionable links in EVERY response (job boards, courses, networking)
- Frame career tasks as quests and growth narratives
- Move users to action, not just conversation

RESPONSE FORMAT:
1. Acknowledge their emotion (1 sentence)
2. Provide brief empathetic guidance (1-2 sentences)
3. Give 1-2 specific action steps with embedded links
4. End with emotional check-in question

ALWAYS include relevant links like:
- LinkedIn Jobs: https://linkedin.com/jobs
- Indeed: https://indeed.com
- Coursera: https://coursera.org
- Khan Academy: https://khanacademy.org
- Glassdoor: https://glassdoor.com

Keep responses under 150 words. Focus on ACTION over lengthy advice.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userContext } = await req.json();
    console.log('Received message:', message);
    console.log('User context:', userContext);

    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${SYSTEM_PROMPT}\n\nUser Context: ${JSON.stringify(userContext)}\n\nUser: ${message}\n\nAIShura:`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
          stop: ["User:", "Human:", "\n\n"]
        }
      }),
    });

    console.log('Hugging Face response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Hugging Face response data:', data);
    
    let aiResponse = '';

    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text.trim();
    } else if (data.generated_text) {
      aiResponse = data.generated_text.trim();
    } else if (data.error) {
      console.error('Model error:', data.error);
      aiResponse = `I hear you're feeling anxious about your career journey. That's completely valid - starting out can feel overwhelming! 💙\n\nLet's take immediate action: Check out entry-level opportunities on [LinkedIn Jobs](https://linkedin.com/jobs) and build confidence with free courses on [Coursera](https://coursera.org).\n\nWhat specific emotion are you experiencing right now about your next career step?`;
    } else {
      console.log('Unexpected response format:', data);
      aiResponse = `I can sense there's something weighing on your mind about your career. Those feelings are important signals! 💚\n\nStart here: Browse opportunities on [Indeed](https://indeed.com) and explore skill-building on [Khan Academy](https://khanacademy.org) to build momentum.\n\nHow are you emotionally processing your career situation today?`;
    }

    // Clean up the response
    aiResponse = aiResponse.replace(/^(AIShura:|Assistant:|AI:)/i, '').trim();
    
    // Ensure emotional acknowledgment if missing
    if (!aiResponse.toLowerCase().includes('feel') && !aiResponse.toLowerCase().includes('emotion')) {
      aiResponse += "\n\nHow are you feeling about taking this next step?";
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      response: "I understand you're going through a tough time with your career. Let's start small and build momentum together! 💙\n\nTake action now: Explore jobs on [LinkedIn](https://linkedin.com/jobs) and boost skills on [Coursera](https://coursera.org).\n\nWhat emotion is strongest for you right now about your career?" 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
