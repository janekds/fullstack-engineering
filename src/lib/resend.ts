import { Resend } from "resend";

let resend: Resend | null = null;

const getResendClient = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

export default getResendClient;

// Email templates
export const sendWelcomeEmail = async (to: string, name: string) => {
  try {
    const resendClient = getResendClient();
    const data = await resendClient.emails.send({
      from: "Durdle <contact@durdle.ai>",
      to: [to],
      subject: "🎉Welcome to Durdle!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8aff00; font-size: 28px; margin: 0;">Welcome to Durdle, ${name}!</h1>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">Thank you for joining Durdle. We're excited to connect you with your ideal research project!</p>
          </div>
          
          <h2 style="color: #1e293b; font-size: 20px;">What's Next?</h2>
          <ul style="font-size: 16px; line-height: 1.6;">
            <li>Complete your profile</li>
            <li>Upload your CV/Resume</li>
            <li>Take our AI voice interview - optional but recommended</li>
            <li>Get matched with a research project!</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/onboarding" 
               style="background-color: #8aff00; color: black; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Complete Your Profile
            </a>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; text-align: center;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>The Durdle Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
};

export const sendEmailConfirmation = async (
  to: string,
  firstName: string,
  confirmationToken: string
) => {
  const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm?token=${confirmationToken}&email=${encodeURIComponent(to)}`;

  try {
    const resendClient = getResendClient();
    const data = await resendClient.emails.send({
      from: "Durdle <contact@durdle.ai>",
      to: [to],
      subject: "🎉 Welcome to Durdle! Please confirm your email",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Durdle</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
              <div style="background-color: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <div style="font-size: 24px; font-weight: bold; color: #2563eb;">📧</div>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Durdle!</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">AI-Powered Recruitment Platform</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">
                Hi ${firstName}! 👋
              </h2>
              
              <p style="color: #475569; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                Thank you for joining Durdle! We're excited to match you with your first research project!
              </p>
              
              <div style="background-color: #f1f5f9; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #2563eb;">
                <p style="margin: 0; color: #334155; font-size: 16px; font-weight: 500;">
                  📍 One more step to get started
                </p>
                <p style="margin: 8px 0 0; color: #64748b; font-size: 14px;">
                  Please confirm your email address to activate your account and access all features.
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${confirmationUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); transition: transform 0.2s;">
                  ✅ Confirm Email Address
                </a>
              </div>
              
              <!-- What's Next -->
              <div style="margin: 32px 0;">
                <h3 style="color: #1e293b; margin: 0 0 16px; font-size: 18px; font-weight: 600;">What's next?</h3>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background-color: #dbeafe; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">📝</div>
                    <span style="color: #475569; font-size: 15px;">Complete your profile setup</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background-color: #dbeafe; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">📄</div>
                    <span style="color: #475569; font-size: 15px;">Upload your CV/Resume</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background-color: #dbeafe; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">🎤</div>
                    <span style="color: #475569; font-size: 15px;">Take your AI voice interview</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background-color: #dbeafe; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">🎯</div>
                    <span style="color: #475569; font-size: 15px;">Get matched with amazing opportunities</span>
                  </div>
                </div>
              </div>
              
              <!-- Backup Link -->
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 14px; font-weight: 500;">
                  Button not working?
                </p>
                <p style="margin: 0; color: #64748b; font-size: 13px; word-break: break-all;">
                  Copy and paste this link: <span style="color: #2563eb;">${confirmationUrl}</span>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px; color: #64748b; font-size: 14px;">
                <strong>Durdle</strong> - AI-Powered Recruitment Platform
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                If you didn't create an account with Durdle, you can safely ignore this email.
              </p>
            </div>
          </div>
          
          <!-- Spacer -->
          <div style="height: 40px;"></div>
        </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email confirmation:", error);
    return { success: false, error };
  }
};

export const sendInterviewInvitation = async (to: string, name: string) => {
  try {
    const resendClient = getResendClient();
    const data = await resendClient.emails.send({
      from: "Durdle <contact@durdle.ai>",
      to: [to],
      subject: "Your AI Interview is Ready!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Ready for Your AI Interview, ${name}?</h1>
          <p>Your profile looks great! It's time to complete your AI voice interview.</p>
          <p>The interview will take about 10-15 minutes and will help us match you with the perfect opportunities.</p>
          <div style="margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/interview" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Start Interview
            </a>
          </div>
          <p>Good luck!<br>The Durdle Team</p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending interview invitation:", error);
    return { success: false, error };
  }
};

export const sendSalesInquiryNotification = async (
  firstName: string,
  lastName: string,
  email: string,
  company: string,
  message: string
) => {
  try {
    const resendClient = getResendClient();
    const data = await resendClient.emails.send({
      from: "Durdle <contact@durdle.ai>",
      to: ["contact@durdle.ai"], // Sales team email
      subject: `🚀 New Sales Inquiry from ${company}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Sales Inquiry</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #5ec269 0%, #4ade80 100%); padding: 40px 20px; text-align: center;">
              <div style="background-color: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <div style="font-size: 24px;">🚀</div>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">New Sales Inquiry!</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Someone wants to hire talent through Durdle</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">
                Contact Details
              </h2>
              
              <!-- Contact Info -->
              <div style="background-color: #f1f5f9; padding: 24px; border-radius: 8px; margin: 24px 0;">
                <div style="margin-bottom: 12px;">
                  <strong style="color: #1e293b;">Name:</strong> ${firstName} ${lastName}
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #1e293b;">Email:</strong> 
                  <a href="mailto:${email}" style="color: #5ec269; text-decoration: none;">${email}</a>
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #1e293b;">Company:</strong> ${company}
                </div>
              </div>
              
              ${message ? `
              <!-- Message -->
              <div style="margin: 32px 0;">
                <h3 style="color: #1e293b; margin: 0 0 16px; font-size: 18px; font-weight: 600;">Message:</h3>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #5ec269;">
                  <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
                    ${message}
                  </p>
                </div>
              </div>
              ` : ''}
              
              <!-- Action Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="mailto:${email}?subject=Re: Hiring Inquiry from ${company}" 
                   style="display: inline-block; background: linear-gradient(135deg, #5ec269 0%, #4ade80 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  📧 Reply to ${firstName}
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                <strong>Durdle</strong> - New sales inquiry notification
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending sales inquiry notification:", error);
    return { success: false, error };
  }
};

export const sendJobApplicationConfirmation = async (
  to: string,
  name: string,
  jobTitle: string,
  company: string
) => {
  try {
    const resendClient = getResendClient();
    const data = await resendClient.emails.send({
      from: "Durdle <contact@durdle.ai>",
      to: [to],
      subject: `✅ Application Confirmed: ${jobTitle} at ${company}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Confirmed</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #5ec269 0%, #4ade80 100%); padding: 40px 20px; text-align: center;">
              <div style="background-color: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <div style="font-size: 24px;">✅</div>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Application Confirmed!</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Your journey begins now</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">
                Hi ${name}! 🎉
              </h2>
              
              <p style="color: #475569; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                Great news! We've successfully received your application for the following position:
              </p>
              
              <!-- Job Info -->
              <div style="background-color: #f1f5f9; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #5ec269;">
                <h3 style="margin: 0 0 8px; color: #1e293b; font-size: 18px; font-weight: 600;">
                  ${jobTitle}
                </h3>
                <p style="margin: 0; color: #64748b; font-size: 16px;">
                  at <strong style="color: #1e293b;">${company}</strong>
                </p>
              </div>
              
              <!-- What's Next -->
              <div style="margin: 32px 0;">
                <h3 style="color: #1e293b; margin: 0 0 16px; font-size: 18px; font-weight: 600;">What happens next?</h3>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background-color: #dcfce7; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">📋</div>
                    <span style="color: #475569; font-size: 15px;">Your application is being reviewed by our AI matching system</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background-color: #dcfce7; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">🤖</div>
                    <span style="color: #475569; font-size: 15px;">AI analysis will determine your compatibility score</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background-color: #dcfce7; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">📞</div>
                    <span style="color: #475569; font-size: 15px;">If you're a good match, ${company} will be notified</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background-color: #dcfce7; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">📧</div>
                    <span style="color: #475569; font-size: 15px;">We'll notify you of any updates via email</span>
                  </div>
                </div>
              </div>
              
              <!-- Dashboard CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #5ec269 0%, #4ade80 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(94, 194, 105, 0.3);">
                  📊 View Application Status
                </a>
              </div>
              
              <!-- Tips -->
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 14px; font-weight: 500;">
                  💡 Pro Tip
                </p>
                <p style="margin: 0; color: #64748b; font-size: 13px;">
                  Keep applying to more positions to increase your chances! Our AI gets better at matching you with each application.
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px; color: #64748b; font-size: 14px;">
                <strong>Durdle</strong> - AI-Powered Recruitment Platform
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                We'll keep you updated on your application progress.
              </p>
            </div>
          </div>
          
          <!-- Spacer -->
          <div style="height: 40px;"></div>
        </body>
        </html>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending job application confirmation:", error);
    return { success: false, error };
  }
};
