import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Messages() {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('player');
  const messagesEndRef = useRef(null);

  // Conversations data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      participantId: 'club_001',
      participantName: 'Liverpool FC',
      participantRole: 'club',
      participantAvatar: 'L',
      lastMessage: 'We are interested in your profile...',
      lastMessageTime: '2026-05-06T10:30:00',
      unreadCount: 2,
      online: true
    },
    {
      id: 2,
      participantId: 'club_002',
      participantName: 'Chelsea FC Academy',
      participantRole: 'club',
      participantAvatar: 'C',
      lastMessage: 'Thank you for your application. When can you come for trials?',
      lastMessageTime: '2026-05-05T15:45:00',
      unreadCount: 0,
      online: false
    },
    {
      id: 3,
      participantId: 'club_003',
      participantName: 'Manchester City Youth',
      participantRole: 'club',
      participantAvatar: 'M',
      lastMessage: 'Your profile looks impressive. We would like to schedule a call.',
      lastMessageTime: '2026-05-05T09:20:00',
      unreadCount: 1,
      online: true
    },
    {
      id: 4,
      participantId: 'club_004',
      participantName: 'Tottenham Hotspur',
      participantRole: 'club',
      participantAvatar: 'T',
      lastMessage: 'When are you available for a trial?',
      lastMessageTime: '2026-05-04T14:10:00',
      unreadCount: 0,
      online: false
    },
    {
      id: 5,
      participantId: 'club_005',
      participantName: 'Arsenal Development',
      participantRole: 'club',
      participantAvatar: 'A',
      lastMessage: 'We received your application. Our team will review it.',
      lastMessageTime: '2026-05-03T11:00:00',
      unreadCount: 0,
      online: false
    }
  ]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setUserRole(parsedUser.role || 'player');
    
    // Load last selected chat from localStorage
    const lastChat = localStorage.getItem('lastSelectedChat');
    if (lastChat) {
      const chat = conversations.find(c => c.id === parseInt(lastChat));
      if (chat) setSelectedChat(chat);
    }
  }, [navigate]);

  // If user is player, show club conversations; if club, show player conversations
  useEffect(() => {
    if (userRole === 'player') {
      // Player sees conversations with clubs
      setConversations([
        {
          id: 1,
          participantId: 'club_001',
          participantName: 'Liverpool FC',
          participantRole: 'club',
          participantAvatar: 'L',
          lastMessage: 'We are interested in your profile...',
          lastMessageTime: '2026-05-06T10:30:00',
          unreadCount: 2,
          online: true
        },
        {
          id: 2,
          participantId: 'club_002',
          participantName: 'Chelsea FC Academy',
          participantRole: 'club',
          participantAvatar: 'C',
          lastMessage: 'Thank you for your application. When can you come for trials?',
          lastMessageTime: '2026-05-05T15:45:00',
          unreadCount: 0,
          online: false
        }
      ]);
    } else {
      // Club sees conversations with players
      setConversations([
        {
          id: 1,
          participantId: 'player_001',
          participantName: 'Alex Silva',
          participantRole: 'player',
          participantAvatar: 'A',
          lastMessage: 'I am very interested in joining your club...',
          lastMessageTime: '2026-05-06T10:30:00',
          unreadCount: 1,
          online: true
        },
        {
          id: 2,
          participantId: 'player_002',
          participantName: 'Nimal Perera',
          participantRole: 'player',
          participantAvatar: 'N',
          lastMessage: 'When are the trials?',
          lastMessageTime: '2026-05-05T15:45:00',
          unreadCount: 0,
          online: false
        }
      ]);
    }
  }, [userRole]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = (conversationId) => {
    // Mock messages based on conversation
    const messagesMap = {
      1: [
        { id: 101, conversationId: 1, senderId: 'club_001', senderName: 'Liverpool FC', message: 'Hello! We saw your profile and are very impressed with your skills.', timestamp: '2026-05-06T09:00:00', isRead: true },
        { id: 102, conversationId: 1, senderId: 'player_current', senderName: 'You', message: 'Thank you! I would love to learn more about your academy.', timestamp: '2026-05-06T09:15:00', isRead: true },
        { id: 103, conversationId: 1, senderId: 'club_001', senderName: 'Liverpool FC', message: 'We are interested in your profile. Do you have any highlight videos?', timestamp: '2026-05-06T10:00:00', isRead: true },
        { id: 104, conversationId: 1, senderId: 'club_001', senderName: 'Liverpool FC', message: 'We would like to invite you for trials next week.', timestamp: '2026-05-06T10:30:00', isRead: false }
      ],
      2: [
        { id: 201, conversationId: 2, senderId: 'player_current', senderName: 'You', message: 'I am very interested in joining your academy program.', timestamp: '2026-05-05T14:00:00', isRead: true },
        { id: 202, conversationId: 2, senderId: 'club_002', senderName: 'Chelsea FC Academy', message: 'Thank you for your application. When can you come for trials?', timestamp: '2026-05-05T15:45:00', isRead: true }
      ]
    };
    
    setMessages(messagesMap[conversationId] || []);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    setSending(true);
    const messageContent = newMessage;
    setNewMessage('');
    
    const newMsg = {
      id: Date.now(),
      conversationId: selectedChat.id,
      senderId: userRole === 'player' ? 'player_current' : 'club_current',
      senderName: 'You',
      message: messageContent,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    
    // Update conversation list with last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedChat.id 
        ? { 
            ...conv, 
            lastMessage: messageContent, 
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0
          }
        : conv
    ));
    
    setTimeout(() => {
      setSending(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    localStorage.setItem('lastSelectedChat', chat.id);
    
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.id === chat.id ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const handleBackToDashboard = () => {
    if (userRole === 'club') {
      navigate('/club/dashboard');
    } else {
      navigate('/player/dashboard');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60 * 60 * 1000) {
      const mins = Math.floor(diff / 60000);
      return mins === 0 ? 'Just now' : `${mins}m ago`;
    } else if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      backgroundColor: '#0A0F1F',
      minHeight: '100vh',
      color: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: '#1E1F2A',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#00E5FF'}
              onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
            >
              ← Back to {userRole === 'club' ? 'Club' : 'Player'} Dashboard
            </button>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#00E5FF'
            }}>
              Messages
            </h1>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              padding: '6px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#ef4444';
              e.target.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.15)';
              e.target.style.color = '#FFFFFF';
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        height: 'calc(100vh - 70px)',
        display: 'flex'
      }}>
        
        {/* Conversations Sidebar */}
        <div style={{
          width: '320px',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1E1F2A'
        }}>
          
          {/* Search Bar */}
          <div style={{ padding: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  backgroundColor: '#0A0F1F',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00E5FF'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
                fontSize: '14px'
              }}>🔍</span>
            </div>
          </div>

          {/* Conversations List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 12px 12px 12px'
          }}>
            {filteredConversations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#9CA3AF'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectChat(conv)}
                  style={{
                    padding: '14px',
                    marginBottom: '8px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: selectedChat?.id === conv.id ? 'rgba(0,229,255,0.1)' : 'transparent',
                    border: selectedChat?.id === conv.id ? '1px solid rgba(0,229,255,0.3)' : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedChat?.id !== conv.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChat?.id !== conv.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#00E5FF',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#0A0F1F'
                      }}>
                        {conv.participantAvatar}
                      </div>
                      {conv.online && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '10px',
                          height: '10px',
                          backgroundColor: '#22c55e',
                          borderRadius: '50%',
                          border: '2px solid #1E1F2A'
                        }} />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {conv.participantName}
                        </h4>
                        <span style={{
                          fontSize: '10px',
                          color: '#6b7280',
                          marginLeft: '8px'
                        }}>
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: conv.unreadCount > 0 ? '#00E5FF' : '#9CA3AF',
                        margin: '4px 0 0 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {conv.lastMessage}
                      </p>
                    </div>
                    
                    {/* Unread Badge */}
                    {conv.unreadCount > 0 && (
                      <div style={{
                        minWidth: '20px',
                        height: '20px',
                        backgroundColor: '#00E5FF',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#0A0F1F',
                        padding: '0 6px'
                      }}>
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0A0F1F' }}>
          {!selectedChat ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No conversation selected</h3>
              <p style={{ fontSize: '13px' }}>Select a conversation from the sidebar to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: '#1E1F2A',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#00E5FF',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#0A0F1F'
                }}>
                  {selectedChat.participantAvatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                    {selectedChat.participantName}
                  </h3>
                  <p style={{ fontSize: '11px', color: selectedChat.online ? '#22c55e' : '#6b7280', margin: '2px 0 0 0' }}>
                    {selectedChat.online ? '● Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {messages.length === 0 ? (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9CA3AF'
                  }}>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCurrentUser = msg.senderId === 'player_current' || msg.senderId === 'club_current';
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          justifyContent: isCurrentUser ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            backgroundColor: isCurrentUser ? '#00E5FF' : '#1E1F2A',
                            color: isCurrentUser ? '#0A0F1F' : '#FFFFFF',
                            borderRadius: '18px',
                            padding: '10px 16px',
                            borderBottomRightRadius: isCurrentUser ? '4px' : '18px',
                            borderBottomLeftRadius: !isCurrentUser ? '4px' : '18px'
                          }}
                        >
                          <p style={{ fontSize: '14px', margin: 0, wordWrap: 'break-word' }}>
                            {msg.message}
                          </p>
                          <p style={{
                            fontSize: '10px',
                            margin: '4px 0 0 0',
                            opacity: 0.7,
                            textAlign: isCurrentUser ? 'right' : 'left'
                          }}>
                            {formatMessageTime(msg.timestamp)}
                            {isCurrentUser && msg.isRead && <span style={{ marginLeft: '4px' }}>✓✓</span>}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: '#1E1F2A'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows="1"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      backgroundColor: '#0A0F1F',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00E5FF'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    style={{
                      backgroundColor: '#00E5FF',
                      color: '#0A0F1F',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: !newMessage.trim() || sending ? 'not-allowed' : 'pointer',
                      opacity: !newMessage.trim() || sending ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (newMessage.trim() && !sending) {
                        e.target.style.boxShadow = '0 0 15px rgba(0,229,255,0.4)';
                      }
                    }}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
                <p style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  margin: '8px 0 0 0',
                  textAlign: 'center'
                }}>
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}