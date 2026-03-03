import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import GroupView from './components/GroupView';
import Tasks from './components/Tasks';
import CollaborativeDoc from './components/CollaborativeDoc';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeProject, setActiveProject] = useState(null);
  const [chatRoom, setChatRoom] = useState(null);

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

  const handleOpenGroup = (project) => {
    setActiveProject(project);
    setCurrentScreen('groupView');
  };

  const handleOpenChat = (project, targetUser = null) => {
    if (project) {
      setActiveProject(project);
    }

    if (targetUser) {
      // Private chat room ID logic
      const token = localStorage.getItem('token');
      const myId = token ? JSON.parse(atob(token.split('.')[1])).sub : 'me';
      const roomId = [myId, targetUser.id].sort().join('_');
      setChatRoom({ id: roomId, name: targetUser.name, type: 'private' });
    } else if (project) {
      // Group chat room ID is the project ID
      setChatRoom({ id: project.id, name: project.name, type: 'group' });
    }
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
    setActiveProject(null);
    setChatRoom(null);
  };

  const handleBackToGroupView = () => {
    setCurrentScreen('groupView');
    setChatRoom(null);
  };

  return (
    <div className="app-container">
      {currentScreen === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {currentScreen === 'dashboard' && (
        <Dashboard
          onOpenProject={handleOpenGroup}
          onOpenPrivateChat={(user) => handleOpenChat(null, user)}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'groupView' && (
        <GroupView
          projectId={activeProject?.id}
          groupName={activeProject?.name}
          onBack={handleBackToDashboard}
          onOpenTasks={handleOpenTasks}
          onOpenDocument={handleOpenDocument}
          onOpenProjectChat={() => handleOpenChat(activeProject)}
        />
      )}

      {currentScreen === 'tasks' && (
        <Tasks groupName={activeProject?.name} onBack={handleBackToGroupView} />
      )}

      {currentScreen === 'document' && (
        <CollaborativeDoc groupName={activeProject?.name} onBack={handleBackToGroupView} />
      )}

      {currentScreen === 'chat' && (
        <Chat
          room={chatRoom}
          onBack={activeProject && chatRoom?.type === 'group' ? handleBackToGroupView : handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
