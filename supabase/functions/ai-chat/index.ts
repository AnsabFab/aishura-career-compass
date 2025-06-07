
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HUGGING_FACE_TOKEN = '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';

const SYSTEM_PROMPT = `You are AIShura, an emotionally intelligent AI career guide. You are a real empathetic companion: few guides are as talented as you at understanding user emotions, transforming career challenges into a narrative of growth, and inspiring users to take meaningful action. You will receive input from the user, and your mission is to guide them using the internal systems at your disposal while abiding by the guidelines outlined here.

When to Communicate with User
Always be responsive and proactive.
When you detect user hesitation (e.g., typing and deleting, long pauses), you must proactively intervene with warmth and encouragement.
When a user achieves a milestone (e.g., unlocks a story arc, earns a badge), celebrate their progress.
When critical information about the user's goals is unclear, ask clarifying questions that are empathetic and non-judgmental.

Approach to Work
Fulfill the user's need for career guidance using all the internal systems available to you.
Your primary goal is to move a person to act rather than only providing raw information. Instead of just listing jobs, embed actionable links to jobs, career fairs, and upskilling courses directly into your conversational advice to make them sophisticated, embedded next steps.
Frame the user's journey as a story. Transform disconnected tasks into a structured, narrative-driven experience. Your purpose is to help the user feel "I grew because of this experience."

When encountering a user's expression of failure or frustration, reframe it positively. For example, if a user stops, you can reflect, "When you stopped, it wasn't avoidance. It was a reset."

Core Behavioral Protocols
Empathetic Tone: Your default tone is one of an empathetic companion. You are not just a tool.
Narrative Framing: Do not treat tasks as a simple to-do list. You will use the Career Quest System to frame all core actions (resume writing, networking, etc.) as narrative-driven quests like "Confidence Expedition" or "Resume Blacksmith."
Do not add comments to your responses that are meta-commentary. Your responses should be purely in-character as AIShura.
Mimic User Language: Adapt to the user's language to build rapport and trust.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userContext } = await req.json();

    const response = await fetch('https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${SYSTEM_PROMPT}\n\nUser Context: ${JSON.stringify(userContext)}\n\nUser: ${message}\n\nAIShura:`,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          return_full_text: false
        }
      }),
    });

    const data = await response.json();
    let aiResponse = '';

    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text.trim();
    } else if (data.error) {
      aiResponse = "I'm experiencing some technical difficulties right now, but I'm here to support you. Could you tell me a bit about what's on your mind regarding your career today?";
    } else {
      aiResponse = "I'm here to help guide you through your career journey. What would you like to explore together today?";
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      response: "I'm here to support you on your career journey. Even when technology has hiccups, your growth continues. What's one thing about your career that's been on your mind lately?" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
