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
    // Parse the form data (HTML forms send URL-encoded data, not JSON)
    const params = new URLSearchParams(event.body);

    // Extract form fields
    const name = params.get('name');
    const email = params.get('email');
    const uses_claude_code = params.get('uses_claude_code');
    const consent_emails = params.get('consent_emails');

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
        <div style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.2); padding: 20px; margin: 24px 0; border-radius: 12px;">
          <p style="margin: 0; color: #22c55e; font-weight: 600; font-size: 16px;">Claude Code User Detected!</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">You're going to love what we've built for power users like you. NeoCortex AI will supercharge your existing Claude Code workflow with persistent memory and web accessibility.</p>
        </div>
      `
      : `
        <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); padding: 20px; margin: 24px 0; border-radius: 12px;">
          <p style="margin: 0; color: #3b82f6; font-weight: 600; font-size: 16px;">New to Claude Code?</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">Perfect timing! NeoCortex AI makes Claude Code accessible to everyone with a beautiful web interface. We'll help you get started with the most powerful AI development tool available.</p>
        </div>
      `;

    // Welcome email template
    const welcomeEmailHtml = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: white; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 16px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(6, 182, 212, 0.3);">
            <div style="width: 32px; height: 32px; background: white; border-radius: 8px; position: relative;">
              <div style="position: absolute; top: 6px; left: 6px; width: 20px; height: 20px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 4px;"></div>
            </div>
          </div>
          <h1 style="background: linear-gradient(135deg, #06b6d4, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; margin: 0; font-weight: bold; letter-spacing: -0.5px;">NeoCortex AI</h1>
          <p style="color: #64748b; font-size: 16px; margin: 8px 0 0; font-weight: 500;">Transform Claude Code Into Your AI Command Center</p>
        </div>

        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; border-radius: 16px; padding: 32px; margin-bottom: 32px;">
          <h2 style="color: #06b6d4; font-size: 28px; margin-bottom: 20px; font-weight: 700; line-height: 1.2;">${greeting} Welcome to Early Access!</h2>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining the <strong>NeoCortex AI early access waitlist</strong>! You're now part of an exclusive group that will transform Claude Code into the ultimate AI command center.
          </p>

          ${claudeCodeMessage}

          <div style="background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.2); padding: 24px; margin: 24px 0; border-radius: 12px;">
            <h3 style="color: #06b6d4; font-size: 20px; margin-bottom: 20px; font-weight: 600;">What You Can Expect:</h3>
            <div style="display: grid; gap: 16px;">
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="width: 6px; height: 6px; background: #06b6d4; border-radius: 50%; margin-top: 8px; flex-shrink: 0;"></div>
                <div>
                  <strong style="color: #e2e8f0; font-weight: 600;">Persistent Memory</strong>
                  <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px; line-height: 1.5;">AI that remembers your context across sessions</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="width: 6px; height: 6px; background: #06b6d4; border-radius: 50%; margin-top: 8px; flex-shrink: 0;"></div>
                <div>
                  <strong style="color: #e2e8f0; font-weight: 600;">Web Interface</strong>
                  <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px; line-height: 1.5;">Claude Code without terminal intimidation</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="width: 6px; height: 6px; background: #06b6d4; border-radius: 50%; margin-top: 8px; flex-shrink: 0;"></div>
                <div>
                  <strong style="color: #e2e8f0; font-weight: 600;">ANCIS Intelligence</strong>
                  <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px; line-height: 1.5;">Sub-10ms codebase understanding and navigation</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <div style="width: 6px; height: 6px; background: #06b6d4; border-radius: 50%; margin-top: 8px; flex-shrink: 0;"></div>
                <div>
                  <strong style="color: #e2e8f0; font-weight: 600;">Early Access</strong>
                  <p style="color: #94a3b8; margin: 4px 0 0; font-size: 14px; line-height: 1.5;">Be among the first to experience the transformation</p>
                </div>
              </div>
            </div>
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
      from: 'NeoCortex AI <noreply@mail.neocortexai.dev>',
      to: email,
      subject: '🧠 Welcome to NeoCortex AI Early Access!',
      html: welcomeEmailHtml
    });

    // Send admin notification
    const adminNotification = await resend.emails.send({
      from: 'NeoCortex AI Waitlist <noreply@mail.neocortexai.dev>',
      to: process.env.ADMIN_EMAIL || 'chris@neocortexai.dev',
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

    // Wait 1 second to avoid rate limiting (Resend allows 2 requests per second)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add contact to Resend audience
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    console.log('Environment variables check:', {
      hasApiKey: !!process.env.RESEND_API_KEY,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasAudienceId: !!audienceId,
      audienceId: audienceId
    });

    if (audienceId) {
      try {
        const contact = await resend.contacts.create({
          email: email,
          firstName: name.split(' ')[0], // First part of name
          lastName: name.split(' ').slice(1).join(' ') || '', // Rest of name
          unsubscribed: false,
          audienceId: audienceId,
        });
        console.log('Contact added to audience:', contact);
      } catch (contactError) {
        console.error('Failed to add contact to audience:', contactError);
        // Don't fail the whole request if contact creation fails
      }
    } else {
      console.log('No audience ID configured - contact not added to audience');
    }

    return {
      statusCode: 302,
      headers: {
        Location: '/success'
      },
      body: ''
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