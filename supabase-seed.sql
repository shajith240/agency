-- Insert initial categories for AI automation templates
INSERT INTO categories (name, description, slug, icon) VALUES
('Chatbots', 'AI-powered chatbot templates for customer service, lead generation, and support', 'chatbots', 'MessageCircle'),
('Workflow Automation', 'Complete workflow automation templates for business processes', 'workflow-automation', 'Workflow'),
('Content Generation', 'AI templates for generating blogs, social media content, and marketing copy', 'content-generation', 'FileText'),
('Data Processing', 'Templates for data analysis, reporting, and automated data workflows', 'data-processing', 'Database'),
('Email Marketing', 'Automated email sequences, newsletters, and marketing campaigns', 'email-marketing', 'Mail'),
('Social Media', 'Social media automation, posting schedules, and engagement templates', 'social-media', 'Share2'),
('Lead Generation', 'Lead capture, qualification, and nurturing automation templates', 'lead-generation', 'Target'),
('E-commerce', 'Product management, inventory, and customer service automations', 'ecommerce', 'ShoppingCart'),
('CRM Integration', 'Customer relationship management and sales automation templates', 'crm-integration', 'Users'),
('Analytics & Reporting', 'Automated reporting, dashboard creation, and analytics templates', 'analytics-reporting', 'BarChart3'),
('API Integrations', 'Templates for connecting different services and platforms', 'api-integrations', 'Plug'),
('Productivity Tools', 'Personal and team productivity automation templates', 'productivity-tools', 'Zap');

-- You can add sample templates here once you have your automation library ready
-- Example template structure:
/*
INSERT INTO templates (
  title,
  description,
  category_id,
  price,
  is_free,
  file_url,
  documentation,
  seller_id,
  tags
) VALUES (
  'Customer Support Chatbot',
  'A comprehensive chatbot template for handling customer inquiries, FAQs, and support tickets automatically.',
  (SELECT id FROM categories WHERE slug = 'chatbots'),
  29.99,
  FALSE,
  'templates/customer-support-chatbot.json',
  'Complete setup guide with step-by-step instructions...',
  'your-seller-id-here',
  ARRAY['customer-service', 'support', 'automation', 'n8n']
);
*/
