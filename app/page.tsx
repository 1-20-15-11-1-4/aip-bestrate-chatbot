import { 
  Send, Upload, User, Bot, Building, FileText, Trash2, FileCheck, 
  Download, Plus, Settings, MessageSquare, FormInput, Shield, 
  Clock, CheckCircle, Star, Phone, Mail, MapPin, Calendar
} from 'lucide-react';
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
  const [trainingFiles, setTrainingFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Client Configuration
  const clientConfig = {
    companyName: 'AIP Best Rate',
    ownerName: 'Clint Johnson',
    industry: 'Insurance Brokerage',
    location: 'Shreveport, Louisiana',
    phone: '(318) 555-0123',
    email: 'clint@aipbestrate.com',
    services: [
      'Auto Insurance',
      'Homeowners Insurance', 
      'Commercial Insurance',
      'Life Insurance',
      'Umbrella Policies',
      'SR-22 Filing'
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
      // Simulate AI response for demo
      setTimeout(() => {
        const responses = [
          "I'd be happy to help you with that! As Clint's AI assistant, I can process insurance applications, generate quotes, and handle various insurance-related tasks. What specific information do you need?",
          "Great question! For insurance quotes, I'll need some basic information. Are you looking for auto, home, or commercial insurance? I can start preparing the application forms right away.",
          "I can definitely help with that. Let me pull up the relevant forms and get that processed for you. This is exactly the kind of task I help Clint with daily!"
        ];
        
        const assistantMessage = {
          role: 'assistant',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize, but I encountered a technical issue. Please try again or contact ${clientConfig.ownerName} directly at ${clientConfig.phone} for immediate assistance.`,
        timestamp: new Date()
      }]);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
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
                <p className="text-sm text-gray-600">Licensed Insurance Broker</p>
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
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Mode:</label>
                <select
                  value={userMode}
                  onChange={(e) => setUserMode(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          {/* Sidebar */}
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
                    onClick={() => handleQuickAction(action)}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group shadow-sm"
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

            {/* Contact Info */}
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
              </div>
              
              <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center justify-center gap-2 shadow-lg font-semibold">
                <Calendar size={18} />
                Schedule with {clientConfig.ownerName}
              </button>
            </div>

            {/* Services */}
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

          {/* Main Chat */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white p-6">
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

              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gray-50">
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
                      
                      <div className={`rounded-2xl px-6 py-4 shadow-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                        <p className={`text-xs mt-3 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
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

              {/* Input */}
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
                      className="w-full border-2 border-gray-300 rounded-xl px-6 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      rows={2}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg font-semibold"
                  >
                    <Send size={20} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
