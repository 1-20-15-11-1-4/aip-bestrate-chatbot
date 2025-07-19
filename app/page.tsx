import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to AIP Best Rate! I\'m Clint\'s AI assistant. I can help with insurance quotes, policy questions, claims processing, and I can automatically fill out forms to save time. What can I help you with today?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userMode, setUserMode] = useState('customer');
  const [generatedForms, setGeneratedForms] = useState([]);
  const messagesEndRef = useRef(null);

  // Client Configuration
  const clientConfig = {
    companyName: 'AIP Best Rate',
    ownerName: 'Clint Johnson',
    industry: 'Insurance Brokerage',
    location: 'Shreveport, Louisiana',
    phone: '(318) 555-0123',
    email: 'clint@aipbestrate.com',
    services: [
      '🚗 Auto Insurance',
      '🏠 Homeowners Insurance', 
      '🏢 Commercial Insurance',
      '👥 Life Insurance',
      '☂️ Umbrella Policies',
      '📋 SR-22 Filing'
    ],
    businessHours: 'Monday-Friday 8:00 AM - 6:00 PM'
  };

  const quickActions = [
    { text: 'Get an auto insurance quote', icon: '🚗' },
    { text: 'Fill out new client application form', icon: '📋' },
    { text: 'Process an insurance claim', icon: '🛡️' },
    { text: 'Renew existing policy', icon: '🔄' },
    { text: 'Compare insurance rates', icon: '📊' },
    { text: 'Schedule appointment with Clint', icon: '📅' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [
            { 
              role: "user", 
              content: `You are an AI assistant for ${clientConfig.companyName}, an insurance brokerage owned by ${clientConfig.ownerName} in ${clientConfig.location}.

BUSINESS INFORMATION:
- Company: ${clientConfig.companyName}
- Owner: ${clientConfig.ownerName}
- Industry: ${clientConfig.industry}
- Location: ${clientConfig.location}
- Phone: ${clientConfig.phone}
- Email: ${clientConfig.email}
- Business Hours: ${clientConfig.businessHours}

SERVICES OFFERED:
${clientConfig.services.join('\n')}

USER MODE: ${userMode === 'customer' ? 'CUSTOMER SERVICE' : 'INTERNAL BUSINESS ASSISTANT'}

${userMode === 'customer' ? 
  `CUSTOMER SERVICE MODE:
  - Help customers with insurance quotes and information
  - Answer policy questions and explain coverage options
  - Assist with claims processes and requirements
  - Schedule appointments with ${clientConfig.ownerName}
  - Provide general insurance education
  - Always be professional, helpful, and knowledgeable
  - Offer to connect customers with ${clientConfig.ownerName} for complex needs
  - Emphasize ${clientConfig.companyName}'s commitment to finding the best rates` 
  : 
  `INTERNAL BUSINESS ASSISTANT MODE for ${clientConfig.ownerName}:
  - Automatically fill out insurance forms and applications
  - Process new client paperwork
  - Generate quotes and proposals
  - Manage claims documentation
  - Handle policy renewals and changes
  - Organize daily administrative tasks
  - Save time on repetitive paperwork
  - Focus on efficiency and accuracy
  
  When filling out forms:
  1. Ask for required information if not provided
  2. Use professional insurance terminology
  3. Ensure all fields are completed accurately
  4. Generate structured form data that can be copied to actual forms
  5. Keep records for ${clientConfig.ownerName}'s files`
}

IMPORTANT: Always maintain professional standards appropriate for the insurance industry. Be helpful, accurate, and trustworthy in all interactions.` 
            },
            ...messages.slice(1).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: "user", content: inputMessage }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-generate forms when requested
      if (userMode === 'internal' && (inputMessage.toLowerCase().includes('fill out') || inputMessage.toLowerCase().includes('application') || inputMessage.toLowerCase().includes('form'))) {
        const newForm = {
          id: Date.now(),
          name: `${inputMessage.includes('auto') ? 'Auto Insurance' : inputMessage.includes('home') ? 'Homeowners' : 'Insurance'} Form - ${new Date().toLocaleDateString()}`,
          type: inputMessage.includes('auto') ? 'auto' : inputMessage.includes('home') ? 'home' : 'general',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          content: assistantMessage.content
        };
        setGeneratedForms(prev => [...prev, newForm]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize, but I encountered a technical issue. Please try again or contact ${clientConfig.ownerName} directly at ${clientConfig.phone} for immediate assistance.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    setInputMessage(action.text);
  };

  const downloadForm = (form) => {
    const element = document.createElement('a');
    const content = `${clientConfig.companyName} - ${form.name}
Generated: ${form.date} at ${form.time}
Owner: ${clientConfig.ownerName}

${form.content}

---
This form was automatically generated by ${clientConfig.companyName}'s AI Assistant.
For questions, contact ${clientConfig.phone} or ${clientConfig.email}`;
    
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${form.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f3e8ff 100%)' }}>
      {/* Header */}
      <div style={{ 
        background: 'white', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        borderBottom: '4px solid #2563eb',
        padding: '24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #3730a3 100%)', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(37,99,235,0.3)',
              fontSize: '32px'
            }}>
              🛡️
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: '0' }}>{clientConfig.companyName}</h1>
              <p style={{ fontSize: '18px', color: '#2563eb', fontWeight: '600', margin: '4px 0 0 0' }}>{clientConfig.industry} • {clientConfig.location}</p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>Licensed Insurance Broker • Established 2018</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151' }}>
                <span style={{ fontSize: '18px' }}>📞</span>
                <span style={{ fontWeight: '600' }}>{clientConfig.phone}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>Call for immediate assistance</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Mode:</label>
              <select
                value={userMode}
                onChange={(e) => setUserMode(e.target.value)}
                style={{ 
                  border: '2px solid #d1d5db', 
                  borderRadius: '8px', 
                  padding: '8px 12px', 
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="customer">Customer Service</option>
                <option value="internal">Internal (Clint)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Actions */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
            border: '1px solid #e5e7eb', 
            padding: '24px' 
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>⭐</span>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  style={{ 
                    width: '100%', 
                    textAlign: 'left', 
                    padding: '16px', 
                    borderRadius: '12px', 
                    border: '2px solid #e5e7eb', 
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = '#60a5fa';
                    e.target.style.background = '#eff6ff';
                    e.target.style.color = '#1d4ed8';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = 'white';
                    e.target.style.color = '#374151';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{action.icon}</span>
                    <span>{action.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
            border: '1px solid #e5e7eb', 
            padding: '24px' 
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0' }}>Contact {clientConfig.ownerName}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <span style={{ fontSize: '18px' }}>📍</span>
                <div>
                  <p style={{ fontWeight: '500', color: '#111827', margin: '0' }}>{clientConfig.location}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Licensed in Louisiana</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <span style={{ fontSize: '18px' }}>📞</span>
                <div>
                  <p style={{ fontWeight: '500', color: '#111827', margin: '0' }}>{clientConfig.phone}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Direct line to {clientConfig.ownerName}</p>
                </div>
              </div>
            </div>
            
            <button style={{ 
              width: '100%', 
              marginTop: '24px', 
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #3730a3 100%)', 
              color: 'white', 
              padding: '12px 16px', 
              borderRadius: '12px', 
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span>📅</span>
              Schedule with {clientConfig.ownerName}
            </button>
          </div>

          {/* Services */}
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
            border: '1px solid #e5e7eb', 
            padding: '24px' 
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>Insurance Services</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {clientConfig.services.map((service, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <span style={{ color: '#10b981', fontSize: '16px' }}>✅</span>
                  <span style={{ color: '#374151', fontWeight: '500' }}>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb', 
          overflow: 'hidden' 
        }}>
          {/* Chat Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #3730a3 100%)', 
            color: 'white', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
                  {userMode === 'customer' ? `${clientConfig.ownerName}'s AI Assistant` : 'Business Operations Assistant'}
                </h2>
                <p style={{ color: '#bfdbfe', fontSize: '14px', margin: '4px 0 0 0' }}>
                  {userMode === 'customer' 
                    ? 'Get instant insurance help, quotes, and professional guidance' 
                    : 'Automate forms, manage clients, and streamline daily operations'}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>AI Assistant Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ 
            height: '500px', 
            overflowY: 'auto', 
            padding: '24px', 
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' 
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  maxWidth: '600px',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '20px',
                    background: message.role === 'user' 
                      ? 'linear-gradient(135deg, #2563eb 0%, #3730a3 100%)' 
                      : 'white',
                    color: message.role === 'user' ? 'white' : '#2563eb',
                    border: message.role === 'assistant' ? '2px solid #bfdbfe' : 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    {message.role === 'user' ? '👤' : '🤖'}
                  </div>
                  
                  <div style={{ 
                    borderRadius: '16px', 
                    padding: '16px 20px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    background: message.role === 'user' 
                      ? 'linear-gradient(135deg, #2563eb 0%, #3730a3 100%)' 
                      : 'white',
                    color: message.role === 'user' ? 'white' : '#111827',
                    border: message.role === 'assistant' ? '1px solid #e5e7eb' : 'none'
                  }}>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px', margin: '0' }}>{message.content}</p>
                    <p style={{ 
                      fontSize: '12px', 
                      margin: '12px 0 0 0',
                      color: message.role === 'user' ? '#bfdbfe' : '#9ca3af'
                    }}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '16px', maxWidth: '600px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: 'white',
                    color: '#2563eb',
                    border: '2px solid #bfdbfe',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    🤖
                  </div>
                  <div style={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '16px', 
                    padding: '16px 20px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '50%' }}></div>
                      <div style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '50%' }}></div>
                      <div style={{ width: '8px', height: '8px', background: '#2563eb', borderRadius: '50%' }}></div>
                      <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280' }}>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ background: 'white', borderTop: '2px solid #e5e7eb', padding: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              <div style={{ flex: '1' }}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={userMode === 'customer' ? 
                    'Ask about insurance quotes, policies, claims, or schedule an appointment with Clint...' : 
                    'Ask me to fill out forms, process applications, manage clients, or help with business tasks...'
                  }
                  style={{ 
                    width: '100%', 
                    border: '2px solid #d1d5db', 
                    borderRadius: '12px', 
                    padding: '16px 20px', 
                    resize: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                  rows={2}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{ 
                  background: 'linear-gradient(135deg, #2563eb 0%, #3730a3 100%)', 
                  color: 'white', 
                  padding: '16px 32px', 
                  borderRadius: '12px', 
                  border: 'none',
                  cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  opacity: inputMessage.trim() && !isLoading ? 1 : 0.5,
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                <span>📤</span>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Forms Section (Internal Mode) */}
      {userMode === 'internal' && generatedForms.length > 0 && (
        <div style={{ 
          maxWidth: '1200px', 
          margin: '24px auto 0 auto', 
          padding: '0 24px' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
            border: '1px solid #e5e7eb', 
            padding: '24px' 
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>📄</span>
              Generated Forms & Documents
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {generatedForms.map(form => (
                <div key={form.id} style={{ 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px', 
                  padding: '16px',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.background = '#f0fdf4';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = 'white';
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: '1' }}>
                      <p style={{ fontWeight: '600', color: '#111827', fontSize: '14px', margin: '0 0 8px 0' }}>{form.name}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Generated: {form.date}</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>Time: {form.time}</p>
                    </div>
                    <button 
                      onClick={() => downloadForm(form)}
                      style={{ 
                        color: '#10b981', 
                        padding: '8px', 
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                      title="Download Form"
                      onMouseOver={(e) => e.target.style.background = '#f0fdf4'}
                      onMouseOut={(e) => e.target.style.background = 'transparent'}
                    >
                      📥
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
