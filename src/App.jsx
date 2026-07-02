import { useState, useEffect } from 'react';
import './App.css';

// Mock Data
const contract = {
  name: "NIFTY 24500 CE",
  expiry: "26 Jun 2026",
  strike: 24500,
  premium: 125.50,
  lotSize: 50,
};

const totalPremium = (contract.premium * contract.lotSize).toFixed(2);

// Mock Translation Strings
const t = {
  en: {
    gateTitle: "Check Your Understanding",
    gateSubtitle: "Before you place this trade, make sure you understand the risks.",
    payoffExplanation: `If NIFTY closes below ${contract.strike} on expiry, this option expires worthless and you lose the full premium of ₹${totalPremium}.`,
    mcqQuestion: `If NIFTY expires at 24000, what happens to your premium?`,
    options: [
      { id: 'a', text: `I make a profit` },
      { id: 'b', text: `I get my ₹${totalPremium} back` },
      { id: 'c', text: `I lose the full ₹${totalPremium}` },
    ],
    correctAnswer: 'c',
    successMsg: "Correct! You understand the maximum risk of this trade.",
    errorMsg: "Not quite. Remember, Call options expire worthless below the strike price.",
    retryText: "Try Again",
    proceedText: "Proceed to Buy",
  },
  hi: {
    gateTitle: "अपनी समझ की जाँच करें",
    gateSubtitle: "इस ट्रेड को करने से पहले, सुनिश्चित करें कि आप जोखिमों को समझते हैं।",
    payoffExplanation: `यदि NIFTY एक्सपायरी पर ${contract.strike} से नीचे बंद होता है, तो यह विकल्प बेकार हो जाता है और आप ₹${totalPremium} का पूरा प्रीमियम खो देते हैं।`,
    mcqQuestion: `यदि NIFTY 24000 पर एक्सपायर होता है, तो आपके प्रीमियम का क्या होता है?`,
    options: [
      { id: 'a', text: `मुझे लाभ होता है` },
      { id: 'b', text: `मुझे मेरे ₹${totalPremium} वापस मिल जाते हैं` },
      { id: 'c', text: `मैं पूरा ₹${totalPremium} खो देता हूँ` },
    ],
    correctAnswer: 'c',
    successMsg: "सही! आप इस ट्रेड के अधिकतम जोखिम को समझते हैं।",
    errorMsg: "बिल्कुल नहीं। याद रखें, कॉल विकल्प स्ट्राइक मूल्य से नीचे बेकार हो जाते हैं।",
    retryText: "पुनः प्रयास करें",
    proceedText: "खरीदने के लिए आगे बढ़ें",
  }
};

const OrderScreen = ({ onBuy, gatePassed, isChecking }) => {
  return (
    <div className="screen">
      <div className="header">
        <div className="back-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </div>
        <h2>{contract.name}</h2>
        <div className="header-right"></div>
      </div>
      
      <div className="content">
        <div className="card">
          <div className="row">
            <span className="label">Expiry</span>
            <span className="value">{contract.expiry}</span>
          </div>
          <div className="row">
            <span className="label">Market Price</span>
            <span className="value price">₹{contract.premium.toFixed(2)}</span>
          </div>
        </div>

        <div className="card form-card">
          <div className="tabs">
            <button className="tab active">Delivery</button>
            <button className="tab">Intraday</button>
          </div>
          
          <div className="input-group">
            <label>Qty (Lot size {contract.lotSize})</label>
            <div className="stepper">
              <button className="step-btn">−</button>
              <input type="text" value={contract.lotSize} readOnly />
              <button className="step-btn">+</button>
            </div>
          </div>
          
          <div className="input-group">
            <label>Price</label>
            <div className="price-input">
              <input type="text" value="Market" readOnly className="market-input" />
            </div>
          </div>
          
          <div className="balance-row">
            <span>Balance: ₹15,420.00</span>
            <span>Required: ₹{totalPremium}</span>
          </div>
        </div>
      </div>

      <div className="footer">
        <button 
          className={`buy-btn ${gatePassed ? 'passed' : ''} ${isChecking ? 'checking' : ''}`}
          onClick={onBuy}
          disabled={isChecking}
        >
          {gatePassed ? (
            <>
              <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Swipe to Buy
            </>
          ) : (
            `Buy ${contract.name}`
          )}
        </button>
      </div>
    </div>
  );
};

