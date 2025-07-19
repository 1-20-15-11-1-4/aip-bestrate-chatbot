import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Upload, User, Bot, Building, FileText, Trash2, FileCheck, 
  Download, Plus, Settings, MessageSquare, FormInput, Shield, 
  Clock, CheckCircle, Star, Phone, Mail, MapPin, Calendar
} from 'lucide-react';

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
  const [activeSection, setActiveSection] = useState('chat');
  const [userMode, setUserMode] = useState('customer');
  const [trainingFiles, setTrainingFiles] = useState([]);
  const [formTemplates, setFormTemplates] = useState([
    { id: 1, name: 'Auto Insurance Application', uploaded: true },
    { id: 2, name: 'Homeowners Quote Form', uploaded: true },
    { id: 3, name: 'Commercial Insurance Application', uploaded: true },
    { id: 4, name: 'Claims Processing Form', uploaded: true },
    { id: 5, name: 'Policy Renewal Form', uploaded: true }
  ]);
  const [generatedForms, setGeneratedForms] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Client Configuration - CLINT'S SPECIFIC SETTINGS
  const clientConfig = {
    companyName: 'AIP Best Rate',
    ownerName: 'Clint Johnson',
    industry: 'Insurance Brokerage',
    location: 'Shreveport, Louisiana',
    phone: '(318) 555-0123',
    email: 'clint@aipbestrate.com',
    website: 'www.aipbestrate.com',
    services: [
      'Auto Insurance',
      'Homeowners Insurance', 
      'Commercial Insurance',
      'Life Insurance',
      'Umbrella Policies',
      'SR-22 Filing'
    ],
    businessHours: 'Monday-Friday 8:00 AM - 6:00 PM',
    established: '2018',
    licenseNumber: 'LA-INS-12345'
  };

  const quickActions = [
    { text: 'Get an auto insurance quote', icon: '🚗', category: 'quote' },
    { text: 'Fill out new client application form', icon: '📋', category: 'form' },
    { text: 'Process an insurance claim', icon: '🛡️', category: 'claim' },
    { text: 'Renew existing policy', icon: '🔄', category: 'renewal' },
    { text: 'Compare insurance rates', icon: '📊', category: 'comparison' },
    { text: 'Schedule appointment with Clint', icon: '📅', category: 'appointment' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSystemPrompt = () => {
    return `You are an AI assistant for ${clientConfig.companyName}, an insurance brokerage owned by ${clientConfig.ownerName} in ${clientConfig.location}.

BUSINESS INFORMATION:
- Company: ${clientConfig.companyName}
- Owner: ${clientConfig.ownerName}
- Industry: ${clientConfig.industry}
- Location: ${clientConfig.location}
- Phone: ${clientConfig.phone}
- Email: ${clientConfig.email}
- Business Hours: ${clientConfig.businessHours}
- Established: ${clientConfig.established}
- License: ${clientConfig.licenseNumber}

SERVICES OFFERED:
${clientConfig.services.map(service => `- ${service}`).join('\n')}

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
  - Focus on efficiency and accuracy`
}

FORM AUTOMATION CAPABILITIES:
Available forms for automatic completion:
${formTemplates.map(form => `- ${form.name}`).join('\n')}

When filling out forms:
1. Ask for required information if not provided
2. Use professional insurance terminology
3. Ensure all fields are completed accurately
4. Generate downloadable completed forms
5. Keep records for ${clientConfig.ownerName}'s files

IMPORTANT: Always maintain professional standards appropriate for the insurance industry. Be helpful, accurate, and trustworthy in all interactions.`;
  };

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
            { role: "user", content: getSystemPrompt() },
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
      if (inputMessage.toLowerCase().includes('fill out') || inputMessage.toLowerCase().includes('application') || assistantMessage.content.includes('COMPLETED_FORM:')) {
        const newForm = {
          id: Date.now(),
          name: `${inputMessage.includes('auto') ? 'Auto Insurance' : inputMessage.includes('home') ? 'Homeowners' : 'Insurance'} Application - ${new Date().toLocaleDateString()}`,
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
    setInputMessage(action);
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      try {
        const fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });

        setTrainingFiles(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          content: fileData,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toLocaleDateString()
        }]);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Professional Header */}
      <div className="bg-white shadow-xl border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-xl">
                <Shield className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{clientConfig.companyName}</h1>
                <p className="text-lg text-blue-600 font-semibold">{clientConfig.industry} • {clientConfig.location}</p>
                <p className="text-sm text-gray-600">Licensed Insurance Broker • Established {clientConfig.established}</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-8">
              <div className="text-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} className="text-blue-600" />
                  <span className="font-semibold">{clientConfig.phone}</span>
                </div>
                <p className="text-xs text-gray-500">Call for immediate assistance</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock size={18} className="text-blue-600" />
                  <span className="font-semibold">Open Now</span>
                </div>
                <p className="text-xs text-gray-500">{clientConfig.businessHours}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Mode:</label>
                <select
                  value={userMode}
                  onChange={(e) => setUserMode(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="customer">Customer Service</option>
                  <option value="internal">Internal (Clint)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Enhanced Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Star className="text-yellow-500" size={24} />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.text)}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{action.icon}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                        {action.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact {clientConfig.ownerName}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin size={18} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{clientConfig.location}</p>
                    <p className="text-xs text-gray-600">Licensed in Louisiana</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{clientConfig.phone}</p>
                    <p className="text-xs text-gray-600">Direct line to {clientConfig.ownerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={18} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{clientConfig.email}</p>
                    <p className="text-xs text-gray-600">Email for quotes</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center justify-center gap-2 shadow-lg font-semibold">
                <Calendar size={18} />
                Schedule with {clientConfig.ownerName}
              </button>
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Insurance Services</h3>
              <div className="space-y-2">
                {clientConfig.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-gray-700 font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Enhanced Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {userMode === 'customer' ? `${clientConfig.ownerName}'s AI Assistant` : 'Business Operations Assistant'}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {userMode === 'customer' 
                        ? 'Get instant insurance help, quotes, and professional guidance' 
                        : 'Automate forms, manage clients, and streamline daily operations'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">AI Assistant Online</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-6" style={{ backgroundColor: '#fafafa' }}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-4 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                          : 'bg-white border-2 border-blue-300 text-blue-700'
                      }`}>
                        {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                      </div>
                      
                      <div className={`rounded-2xl px-6 py-4 shadow-lg max-w-full ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                        <p className={`text-xs mt-3 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString()} 
                          {message.role === 'assistant' && userMode === 'internal' && ' • AI Assistant'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="flex gap-4 max-w-4xl">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-blue-300 text-blue-700 flex items-center justify-center shadow-lg">
                        <Bot size={20} />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <span className="ml-2 text-sm text-gray-600">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Area */}
              <div className="bg-white border-t-2 border-gray-200 p-6">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={userMode === 'customer' ? 
                        'Ask about insurance quotes, policies, claims, or schedule an appointment with Clint...' : 
                        'Ask me to fill out forms, process applications, manage clients, or help with business tasks...'
                      }
                      className="w-full border-2 border-gray-300 rounded-xl px-6 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      rows={2}
                      disabled={isLoading}
                    />
                  </div>
                  {userMode === 'internal' && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gray-100 text-gray-700 px-4 py-4 rounded-xl hover:bg-gray-200 transition-all border-2 border-gray-300"
                      title="Upload training files"
                    >
                      <Upload size={20} />
                    </button>
                  )}
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg font-semibold"
                  >
                    <Send size={20} />
                    Send
                  </button>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept=".txt,.pdf,.doc,.docx,.json"
                className="hidden"
              />
            </div>

            {/* Generated Forms Section (Internal Mode) */}
            {userMode === 'internal' && generatedForms.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FileCheck className="text-green-600" size={24} />
                  Generated Forms & Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedForms.map(form => (
                    <div key={form.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-400 hover:bg-green-50 transition-all shadow-sm hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm mb-2">{form.name}</p>
                          <p className="text-xs text-gray-600 mb-1">Generated: {form.date}</p>
                          <p className="text-xs text-gray-600">Time: {form.time}</p>
                        </div>
                        <button 
                          onClick={() => downloadForm(form)}
                          className="text-green-600 hover:text-green-800 p-2 hover:bg-green-100 rounded-lg transition-all"
                          title="Download Form"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training Files Section (Internal Mode) */}
            {userMode === 'internal' && trainingFiles.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FileText className="text-blue-600" size={24} />
                  Training Files & Business Data
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainingFiles.map(file => (
                    <div key={file.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                          <p className="text-xs text-gray-600">Uploaded: {file.uploadDate}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
