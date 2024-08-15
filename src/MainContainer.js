import React, { useState } from 'react';
import CTDHeaderViewer from './CTDHeaderViewer';
import EventLogViewer from './EventLogViewer';

const MainContainer = () => {
  const [activeTab, setActiveTab] = useState('elog');

  const renderTabContent = () => {
    switch(activeTab) {
      case 'ctd':
        return <CTDHeaderViewer />;
      case 'elog':
        return <EventLogViewer />;
      // We'll add more cases here as we create more viewer components
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="main-container">
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'ctd' ? 'active' : ''}`}
          onClick={() => setActiveTab('ctd')}
        >
          CTD Header
        </button>
        <button
          className={`tab-button ${activeTab === 'elog' ? 'active' : ''}`}
          onClick={() => setActiveTab('elog')}
        >
          Event Log
        </button>
        {/* We'll add more tab buttons here */}
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MainContainer;