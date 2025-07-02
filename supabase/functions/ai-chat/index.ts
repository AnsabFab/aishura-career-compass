
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, userContext, sessionId } = await req.json()
    
    // Enhanced contextual analysis
    const contextualAnalysis = analyzeUserIntent(message, userContext)
    
    // Generate more human-like contextual response with working links
    const response = generateHumanContextualResponse(message, userContext, contextualAnalysis)
    
    return new Response(
      JSON.stringify({ 
        response: response.text,
        actionLink: response.actionLink,
        actionText: response.actionText
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        response: "I'm here to support your career journey with genuine care. Let me help you navigate this challenge together - what specific aspect would you like to focus on? 💜"
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function analyzeUserIntent(message: string, userContext: any) {
  const lowerMessage = message.toLowerCase()
  
  // Enhanced intent detection with emotional context
  const intents = {
    interview: /interview|nervous|scared|anxious about interview|preparing for|fear|worried about meeting|job interview/i.test(message),
    jobSearch: /job|position|role|hiring|apply|application|looking for work|unemployed|jobless|career change/i.test(message),
    skillDevelopment: /skill|learn|course|training|certification|improve|develop|study|upskill/i.test(message),
    careerChange: /change|switch|transition|pivot|different field|new career|quit|career pivot/i.test(message),
    networking: /network|connect|people|mentor|relationship|linkedin|professional network/i.test(message),
    salary: /salary|pay|money|compensation|raise|negotiate|income|benefits/i.test(message),
    stress: /stress|overwhelm|pressure|burnout|difficult|hard|struggle|frustrated/i.test(message),
    confidence: /confidence|imposter|doubt|believe|capable|worthy|insecure|self-doubt/i.test(message)
  }
  
  // Determine primary intent
  const primaryIntent = Object.keys(intents).find(key => intents[key as keyof typeof intents]) || 'general'
  
  // Extract specific companies, roles, or skills mentioned
  const companies = extractCompanies(message)
  const roles = extractRoles(message, userContext.industry)
  const emotions = extractEmotions(message)
  
  return {
    primaryIntent,
    companies,
    roles,
    emotions,
    urgency: /urgent|asap|quickly|immediately|soon|help|desperate/i.test(message) ? 'high' : 'normal'
  }
}

function extractCompanies(message: string): string[] {
  const companies = ['Google', 'Meta', 'Microsoft', 'Amazon', 'Apple', 'Netflix', 'Tesla', 'OpenAI', 'Anthropic', 'Spotify', 'Uber', 'Airbnb', 'Stripe', 'Figma', 'Notion', 'Slack', 'Zoom', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'NVIDIA', 'Adobe', 'Shopify', 'Square', 'PayPal', 'Twitter', 'LinkedIn', 'TikTok', 'Snapchat']
  return companies.filter(company => message.toLowerCase().includes(company.toLowerCase()))
}

function extractRoles(message: string, industry: string): string[] {
  const rolesByIndustry = {
    'Software Development': ['developer', 'engineer', 'programmer', 'architect', 'devops', 'frontend', 'backend', 'fullstack'],
    'Data Science': ['data scientist', 'analyst', 'machine learning', 'ai engineer', 'data engineer', 'statistician'],
    'Design': ['designer', 'ux', 'ui', 'product designer', 'graphic designer', 'visual designer'],
    'Marketing': ['marketer', 'growth', 'content', 'social media', 'brand', 'digital marketing'],
    'Product Management': ['product manager', 'pm', 'product owner', 'strategy', 'roadmap'],
    'Sales': ['sales', 'account manager', 'business development', 'customer success']
  }
  
  const relevantRoles = rolesByIndustry[industry as keyof typeof rolesByIndustry] || []
  return relevantRoles.filter(role => message.toLowerCase().includes(role))
}

function extractEmotions(message: string): string[] {
  const emotions = {
    anxiety: /anxious|nervous|worried|scared|fear|panic|stress|overwhelmed/i,
    excitement: /excited|thrilled|eager|motivated|pumped|passionate/i,
    frustration: /frustrated|annoyed|stuck|blocked|tired|disappointed/i,
    confidence: /confident|ready|prepared|strong|capable|determined/i,
    uncertainty: /unsure|confused|lost|don't know|unclear|hesitant/i
  }
  
  return Object.keys(emotions).filter(emotion => emotions[emotion as keyof typeof emotions].test(message))
}

function generateHumanContextualResponse(message: string, userContext: any, analysis: any) {
  const { name, location, industry, persona } = userContext
  const { primaryIntent, companies, emotions, urgency } = analysis
  
  let response = ""
  let actionLink = ""
  let actionText = ""
  
  // More empathetic and human-like emotional responses
  const emotionalResponse = getHumanEmotionalResponse(emotions, name, urgency)
  
  switch (primaryIntent) {
    case 'interview':
      if (companies.length > 0) {
        const company = companies[0]
        response = `${emotionalResponse} 

Preparing for ${company}? That's incredible! 🌟 I can feel your determination, and honestly, that energy alone tells me you're going to do amazing things. Let me share something that might ease those interview butterflies...

**Here's the thing about ${company} interviews** - they invited you because they already see your potential. Now it's just about letting that authentic brilliance shine through.

🎯 **Your ${company} Success Strategy:**
• Research their latest projects and values (they love when candidates show genuine interest)
• Practice the STAR method for behavioral questions - but make it YOUR story
• Prepare 3-5 thoughtful questions that show you're thinking like someone who already works there
• Review ${company}'s engineering blog - it shows you're invested in their vision

💪 **Confidence Building Truth:**
Remember, interviews aren't tests - they're conversations between future colleagues. You've got this! 

What specific part of the ${company} interview process is making your heart race right now? Let's tackle it together! 🚀

⚡ **Time to Act Now:**
• Get insider interview insights and practice questions: https://www.glassdoor.com/Interview/${company}-Interview-Questions-E${getCompanyGlassdoorId(company)}.htm`

        actionLink = `https://www.glassdoor.com/Interview/${company}-Interview-Questions-E${getCompanyGlassdoorId(company)}.htm`
        actionText = `Master ${company} Interviews`
      } else {
        response = `${emotionalResponse}

Interview prep can feel overwhelming, but here's a secret - you're already more ready than you think! 💫 Every interview is just a conversation about your unique journey and how it aligns with their needs.

🎯 **Your Interview Confidence Blueprint:**
• Master the STAR method, but make each story authentically YOURS
• Research the company like you're already planning your first project there
• Practice with friends or record yourself - hearing your own confidence builds more confidence
• Prepare thoughtful questions that show you're thinking strategically about the role

💪 **Here's what I want you to remember:**
They called YOU. Out of hundreds of applications, they saw something special. That's not luck - that's your value being recognized.

What type of interview are you preparing for? Technical deep-dive or behavioral conversation? Let's create a game plan that feels right for YOU! ✨

⚡ **Time to Act Now:**
• Practice with real interview questions and build your confidence: https://www.glassdoor.com/Interview/interview-questions.htm`

        actionLink = `https://www.glassdoor.com/Interview/interview-questions.htm`
        actionText = "Build Interview Confidence"
      }
      break
      
    case 'jobSearch':
      response = `${emotionalResponse}

Job searching in ${industry}? I see you, and I feel that mix of excitement and uncertainty. Here's what I know about you already - you're taking action, you're being intentional about your career, and that puts you ahead of most people. 🌟

**Let's create a job search strategy that actually feels good:**

🎯 **Your ${industry} Success Plan in ${location}:**
• Focus on companies whose values align with YOUR values (this isn't just about getting ANY job)
• Optimize your LinkedIn like you're the ${industry} professional you're becoming
• Network authentically - reach out to 5 people weekly who inspire you in ${location}'s ${industry} scene
• Apply to roles where you meet 70% of requirements (perfect matches are rare, growth is expected!)

🚀 **Here's your weekly action rhythm:**
• Monday: Set up targeted job alerts for ${industry} roles
• Wednesday: Reach out to 2-3 professionals for genuine connections
• Friday: Tailor applications for roles that excite you
• Every other week: Follow up on applications (most people never do this!)

What type of ${industry} role would make you excited to wake up on Monday mornings? Let's get specific about your dreams! 💫

⚡ **Time to Act Now:**
• Discover ${industry} opportunities crafted for your journey: https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(industry)}&location=${encodeURIComponent(location)}`

      actionLink = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(industry)}&location=${encodeURIComponent(location)}`
      actionText = `Find Your ${industry} Future`
      break
      
    case 'skillDevelopment':
      response = `${emotionalResponse}

I love that you're thinking about skill development! 📚 That growth mindset? That's what separates the people who thrive from those who just survive. You're already showing the curiosity that leads to career breakthroughs.

**Here's how we're going to level up your ${industry} game:**

🎯 **Your Strategic Learning Path:**
• Identify the top 3 skills that would make you indispensable in ${industry}
• Choose project-based learning (you learn by DOING, not just watching)
• Join ${industry} communities where you can learn from others on the same journey
• Build a portfolio that tells your growth story

**The skills that matter most right now:**
• Technical skills that solve real ${industry} problems
• Communication skills that help you articulate your value
• Industry-specific tools that boost your productivity
• Leadership skills that prepare you for what's next

What specific skill would be your career game-changer in ${industry}? Let's make a plan that gets you there faster than you think possible! 🚀

⚡ **Time to Act Now:**
• Start building tomorrow's career skills today: https://www.coursera.org/browse/${industry.toLowerCase().replace(/\s+/g, '-')}`

      actionLink = `https://www.coursera.org/browse/${industry.toLowerCase().replace(/\s+/g, '-')}`
      actionText = `Master ${industry} Skills`
      break
      
    case 'stress':
      response = `${emotionalResponse}

First, take a deep breath with me. In... and out. 🌸 What you're feeling? It's not weakness - it's your body telling you that your career matters deeply to you. That care you feel? That's actually your superpower.

**Let's ease this weight together:**

🌟 **Right now, in this moment:**
• Take 5 conscious breaths (I'm breathing with you)
• Write down 3 things about your career journey you're genuinely proud of
• Remember one challenge you've already overcome - you did it once, you can do it again
• Set ONE small, achievable goal for today (just one)

💪 **Building your resilience muscle:**
• Create sacred boundaries between work stress and your personal peace
• Build a circle of support - colleagues, mentors, friends who get it
• Practice daily stress relief that actually works for YOU
• Focus on progress, not perfection (perfection is a career killer)

You know what I see when I look at your situation? Someone who cares deeply about doing meaningful work. That's rare and beautiful. 

What specific part of your career is weighing heaviest on your heart right now? Let's lighten that load together. 💜

⚡ **Time to Act Now:**
• Learn evidence-based stress management techniques: https://www.headspace.com/work-life-balance`

      actionLink = "https://www.headspace.com/work-life-balance"
      actionText = "Find Your Career Peace"
      break
      
    default:
      response = `${emotionalResponse}

I'm genuinely excited to be part of your ${industry} journey in ${location}! 🌟 Whether you're navigating career strategy, building confidence, developing skills, or dreaming about what's possible - I'm here to walk alongside you.

**Here's what lights me up about supporting you:**
• Creating career strategies that feel authentic to WHO you are
• Building interview confidence that comes from genuine self-worth
• Developing skills that open doors you didn't even know existed
• Optimizing job searches that lead to roles you actually love
• Building networks that become communities of mutual support
• Navigating salary conversations with confidence and clarity

Your ${industry} path is unique, and that's exactly what makes it powerful. 

What aspect of your career adventure should we dive into first? I'm here for all of it! ✨

⚡ **Time to Act Now:**
• Connect with inspiring ${industry} professionals: https://www.linkedin.com/in/search/results/people/?keywords=${encodeURIComponent(industry)}&origin=GLOBAL_SEARCH_HEADER`

      actionLink = `https://www.linkedin.com/in/search/results/people/?keywords=${encodeURIComponent(industry)}&origin=GLOBAL_SEARCH_HEADER`
      actionText = `Build Your ${industry} Network`
  }
  
  return {
    text: response,
    actionLink,
    actionText
  }
}

function getHumanEmotionalResponse(emotions: string[], name: string, urgency: string): string {
  const urgentPrefix = urgency === 'high' ? "I can feel the urgency in your message, and I want you to know - " : "";
  
  if (emotions.includes('anxiety')) {
    return `${urgentPrefix}Hello beautiful ${name}! 💜 I can sense those nervous butterflies in your stomach, and honestly? They tell me something incredible about you - this opportunity matters deeply to your heart. That anxiety you're feeling isn't a flaw, it's proof that you care about building something meaningful.`;
  } else if (emotions.includes('excitement')) {
    return `${urgentPrefix}Hello amazing ${name}! 🚀 Your excitement is literally radiating through the screen and it's contagious! That energy you're carrying? It's the exact fuel that transforms dreams into reality. I'm so here for this journey with you!`;
  } else if (emotions.includes('frustration')) {
    return `${urgentPrefix}Hello strong ${name}! 🌟 I can feel that frustration, and you know what? It makes complete sense. Sometimes the career path moves slower than our hearts want it to. But here's what I see - someone who refuses to settle, someone who keeps pushing forward even when it's hard.`;
  } else if (emotions.includes('uncertainty')) {
    return `${urgentPrefix}Hello thoughtful ${name}! ✨ That uncertainty you're feeling? It's not confusion - it's your inner wisdom taking time to process all the possibilities ahead of you. Uncertainty often lives right next door to breakthrough moments.`;
  } else {
    return `${urgentPrefix}Hello incredible ${name}! 🌟 I'm genuinely honored to be part of your career story. There's something special about this moment - you're here, you're taking action, you're investing in your future. That alone tells me you're destined for something beautiful.`;
  }
}

function getCompanyGlassdoorId(company: string): string {
  const companyIds: { [key: string]: string } = {
    'Google': '9079',
    'Meta': '40772',
    'Microsoft': '1651',
    'Amazon': '6036',
    'Apple': '1138',
    'Netflix': '11891',
    'Tesla': '43129',
    'OpenAI': '2800667',
    'Spotify': '408251',
    'Uber': '575263',
    'Airbnb': '391850'
  }
  return companyIds[company] || '1'
}
