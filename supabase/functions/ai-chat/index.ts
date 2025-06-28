
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
    
    // Generate contextual response with working links
    const response = generateContextualResponse(message, userContext, contextualAnalysis)
    
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
        response: "I'm here to support your career journey. Let me help you navigate this challenge together. What specific aspect would you like to focus on?"
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
  
  // Enhanced intent detection
  const intents = {
    interview: /interview|nervous|scared|anxious about interview|preparing for|fear|worried about meeting/i.test(message),
    jobSearch: /job|position|role|hiring|apply|application|looking for work|unemployed|jobless/i.test(message),
    skillDevelopment: /skill|learn|course|training|certification|improve|develop|study/i.test(message),
    careerChange: /change|switch|transition|pivot|different field|new career|quit/i.test(message),
    networking: /network|connect|people|mentor|relationship|linkedin|professional/i.test(message),
    salary: /salary|pay|money|compensation|raise|negotiate|income/i.test(message),
    stress: /stress|overwhelm|pressure|burnout|difficult|hard|struggle/i.test(message),
    confidence: /confidence|imposter|doubt|believe|capable|worthy|insecure/i.test(message)
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
    urgency: /urgent|asap|quickly|immediately|soon|help/i.test(message) ? 'high' : 'normal'
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
    anxiety: /anxious|nervous|worried|scared|fear|panic|stress/i,
    excitement: /excited|thrilled|eager|motivated|pumped/i,
    frustration: /frustrated|annoyed|stuck|blocked|tired/i,
    confidence: /confident|ready|prepared|strong|capable/i,
    uncertainty: /unsure|confused|lost|overwhelmed|don't know/i
  }
  
  return Object.keys(emotions).filter(emotion => emotions[emotion as keyof typeof emotions].test(message))
}

function generateContextualResponse(message: string, userContext: any, analysis: any) {
  const { name, location, industry, persona } = userContext
  const { primaryIntent, companies, emotions, urgency } = analysis
  
  let response = ""
  let actionLink = ""
  let actionText = ""
  
  // Personalized greeting based on emotional state
  const emotionalResponse = getEmotionalResponse(emotions, name)
  
  switch (primaryIntent) {
    case 'interview':
      if (companies.length > 0) {
        const company = companies[0]
        response = `${emotionalResponse} Preparing for ${company} is exciting! Here's how to approach your ${company} interview with confidence:

🎯 **${company}-Specific Preparation:**
• Research ${company}'s recent projects and values
• Practice behavioral questions using the STAR method
• Prepare technical questions relevant to ${company}'s tech stack
• Review ${company}'s engineering blog and recent news

💪 **Confidence Building:**
• Remember: They invited you because you're qualified
• Practice mock interviews with peers
• Prepare thoughtful questions about the role and team
• Review your past achievements and how they align with ${company}'s needs

What specific aspect of the ${company} interview process concerns you most?`

        actionLink = `https://www.glassdoor.com/Interview/${company}-Interview-Questions-E${getCompanyGlassdoorId(company)}.htm`
        actionText = `View ${company} Interview Questions`
      } else {
        response = `${emotionalResponse} Interview preparation is key to success! Let me help you build confidence:

🎯 **Interview Preparation Strategy:**
• Practice the STAR method for behavioral questions
• Research the company's mission and recent developments
• Prepare 3-5 thoughtful questions about the role
• Practice technical concepts relevant to ${industry}

💪 **Confidence Building:**
• Mock interviews with friends or mentors
• Record yourself answering common questions
• Prepare examples of your best work and achievements
• Remember: Interviews are conversations, not interrogations

What type of interview are you preparing for (technical, behavioral, or both)?`

        actionLink = `https://www.glassdoor.com/Interview/interview-questions.htm`
        actionText = "Practice Interview Questions"
      }
      break
      
    case 'jobSearch':
      response = `${emotionalResponse} Let's create a strategic job search plan for ${industry} in ${location}:

🎯 **Targeted Job Search Strategy:**
• Focus on companies that align with your values and career goals
• Optimize your LinkedIn profile with ${industry} keywords
• Network with professionals in ${location}'s ${industry} scene
• Apply to roles that match 70% of requirements (not 100%)

🚀 **Action Plan:**
• Set up job alerts for ${industry} roles in ${location}
• Reach out to 5 professionals weekly for informational interviews
• Tailor your resume for each application
• Follow up on applications after 1-2 weeks

What specific type of ${industry} role are you targeting?`

      actionLink = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(industry)}&location=${encodeURIComponent(location)}`
      actionText = `Find ${industry} Jobs in ${location}`
      break
      
    case 'skillDevelopment':
      response = `${emotionalResponse} Skill development is the best investment in your career! Here's your personalized learning path for ${industry}:

📚 **Learning Strategy:**
• Identify the top 3 skills most demanded in ${industry}
• Choose project-based learning over passive consumption
• Join ${industry} communities and forums
• Build a portfolio showcasing your new skills

🎯 **Recommended Focus Areas:**
• Technical skills specific to ${industry}
• Soft skills like communication and problem-solving
• Industry-specific tools and platforms
• Leadership and collaboration skills

What specific skill in ${industry} would make the biggest impact on your career?`

      actionLink = `https://www.coursera.org/browse/${industry.toLowerCase().replace(/\s+/g, '-')}`
      actionText = `Explore ${industry} Courses`
      break
      
    case 'stress':
      response = `${emotionalResponse} I can feel the weight you're carrying, and I want you to know that these feelings are completely valid. Career stress is real, but you're not alone in this journey.

🌟 **Immediate Relief Strategies:**
• Take 5 deep breaths right now
• Write down 3 things you're grateful for in your career
• Remember past challenges you've overcome successfully
• Set one small, achievable goal for today

💪 **Long-term Resilience:**
• Create boundaries between work and personal time
• Build a support network of colleagues and mentors
• Practice stress management techniques daily
• Focus on progress, not perfection

What specific aspect of your career is causing the most stress right now?`

      actionLink = "https://www.headspace.com/work-life-balance"
      actionText = "Learn Stress Management"
      break
      
    default:
      response = `${emotionalResponse} I'm here to support your ${industry} journey in ${location}. Whether you need guidance on career strategy, skill development, or navigating workplace challenges, I'm here to help.

🎯 **How I Can Help:**
• Career strategy and planning
• Interview preparation and confidence building
• Skill development recommendations
• Job search optimization
• Networking strategies
• Salary negotiation guidance

What aspect of your ${industry} career would you like to focus on today?`

      actionLink = `https://www.linkedin.com/in/search/results/people/?keywords=${encodeURIComponent(industry)}&origin=GLOBAL_SEARCH_HEADER`
      actionText = `Connect with ${industry} Professionals`
  }
  
  return {
    text: response,
    actionLink,
    actionText
  }
}

function getEmotionalResponse(emotions: string[], name: string): string {
  if (emotions.includes('anxiety')) {
    return `Hello ${name}! I can sense the nervous energy you're feeling, and I want you to know that those butterflies in your stomach are actually a sign that this opportunity matters to you.`
  } else if (emotions.includes('excitement')) {
    return `Hello ${name}! Your excitement is absolutely contagious and tells me you're ready to take on new challenges!`
  } else if (emotions.includes('frustration')) {
    return `Hello ${name}! I can feel your frustration, and I completely understand - sometimes the career path feels like it's moving slower than we'd like.`
  } else if (emotions.includes('uncertainty')) {
    return `Hello ${name}! Uncertainty can feel overwhelming, but it's also the space where growth happens.`
  } else {
    return `Hello ${name}! I'm here to support you on this career journey.`
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
