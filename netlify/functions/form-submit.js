// Netlify Function to handle form submissions and send emails via Resend
// This function will be called when the Netlify form is submitted

const { Resend } = require('resend');

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data
    const formData = JSON.parse(event.body);

    // Extract form fields
    const { name, email, uses_claude_code, consent_emails } = formData;

    // Validate required fields
    if (!name || !email || !uses_claude_code || !consent_emails) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Validate email consent
    if (consent_emails !== 'true') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email consent is required' })
      };
    }

    // Determine if user is Claude Code user
    const isClaudeCodeUser = uses_claude_code === 'yes';

    // Personalized greeting
    const greeting = name ? `Hi ${name}!` : 'Hello!';

    // Claude Code specific message
    const claudeCodeMessage = isClaudeCodeUser
      ? `
        <div style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0; color: #22c55e; font-weight: bold;">🎯 Claude Code User Detected!</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">You're going to love what we've built for power users like you. NeoCortex AI will supercharge your existing Claude Code workflow with persistent memory and web accessibility.</p>
        </div>
      `
      : `
        <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 8px;">
          <p style="margin: 0; color: #3b82f6; font-weight: bold;">🚀 New to Claude Code?</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Perfect timing! NeoCortex AI makes Claude Code accessible to everyone with a beautiful web interface. We'll help you get started with the most powerful AI development tool available.</p>
        </div>
      `;

    // Welcome email template
    const welcomeEmailHtml = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: white; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 30px;">🧠</span>
          </div>
          <h1 style="background: linear-gradient(135deg, #06b6d4, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin: 0; font-weight: bold;">NeoCortex AI</h1>
        </div>

        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; border-radius: 16px; padding: 30px; margin-bottom: 30px;">
          <h2 style="color: #06b6d4; font-size: 24px; margin-bottom: 20px;">🚀 ${greeting} Welcome to the Future of AI Development!</h2>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining the <strong>NeoCortex AI early access waitlist</strong>! You're now part of an exclusive group that will transform Claude Code into the ultimate AI command center.
          </p>

          ${claudeCodeMessage}

          <div style="background: rgba(6, 182, 212, 0.1); border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #06b6d4; font-size: 18px; margin-bottom: 15px;">What You Can Expect:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">🧠 <strong>Persistent Memory:</strong> AI that remembers across sessions</li>
              <li style="margin-bottom: 8px;">🖥️ <strong>Web GUI:</strong> Claude Code without terminal intimidation</li>
              <li style="margin-bottom: 8px;">⚡ <strong>ANCIS Intelligence:</strong> Sub-10ms codebase understanding</li>
              <li style="margin-bottom: 8px;">🎯 <strong>First Access:</strong> Be among the first to experience the magic</li>
            </ul>
          </div>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We're putting the finishing touches on NeoCortex AI and will notify you the <em>moment</em> early access opens.
            No spam, just the good stuff.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://github.com/anthropics/claude-code" style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
              Get Claude Code Ready →
            </a>
          </div>
        </div>

        <div style="text-align: center; color: #64748b; font-size: 14px;">
          <p>Questions? Reply to this email - we read every message.</p>
          <p style="margin-top: 20px;">
            <a href="https://neocortexai.dev/privacy" style="color: #06b6d4; text-decoration: none;">Privacy Policy</a> |
            <a href="https://neocortexai.dev/unsubscribe?email=${email}" style="color: #06b6d4; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `;

    // Send welcome email via Resend
    const welcomeEmail = await resend.emails.send({
      from: 'NeoCortex AI <noreply@neocortexai.dev>',
      to: email,
      subject: '🧠 Welcome to NeoCortex AI Early Access!',
      html: welcomeEmailHtml
    });

    // Send admin notification
    const adminNotification = await resend.emails.send({
      from: 'NeoCortex AI Waitlist <noreply@neocortexai.dev>',
      to: 'chris@neocortexai.dev',
      subject: `🎯 New Waitlist Signup: ${email}`,
      html: `
        <div style="font-family: 'Monaco', 'Menlo', monospace; max-width: 600px; margin: 0 auto; padding: 20px; background: #1e293b; color: #e2e8f0;">
          <h2 style="color: #06b6d4; margin-bottom: 20px;">🎯 New NeoCortex AI Waitlist Signup</h2>

          <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid #334155; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #334155; font-weight: bold; color: #06b6d4;">Name:</td><td style="padding: 8px 0; border-bottom: 1px solid #334155;">${name}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #334155; font-weight: bold; color: #06b6d4;">Email:</td><td style="padding: 8px 0; border-bottom: 1px solid #334155;">${email}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #334155; font-weight: bold; color: #06b6d4;">Claude Code User:</td><td style="padding: 8px 0; border-bottom: 1px solid #334155;">${isClaudeCodeUser ? 'Yes' : 'No'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #06b6d4;">Timestamp:</td><td style="padding: 8px 0;">${new Date().toISOString()}</td></tr>
            </table>
          </div>
        </div>
      `
    });

    console.log('Welcome email sent:', welcomeEmail);
    console.log('Admin notification sent:', adminNotification);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Form submitted successfully',
        welcomeEmailId: welcomeEmail.id,
        adminEmailId: adminNotification.id
      })
    };

  } catch (error) {
    console.error('Form submission error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process form submission',
        details: error.message
      })
    };
  }
};