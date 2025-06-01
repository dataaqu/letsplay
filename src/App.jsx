import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import MatchModal from './components/MatchModal/MatchModal';
import MatchCard from './components/MatchCard/MatchCard';
import ViewFormationModal from './components/ViewFormationModal/ViewFormationModal';
import ImageLoadingScreen from './components/ImageLoadingScreen/ImageLoadingScreen';
import imagePreloader, { backgroundImage } from './utils/imagePreloader';
import { EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import './styles/safari-fixes.css'; // Import Safari animation fixes

// Firebase imports
import { subscribeToMatches, saveMatch, deleteMatch, updateMatchScore } from './firebase/matchService';

function App() {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMatches, setShowMatches] = useState(true);
  const [isFormationModalOpen, setIsFormationModalOpen] = useState(false);
  const [formationTeam1Players, setFormationTeam1Players] = useState([]);
  const [formationTeam2Players, setFormationTeam2Players] = useState([]);
  const [editingMatch, setEditingMatch] = useState(null);

  // Firebase subscription and image preloading
  useEffect(() => {
    // Start image preloading immediately
    imagePreloader.preloadAll();

    // Subscribe to real-time match updates from Firebase
    const unsubscribe = subscribeToMatches((matchesFromFirebase) => {
      setMatches(matchesFromFirebase);
    });

    // Cleanup subscription on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleCreateMatch = async (matchData) => {
    try {
      if (editingMatch) {
        // Update existing match
        const success = await saveMatch(matchData);
        if (success) {
          setEditingMatch(null);
        } else {
          alert('Failed to update match. Please try again.');
        }
      } else {
        // Create new match
        const newMatch = { ...matchData, id: Date.now().toString() };
        const success = await saveMatch(newMatch);
        if (!success) {
          alert('Failed to create match. Please try again.');
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating/updating match:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      const success = await deleteMatch(matchId);
      if (!success) {
        alert('Failed to delete match. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('An error occurred while deleting. Please try again.');
    }
  };

  const handleEditMatch = (matchId) => {
    const matchToEdit = matches.find(match => match.id === matchId);
    if (matchToEdit) {
      setEditingMatch(matchToEdit);
      setIsModalOpen(true);
    }
  };

  const handleFormationView = (team1Players, team2Players) => {
    setFormationTeam1Players(team1Players);
    setFormationTeam2Players(team2Players);
    setIsFormationModalOpen(true);
  };

  const closeFormationModal = () => {
    setIsFormationModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
  };

  const handleUpdateScore = async (matchId, score) => {
    try {
      const success = await updateMatchScore(matchId, score);
      if (!success) {
        alert('Failed to update score. Please try again.');
      }
    } catch (error) {
      console.error('Error updating score:', error);
      alert('An error occurred while updating score. Please try again.');
    }
  };  return (
    <ImageLoadingScreen 
      onLoadComplete={() => console.log('Images loaded successfully')}
    >
      <div className="flex flex-col min-h-screen">
        <Header />
        <main 
          className="relative flex-1 bg-cover bg-center bg-no-repeat flex pt-24"
          style={{
            backgroundImage: `url(${backgroundImage})`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Content */}
          <div className="container mx-auto px-2 relative z-10 flex flex-col items-center justify-center">
            <div className={`${showMatches ? 'w-[90%] sm:w-2/3 bg-gray-100/60 backdrop-blur-sm' : 'w-[90%] sm:w-1/3 bg-gray-100/20 backdrop-blur-sm'} rounded-xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto transition-all duration-300`}>
              {matches.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex-1 flex items-center justify-center">
                      {!showMatches && (
                        <p className="text-gray-900 font-semibold text-lg">
                          თქვენ გაქვთ {matches.length} მატჩი
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowMatches(!showMatches)}
                      className="text-gray-900 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-200/50"
                      title={showMatches ? "დამალვა" : "ჩვენება"}
                    >
                      {showMatches ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                    </button>
                  </div>
                  {showMatches && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {[...matches]
                        .sort((a, b) => {
                          // First priority: matches without scores (unfinished matches)
                          const aHasScore = a.team1Score !== undefined && a.team2Score !== undefined;
                          const bHasScore = b.team1Score !== undefined && b.team2Score !== undefined;
                          
                          if (!aHasScore && bHasScore) return -1; // a (no score) comes first
                          if (aHasScore && !bHasScore) return 1;  // b (no score) comes first
                          
                          // Second priority: sort by timestamp (newest first) within each group
                          return new Date(b.timestamp) - new Date(a.timestamp);
                        })
                        .map(match => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            onDelete={handleDeleteMatch}
                            onEdit={handleEditMatch}
                            onViewFormation={handleFormationView}
                            onUpdateScore={handleUpdateScore}
                          />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-gray-900 text-3xl font-bold mb-3">მატჩები ჯერ არ არის შექმნილი</h2>
                  <p className="text-gray-800 text-xl font-medium mb-6">შექმენით პირველი მატჩი!</p>
                  <button
                    onClick={() => {
                      setEditingMatch(null);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    შექმენი ახალი მატჩი
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
        
        {/* Floating Action Button for creating a new match */}
        {matches.length > 0 && (
          <button
            onClick={() => {
              setEditingMatch(null);
              setIsModalOpen(true);
            }}
            className="fixed bottom-24 right-8 p-4 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors z-20 flex items-center justify-center"
            title="შექმენი ახალი მატჩი"
          >
            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        <MatchModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleCreateMatch}
          initialData={editingMatch}
        />
        <ViewFormationModal
          isOpen={isFormationModalOpen}
          onClose={closeFormationModal}
          team1Players={formationTeam1Players}
          team2Players={formationTeam2Players}
        />
      </div>
    </ImageLoadingScreen>
  );
}

export default App;
