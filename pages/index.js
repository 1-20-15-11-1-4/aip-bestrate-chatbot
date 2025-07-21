import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to AIP Best Rate! I\'m Clint\'s AI assistant. I can help with insurance quotes, policy questions, and form automation. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userMode, setUserMode] = useState('customer');
  const messagesEndRef = useRef(null);

  const clientConfig = {
    companyName: 'AIP Best Rate',
    ownerName: 'Clint Johnson',
    location: 'Shreveport, Louisiana',
    phone: '(318) 555-0123',
    email: 'clint@aipbestrate.com'
  };

  const quickActions = [
    'Get an auto insurance quote',
    'Fill out new client application',
    'Process an insurance claim',
    'Schedule appointment with Clint'
  ];

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

    // Simple demo response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help with that! As Clint's AI assistant, I can help process insurance applications and provide quotes.",
        "Great question! I can help fill out forms and handle insurance paperwork to save Clint time.",
        "I can definitely assist with that. Let me help you with your insurance needs."
      ];
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      }]);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9ff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0', fontSize: '24px', color: '#1f2937' }}>{clientConfig.companyName}</h1>
            <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>Insurance Brokerage • {clientConfig.location}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#374151' }}>Mode:</span>
            <select 
              value={userMode} 
              onChange={(e) => setUserMode(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #d1d5db' }}
            >
              <option value="customer">Customer Service</option>
              <option value="internal">Internal (Clint)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '20px' }}>
        {/* Sidebar */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Quick Actions</h3>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(action)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                margin: '5px 0', 
                background: '#f3f4f6', 
                border: '1px solid #d1d5db', 
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {action}
            </button>
          ))}
          
          <div style={{ marginTop: '20px', padding: '15px', background: '#f9fafb', borderRadius: '5px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Contact Info</h4>
            <p style={{ margin: '5px 0', fontSize: '12px' }}>📞 {clientConfig.phone}</p>
            <p style={{ margin: '5px 0', fontSize: '12px' }}>✉️ {clientConfig.email}</p>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ background: '#2563eb', color: 'white', padding: '15px' }}>
            <h2 style={{ margin: '0', fontSize: '18px' }}>
              {userMode === 'customer' ? 'Customer Support' : 'Business Assistant'}
            </h2>
          </div>

          <div style={{ height: '400px', overflowY: 'auto', padding: '20px' }}>
            {messages.map((message, index) => (
              <div key={index} style={{ 
                marginBottom: '15px', 
                display: 'flex', 
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '10px 15px',
                  borderRadius: '10px',
                  background: message.role === 'user' ? '#2563eb' : '#f3f4f6',
                  color: message.role === 'user' ? 'white' : '#1f2937'
                }}>
                  <p style={{ margin: '0', fontSize: '14px' }}>{message.content}</p>
                  <small style={{ opacity: 0.7, fontSize: '11px' }}>
                    {message.timestamp.toLocaleTimeString()}
                  </small>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
                <div style={{ background: '#f3f4f6', padding: '10px 15px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '14px' }}>AI is typing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '15px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                style={{ 
                  padding: '10px 20px', 
                  background: '#2563eb', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
