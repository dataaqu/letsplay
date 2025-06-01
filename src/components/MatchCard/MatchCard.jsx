import { useState, useEffect } from 'react';
import { MapPinIcon, PencilIcon, TrashIcon, EyeIcon, XMarkIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Tooltip from '../Tooltip/Tooltip';
import cardBackImage from '../../imgs/cardBack.jpg';
import './MatchCard.css';

function MatchCard({ match, onDelete, onEdit, onViewFormation, onUpdateScore }) {
  const [isTouched, setIsTouched] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [team1Score, setTeam1Score] = useState(match.score?.team1 || '');
  const [team2Score, setTeam2Score] = useState(match.score?.team2 || '');
  
  // Reset touch state after a short delay
  useEffect(() => {
    if (isTouched) {
      const timer = setTimeout(() => {
        setIsTouched(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTouched]);

  // Handle escape key and click outside for modals
  useEffect(() => {
    if (showDeleteModal || showScoreModal) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          if (showDeleteModal) {
            setShowDeleteModal(false);
          }
          if (showScoreModal) {
            setTeam1Score(match.score?.team1 || '');
            setTeam2Score(match.score?.team2 || '');
            setShowScoreModal(false);
          }
        }
      };
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showDeleteModal, showScoreModal, match.score, team1Score, team2Score]);

  // Handle delete with confirmation modal
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = () => {
    setShowDeleteModal(false);
    onDelete(match.id);
  };

  // Cancel delete action
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Handle finish/score functionality
  const handleFinish = () => {
    setShowScoreModal(true);
  };

  // Save score
  const saveScore = () => {
    const score = {
      team1: parseInt(team1Score) || 0,
      team2: parseInt(team2Score) || 0
    };
    onUpdateScore(match.id, score);
    setShowScoreModal(false);
  };

  // Cancel score modal
  const cancelScore = () => {
    setTeam1Score(match.score?.team1 || '');
    setTeam2Score(match.score?.team2 || '');
    setShowScoreModal(false);
  };

  // Check if match is finished (has score)
  const isFinished = match.score && (match.score.team1 !== undefined && match.score.team2 !== undefined);

  return (
    <div 
      className={`match-card relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 group ${isTouched ? 'tap-pulse' : ''} ${
        isFinished 
          ? 'ring-2 ring-green-400/50 shadow-green-400/20 bg-gradient-to-br from-green-900/20 to-green-700/10' 
          : 'shadow-gray-800/50'
      }`}
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setTimeout(() => setIsTouched(false), 300)}
    >
      {/* Card Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform group-hover:scale-105 transition-transform duration-500" 
          style={{
            backgroundImage: `url(${cardBackImage})`
          }}
        ></div>
        <div className={`absolute inset-0 transition-all duration-300 ${
          isFinished 
            ? 'bg-gradient-to-t from-green-900/80 via-green-800/60 to-green-700/40' 
            : 'bg-gradient-to-t from-black/70 to-transparent opacity-60'
        }`}></div>
        {/* Additional overlay for finished matches */}
        {isFinished && <div className="absolute inset-0 bg-green-500/15 mix-blend-overlay"></div>}
        {/* Success pattern overlay for finished matches */}
        {isFinished && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-green-400 text-6xl">✓</div>
            <div className="absolute bottom-4 left-4 text-green-400 text-4xl">🏆</div>
          </div>
        )}
      </div>
      
      {/* Content Container with Blur */}
      <div className="relative">
        <div className={`bg-black/30 p-4 sm:p-6 group-hover:bg-black/40 transition-all duration-300 ${isFinished ? 'bg-black/40' : ''}`}>
          <div className="space-y-3 sm:space-y-4">
            {/* Stadium Name and Score */}
            <div className="flex items-start justify-between">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide group-hover:text-blue-200 transition-colors flex items-center gap-2">
                <span>🏟️</span> {match.stadium.name}
              </h3>
            
            </div>

            {/* Match Details Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2 text-gray-100">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm sm:text-base font-medium">{match.matchTime}</p>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gray-500/30"></div>
              <div className="flex items-center gap-1 sm:gap-2 text-gray-100">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm sm:text-base font-medium">{match.matchDay}</p>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gray-500/30"></div>
              <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-white/10 text-white backdrop-blur-sm flex items-center">
                ⚽ {match.stadium.maxPlayers / 2} vs {match.stadium.maxPlayers / 2}
              </span>

              
            </div>
           
            {/* Location Link */}
            <a 
              href={match.stadium.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm sm:text-base text-blue-300 hover:text-blue-200 transition-colors"
            >
              <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
              <span className="hidden xs:inline">რუკა</span>
              <span className="xs:hidden">რუკა</span>
            </a>

              {isFinished && (
              
                 
                  <span className="ml-14 sm:ml-20 text-lg font-bold text-green-400 bg-black/30 px-2 py-1 rounded">
                    {match.score.team1} : {match.score.team2}
                  </span>
               
              )}
          </div>
        
          <div className="button-group flex gap-1 sm:gap-2 mt-3 sm:mt-4 justify-between">
            {/* Formation button */}
            <Tooltip text="შემადგენლობის ნახვა" position="right">
              <button 
                onClick={() => onViewFormation(match.team1Players, match.team2Players)}
                className="mobile-touch-target inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200/30 text-xs sm:text-sm font-medium rounded-md text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                aria-label="View formation"
              >
                <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                <span className="action-label hidden sm:inline"></span>
              </button>
            </Tooltip>
            
            {/* Edit button */}
            <Tooltip text="შემადგენლობის შეცვლა" position="top">
              <button
                onClick={() => onEdit(match.id)}
                className="mobile-touch-target inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200/30 text-xs sm:text-sm font-medium rounded-md text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                aria-label="Edit match"
              >
                <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                <span className="action-label hidden sm:inline"></span>
              </button>
            </Tooltip>
            
            {/* Delete button */}
            <Tooltip text="მატჩის წაშლა" position="top">
              <button
                onClick={handleDelete}
                className="mobile-touch-target inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-red-300/30 text-xs sm:text-sm font-medium rounded-md text-red-100 bg-red-500/10 backdrop-blur-sm hover:bg-red-500/20 transition-colors"
                aria-label="Delete match"
              >
                <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                <span className="action-label hidden sm:inline"></span>
              </button>
            </Tooltip>

            {/* Finish button */}
            <Tooltip text="მატჩის ანგარიში" position="left">
              <button
                onClick={handleFinish}
                className={`mobile-touch-target inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border text-xs sm:text-sm font-medium rounded-md backdrop-blur-sm transition-colors ${
                  isFinished 
                    ? 'border-green-500/50 text-green-200 bg-green-500/30 hover:bg-green-500/40' 
                    : 'border-yellow-300/30 text-yellow-100 bg-yellow-500/10 hover:bg-yellow-500/20'
                }`}
                aria-label={isFinished ? "Edit score" : "Finish match"}
              >
                <TrophyIcon className={`h-4 w-4 sm:h-5 sm:w-5 mr-1 ${isFinished ? 'text-green-300' : 'text-yellow-300'}`} />
                <span className="action-label hidden sm:inline"></span>
              </button>
            </Tooltip>
          
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelDelete();
            }
          }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-center text-white">წავშალო მატჩი?</h3>
                <button
                  onClick={cancelDelete}
                  className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

   

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-black/20 flex space-x-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors"
              >
                გაუქმება
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                წაშლა
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score Modal */}
      {showScoreModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelScore();
            }
          }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">ანგარიში</h3>
                <button
                  onClick={cancelScore}
                  className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-4 py-3">
              <div className="space-y-3">
                
                {/* Score Input */}
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-center">
                    <label className="block text-white text-xs font-medium mb-1">
                      გუნდი 1
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={team1Score}
                      onChange={(e) => setTeam1Score(e.target.value)}
                      className="w-14 h-10 text-center text-lg font-bold bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  
                  <span className="text-xl font-bold text-white mt-4">:</span>
                  
                  <div className="text-center">
                    <label className="block text-white text-xs font-medium mb-1">
                      გუნდი 2
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={team2Score}
                      onChange={(e) => setTeam2Score(e.target.value)}
                      className="w-14 h-10 text-center text-lg font-bold bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-black/20 flex space-x-3 justify-between">
              <button
                onClick={cancelScore}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors"
              >
                გაუქმება
              </button>
              <button
                onClick={saveScore}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
              >
                შენახვა
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchCard;
