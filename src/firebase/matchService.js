import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Collection name for matches
const MATCHES_COLLECTION = 'matches';

// Save or update a match
export const saveMatch = async (matchData) => {
  try {
    const matchRef = doc(db, MATCHES_COLLECTION, matchData.id);
    const dataToSave = {
      ...matchData,
      updatedAt: serverTimestamp(),
      createdAt: matchData.createdAt || serverTimestamp()
    };
    
    await setDoc(matchRef, dataToSave);
    console.log('Match saved successfully:', matchData.id);
    return true;
  } catch (error) {
    console.error('Error saving match:', error);
    return false;
  }
};

// Delete a match
export const deleteMatch = async (matchId) => {
  try {
    await deleteDoc(doc(db, MATCHES_COLLECTION, matchId));
    console.log('Match deleted successfully:', matchId);
    return true;
  } catch (error) {
    console.error('Error deleting match:', error);
    return false;
  }
};

// Update match score
export const updateMatchScore = async (matchId, score) => {
  try {
    const matchRef = doc(db, MATCHES_COLLECTION, matchId);
    await updateDoc(matchRef, {
      score: score,
      updatedAt: serverTimestamp()
    });
    console.log('Match score updated successfully:', matchId);
    return true;
  } catch (error) {
    console.error('Error updating match score:', error);
    return false;
  }
};

// Subscribe to real-time match updates
export const subscribeToMatches = (callback) => {
  const matchesRef = collection(db, MATCHES_COLLECTION);
  
  const unsubscribe = onSnapshot(matchesRef, (snapshot) => {
    const matches = [];
    snapshot.forEach((doc) => {
      matches.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by creation date (newest first)
    matches.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
    
    callback(matches);
  }, (error) => {
    console.error('Error listening to matches:', error);
    callback([]); // Return empty array on error
  });

  return unsubscribe;
};

// Save multiple matches (batch operation)
export const saveMultipleMatches = async (matchesArray) => {
  try {
    const promises = matchesArray.map(match => saveMatch(match));
    await Promise.all(promises);
    console.log('All matches saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving multiple matches:', error);
    return false;
  }
};
