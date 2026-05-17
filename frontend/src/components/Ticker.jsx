import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const Ticker = () => {
  const [messages, setMessages] = useState([
    "🎉 Welcome to IMS Pro - Your smart inventory partner!"
  ]);

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await apiClient.get('/reports/ticker');
        if (res.data.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Error fetching ticker data:", err);
      }
    };
    fetchTicker();
    // Refresh every 30 seconds for live feel!
    const interval = setInterval(fetchTicker, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: '#0f172a',
      color: '#38bdf8',
      padding: '0.5rem 0',
      fontSize: '0.875rem',
      fontWeight: '500',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      position: 'relative',
      borderBottom: '1px solid #334155',
      gridColumn: '1 / -1'
    }}>
      <div style={{
        display: 'inline-block',
        animation: 'marquee 25s linear infinite',
        paddingLeft: '100%'
      }}>
        {messages.map((msg, index) => (
          <span key={index} style={{ marginRight: '4rem' }}>{msg}</span>
        ))}
      </div>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default Ticker;
