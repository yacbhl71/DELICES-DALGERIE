import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional
import logging
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 465
        self.email_address = os.getenv("GMAIL_USER")
        self.email_password = os.getenv("GMAIL_APP_PASSWORD")
        
    def send_email(self, to_email: str, subject: str, body: str, body_html: Optional[str] = None) -> bool:
        """
        Send an email using Gmail SMTP
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            body: Plain text body
            body_html: Optional HTML body
            
        Returns:
            bool: True if email sent successfully, False otherwise
        """
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.email_address
            msg['To'] = to_email
            
            # Add plain text version
            text_part = MIMEText(body, 'plain')
            msg.attach(text_part)
            
            # Add HTML version if provided
            if body_html:
                html_part = MIMEText(body_html, 'html')
                msg.attach(html_part)
            
            # Connect to Gmail SMTP server and send email
            with smtplib.SMTP_SSL(self.smtp_server, self.smtp_port) as smtp:
                smtp.login(self.email_address, self.email_password)
                smtp.sendmail(self.email_address, to_email, msg.as_string())
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def send_contact_notification(self, contact_data: dict) -> bool:
        """
        Send notification email when a contact form is submitted
        
        Args:
            contact_data: Dictionary with contact information (name, email, subject, message)
            
        Returns:
            bool: True if email sent successfully
        """
        subject = f"Nouvelle demande de contact: {contact_data['subject']}"
        
        # Plain text version
        body = f"""
Nouvelle demande de contact reçue:

Nom: {contact_data['name']}
Email: {contact_data['email']}
Sujet: {contact_data['subject']}

Message:
{contact_data['message']}

---
Ce message a été envoyé depuis le formulaire de contact de Délices et Trésors d'Algérie.
        """
        
        # HTML version
        body_html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #6B8E23; border-bottom: 2px solid #6B8E23; padding-bottom: 10px;">Nouvelle demande de contact</h2>
                    
                    <div style="margin: 20px 0;">
                        <p><strong>Nom:</strong> {contact_data['name']}</p>
                        <p><strong>Email:</strong> <a href="mailto:{contact_data['email']}">{contact_data['email']}</a></p>
                        <p><strong>Sujet:</strong> {contact_data['subject']}</p>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #6B8E23; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Message:</h3>
                        <p style="white-space: pre-wrap;">{contact_data['message']}</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        Ce message a été envoyé depuis le formulaire de contact de Délices et Trésors d'Algérie.
                    </p>
                </div>
            </body>
        </html>
        """
        
        # Send to the admin email (same as the sender in this case)
        return self.send_email(self.email_address, subject, body, body_html)

# Create a singleton instance
email_service = EmailService()
