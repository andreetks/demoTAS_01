import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import GroupView from './components/GroupView';
import Tasks from './components/Tasks';
import CollaborativeDoc from './components/CollaborativeDoc';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentScreen('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentScreen('login');
  };

  const handleOpenGroup = (groupName) => {
    setActiveGroup(groupName);
    setCurrentScreen('groupView');
  };

  const handleOpenChat = (groupName) => {
    setActiveGroup(groupName);
    setCurrentScreen('chat');
  };

  const handleOpenTasks = () => {
    setCurrentScreen('tasks');
  };

  const handleOpenDocument = () => {
    setCurrentScreen('document');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setActiveGroup(null);
  };

  const handleBackToGroupView = () => {
    setCurrentScreen('groupView');
  };

  return (
    <div className="app-container">
      {currentScreen === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {currentScreen === 'dashboard' && (
        <Dashboard onOpenChat={handleOpenGroup} onLogout={handleLogout} />
      )}

      {currentScreen === 'groupView' && (
        <GroupView
          groupName={activeGroup}
          onBack={handleBackToDashboard}
          onOpenTasks={handleOpenTasks}
          onOpenDocument={handleOpenDocument}
        />
      )}

      {currentScreen === 'tasks' && (
        <Tasks groupName={activeGroup} onBack={handleBackToGroupView} />
      )}

      {currentScreen === 'document' && (
        <CollaborativeDoc groupName={activeGroup} onBack={handleBackToGroupView} />
      )}

      {currentScreen === 'chat' && (
        <Chat groupName={activeGroup} onBack={handleBackToDashboard} />
      )}
    </div>
  );
}

export default App;
