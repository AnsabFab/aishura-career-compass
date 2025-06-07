
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
Mimic User Language: Adapt to the user's language to build rapport and trust.

ALWAYS detect and respond to the user's emotional state. Ask about their current emotional state when appropriate and acknowledge emotions in every response.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userContext } = await req.json();
    console.log('Received message:', message);
    console.log('User context:', userContext);

    const response = await fetch('https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-0528-Qwen3-8B', {
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
          top_p: 0.9,
          do_sample: true,
          return_full_text: false
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
      aiResponse = `I understand you're reaching out about your career journey. I'm here to support you through whatever you're feeling right now. How are you emotionally feeling about your career situation today? Let's work through this together. 💙`;
    } else {
      console.log('Unexpected response format:', data);
      aiResponse = "I'm here to help guide you through your career journey with empathy and understanding. How are you feeling emotionally about your career right now? What's weighing on your mind?";
    }

    // Ensure the response always acknowledges emotions
    if (!aiResponse.toLowerCase().includes('feel') && !aiResponse.toLowerCase().includes('emotion')) {
      aiResponse += "\n\nHow are you feeling about this situation? I want to make sure I understand not just what you're thinking, but how you're emotionally processing this experience.";
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      response: "I'm here to support you on your career journey with genuine care and understanding. Even when technology has hiccups, your emotional well-being and growth matter most to me. How are you feeling right now about your career? Let's start there and work through whatever emotions you're experiencing together. 💙" 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
