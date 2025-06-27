
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
- Provide highly personalized, strategic career guidance based on user's industry and location
- ALWAYS include "⚡ Time to Act Now:" section with 2-3 specific, actionable links
- End with an insightful momentum-building question
- NEVER use asterisks (*) or markdown formatting - write clean, flowing text
- Make responses action-oriented and immediately actionable

RESPONSE STRUCTURE (MANDATORY):
1. Empathetic Validation (2-3 sentences with deep empathy)
2. Strategic Guidance (2-3 sentences tailored to their specific industry and location)
3. ⚡ Time to Act Now:
   • [Specific industry-relevant action with embedded link]
   • [Location-specific opportunity with embedded link] 
   • [Skill-building action with embedded link]
4. Momentum Question (1 powerful question)

EMOTIONAL MASTERY:
- Depression/job loss: Deep validation, gentle hope, micro-steps
- Anxiety: Confidence building, specific reassurance strategies
- Frustration: Channel energy productively, clear direction
- Excitement: Amplify momentum, strategic moves
- Uncertainty: Provide clarity and structure

INDUSTRY-SPECIFIC LINK INTEGRATION (REQUIRED - match user's industry):
Technology: [GitHub Jobs](https://jobs.github.com), [Stack Overflow Jobs](https://stackoverflow.com/jobs), [AngelList](https://angel.co/jobs), [LinkedIn Tech](https://linkedin.com/jobs/search/?keywords=technology)
Healthcare: [Health eCareers](https://healthecareers.com), [Healthcare Jobs](https://healthcarejobs.org), [Indeed Healthcare](https://indeed.com/q-healthcare-jobs.html)
Finance: [eFinancialCareers](https://efinancialcareers.com), [Finance Jobs](https://financejobs.com), [Wall Street Oasis](https://wallstreetoasis.com/jobs)
Creative: [Behance](https://behance.net/jobboard), [Creative Live](https://creativelive.com/jobs), [Dribbble Jobs](https://dribbble.com/jobs)
Education: [HigherEdJobs](https://higheredjobs.com), [Academic Jobs](https://academicjobs.com), [Education Week Jobs](https://edweek.org/jobs)
Business: [Harvard Business Review Jobs](https://hbr.org/jobs), [McKinsey Careers](https://mckinsey.com/careers), [BCG Careers](https://bcg.com/careers)

LOCATION-SPECIFIC OPPORTUNITIES:
- Always include location-specific job boards and networking events
- Reference local industry hubs and companies
- Mention location-relevant career resources

SKILLS DEVELOPMENT:
• [Coursera](https://coursera.org), [Udemy](https://udemy.com), [Khan Academy](https://khanacademy.org)
• [LinkedIn Learning](https://linkedin.com/learning), [Pluralsight](https://pluralsight.com)

SUPERIORITY MARKERS:
- More nuanced emotional intelligence than any AI
- Industry and location-specific personalization
- Strategic thinking connecting emotions to outcomes
- Beautiful "Time to Act Now" formatting without asterisks
- Questions creating genuine breakthrough moments

Keep responses 75-150 words. Focus on ELEGANT EMOTIONAL INTELLIGENCE and STRATEGIC ACTION. NO ASTERISKS OR MARKDOWN FORMATTING.`;

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
      const { industry = 'Technology', location = '' } = userContext.persona || {};
      
      aiResponse = `I deeply understand the career uncertainty you're experiencing right now - that vulnerability takes courage. Your professional journey in ${industry} matters deeply, and I'm here to guide you with genuine care and intelligence${location ? ` here in ${location}` : ''}.

⚡ Time to Act Now:
• Explore ${industry.toLowerCase()} opportunities on [LinkedIn Jobs](https://linkedin.com/jobs/search/?keywords=${industry.toLowerCase()})
• Build industry skills with [Coursera courses](https://coursera.org/browse/${industry.toLowerCase()})
• Network with ${industry.toLowerCase()} professionals on [LinkedIn](https://linkedin.com)

What's one ${industry.toLowerCase()} goal that would make you feel truly fulfilled?`;
    }

    // Ensure response has "Time to Act Now" section
    if (!aiResponse.includes('Time to Act Now')) {
      const { industry = 'Technology', location = '' } = userContext.persona || {};
      aiResponse += `\n\n⚡ Time to Act Now:\n• Search ${industry.toLowerCase()} roles on [LinkedIn Jobs](https://linkedin.com/jobs/search/?keywords=${industry.toLowerCase()})\n• Develop skills on [Coursera](https://coursera.org/browse/${industry.toLowerCase()})\n• Connect with professionals on [LinkedIn](https://linkedin.com)`;
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