const ComprehensionCard = ({ isOpen, onClose, onPass }) => {
  const [lang, setLang] = useState('en');
  const [selectedOption, setSelectedOption] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, correct, incorrect

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const content = t[lang];

  const handleSelect = (id) => {
    if (status === 'correct') return;
    setSelectedOption(id);
    if (id === content.correctAnswer) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  return (
    <>
      <div className="backdrop" onClick={() => { if(status !== 'correct') onClose(); }}></div>
      <div className="bottom-sheet slide-up">
        <div className="sheet-header">
          <div className="sheet-handle"></div>
          <div className="lang-toggle">
            <span className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</span>
            <span className="divider">|</span>
            <span className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>हि</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="sheet-content">
          <div className="title-row">
            <div className="icon-shield">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>{content.gateTitle}</h3>
          </div>
          <p className="subtitle">{content.gateSubtitle}</p>

          <div className="payoff-diagram">
            <svg viewBox="0 0 300 120" className="chart-svg">
              {/* Axes */}
              <line x1="40" y1="80" x2="280" y2="80" stroke="#E0E4E9" strokeWidth="2" />
              <line x1="40" y1="20" x2="40" y2="100" stroke="#E0E4E9" strokeWidth="2" />
              
              {/* Payoff line */}
              <path d="M 40,95 L 180,95 L 280,20" fill="none" stroke="#00D09C" strokeWidth="3" />
              
              {/* Strike point */}
              <circle cx="180" cy="80" r="4" fill="#00D09C" />
              <text x="180" y="110" fontSize="12" fill="#44475B" textAnchor="middle">Strike (24500)</text>
              
              {/* Loss Area */}
              <text x="110" y="70" fontSize="12" fill="#EB5B3C" textAnchor="middle">-₹{totalPremium}</text>
              
              {/* Profit Area */}
              <text x="240" y="40" fontSize="12" fill="#00D09C" textAnchor="middle">Profit</text>
            </svg>
          </div>
          
          <p className="explanation">{content.payoffExplanation}</p>

          <div className="mcq-section">
            <p className="question">{content.mcqQuestion}</p>
            <div className="options">
              {content.options.map(opt => (
                <button 
                  key={opt.id}
                  className={`option-btn ${selectedOption === opt.id ? 'selected' : ''} ${selectedOption === opt.id && status === 'correct' ? 'correct' : ''} ${selectedOption === opt.id && status === 'incorrect' ? 'incorrect' : ''}`}
                  onClick={() => handleSelect(opt.id)}
                  disabled={status === 'correct'}
                >
                  <div className="radio">
                    {selectedOption === opt.id && <div className="radio-inner"></div>}
                  </div>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>
            
            {status === 'incorrect' && (
              <div className="feedback error slide-down">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {content.errorMsg}
              </div>
            )}
            
            {status === 'correct' && (
              <div className="feedback success slide-down">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                {content.successMsg}
              </div>
            )}
          </div>

          <div className="sheet-footer">
            <button 
              className={`primary-btn ${status !== 'correct' ? 'disabled' : ''}`}
              disabled={status !== 'correct'}
              onClick={onPass}
            >
              {content.proceedText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ConfirmedScreen = ({ onReset }) => {
  return (
    <div className="screen confirm-screen fade-in">
      <div className="success-icon-large">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
      <h2>Order Placed</h2>
      <p>{contract.name}</p>
      
      <div className="details-card">
        <div className="row"><span className="label">Type</span><span className="value">Buy</span></div>
        <div className="row"><span className="label">Quantity</span><span className="value">{contract.lotSize}</span></div>
        <div className="row"><span className="label">Order Type</span><span className="value">Market</span></div>
      </div>
      
      <button className="done-btn" onClick={onReset}>Done</button>
    </div>
  );
};

export default function App() {
  const [userType, setUserType] = useState('new'); // 'new' or 'experienced'
  const [appState, setAppState] = useState('order'); // 'order' or 'confirm'
  const [showGate, setShowGate] = useState(false);
  const [gatePassed, setGatePassed] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const handleBuyClick = () => {
    if (userType === 'experienced') {
      // Experienced users skip the gate entirely
      setAppState('confirm');
    } else {
      if (gatePassed) {
        // Already passed the gate in this session
        setAppState('confirm');
      } else {
        // New user, hasn't passed gate -> show it
        setShowGate(true);
      }
    }
  };

  const handleGatePass = () => {
    setGatePassed(true);
    setShowGate(false);
  };

  const handleReset = () => {
    setAppState('order');
    setShowGate(false);
    setGatePassed(false);
  };

  return (
    <div className="app-container">
      {/* Mobile Viewport Wrapper */}
      <div className="mobile-frame">
        {appState === 'order' && (
          <OrderScreen 
            onBuy={handleBuyClick} 
            gatePassed={gatePassed} 
            isChecking={showGate} 
          />
        )}
        
        {appState === 'confirm' && (
          <ConfirmedScreen onReset={handleReset} />
        )}
        
        <ComprehensionCard 
          isOpen={showGate} 
          onClose={() => setShowGate(false)} 
          onPass={handleGatePass} 
        />
      </div>

      {/* Demo Controls */}
      <div className="demo-controls">
        <div className="demo-header">
          <h3>Prototype Controls</h3>
          <button className="info-toggle" onClick={() => setShowInfo(!showInfo)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </button>
        </div>
        
        {showInfo && (
          <div className="demo-info">
            <strong>How it works:</strong> The Comprehension Gate only triggers for <em>New F&O Users</em>. It verifies they understand the maximum loss before capital is at risk. <em>Experienced Users</em> skip it entirely to avoid friction.
          </div>
        )}
        
        <div className="toggle-group">
          <label>User State:</label>
          <div className="segment-control">
            <button 
              className={userType === 'new' ? 'active' : ''} 
              onClick={() => { setUserType('new'); handleReset(); }}
            >
              New F&O User
            </button>
            <button 
              className={userType === 'experienced' ? 'active' : ''} 
              onClick={() => { setUserType('experienced'); handleReset(); }}
            >
              Experienced User
            </button>
          </div>
        </div>
        
        <button className="reset-btn" onClick={handleReset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
          Reset Prototype
        </button>
      </div>
    </div>
  );
}
