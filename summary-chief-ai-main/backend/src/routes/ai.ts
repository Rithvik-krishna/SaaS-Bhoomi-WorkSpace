import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();

// Helper function to get OpenAI client
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
};

// Middleware to check if OpenAI is configured
const checkOpenAIConfig = (req: Request, res: Response, next: Function) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'OpenAI API is not configured'
    });
  }
  next();
};

// POST /api/ai/chat - Send a message to AI and get response
router.post('/chat', checkOpenAIConfig, async (req: Request, res: Response) => {
  try {
    const { message, context = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    const openai = getOpenAIClient();

    // Build conversation context
    const messages = [
      {
        role: 'system' as const,
        content: `You are WorkSpaceAI, an intelligent productivity assistant. You help users with:

• Email management and drafting
• Document analysis and insights
• Meeting scheduling and reminders
• Task management and productivity tips
• General questions and support

Keep responses helpful, professional, and focused on productivity. Be concise but thorough.`
      },
      ...context.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process AI request'
    });
  }
});

// GET /api/ai/health - Check if AI service is available
router.get('/health', (req: Request, res: Response) => {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  
  res.json({
    success: true,
    ai_configured: hasOpenAI,
    timestamp: new Date().toISOString()
  });
});

export default router;
