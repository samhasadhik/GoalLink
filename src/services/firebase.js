import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  addDoc,
  Timestamp
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable
} from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu-U65a5LQgQbw9YC6R_nqC4heOxZxp_k",
  authDomain: "goallink-79f43.firebaseapp.com",
  projectId: "goallink-79f43",
  storageBucket: "goallink-79f43.firebasestorage.app",
  messagingSenderId: "708449591335",
  appId: "1:708449591335:web:575006aef8ee8c474e6e02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ==================== AUTHENTICATION METHODS ====================

// Email/Password Authentication
export const signInWithEmail = signInWithEmailAndPassword;
export const signUpWithEmail = createUserWithEmailAndPassword;
export const logOut = signOut;
export const resetPassword = sendPasswordResetEmail;
export const updateUserProfile = updateProfile;

// Google Authentication
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = signInWithPopup;

// ==================== COLLECTION NAMES ====================
export const COLLECTIONS = {
  USERS: 'users',
  PLAYERS: 'players',
  CLUBS: 'clubs',
  OPPORTUNITIES: 'opportunities',
  APPLICATIONS: 'applications',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  SAVED_OPPORTUNITIES: 'savedOpportunities',
  NOTIFICATIONS: 'notifications',
  HIGHLIGHTS: 'highlights'
};

// ==================== CRUD OPERATIONS ====================

export const firebaseAPI = {
  // ========== USERS ==========
  createUser: async (userId, userData) => {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return userRef;
  },
  
  getUser: async (userId) => {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  updateUser: async (userId, userData) => {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now()
    });
  },
  
  deleteUser: async (userId) => {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await deleteDoc(userRef);
  },
  
  getAllUsers: async () => {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // ========== PLAYERS ==========
  createPlayer: async (playerId, playerData) => {
    const playerRef = doc(db, COLLECTIONS.PLAYERS, playerId);
    await setDoc(playerRef, {
      ...playerData,
      profileViews: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return playerRef;
  },
  
  getPlayer: async (playerId) => {
    const playerRef = doc(db, COLLECTIONS.PLAYERS, playerId);
    const docSnap = await getDoc(playerRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  updatePlayer: async (playerId, playerData) => {
    const playerRef = doc(db, COLLECTIONS.PLAYERS, playerId);
    await updateDoc(playerRef, {
      ...playerData,
      updatedAt: Timestamp.now()
    });
  },
  
  deletePlayer: async (playerId) => {
    const playerRef = doc(db, COLLECTIONS.PLAYERS, playerId);
    await deleteDoc(playerRef);
  },
  
  getAllPlayers: async () => {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PLAYERS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  getPlayersByPosition: async (position) => {
    const q = query(collection(db, COLLECTIONS.PLAYERS), where('position', '==', position));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  getPlayersByLocation: async (location) => {
    const q = query(collection(db, COLLECTIONS.PLAYERS), where('location', '==', location));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  incrementProfileViews: async (playerId) => {
    const playerRef = doc(db, COLLECTIONS.PLAYERS, playerId);
    const playerDoc = await getDoc(playerRef);
    const currentViews = playerDoc.data()?.profileViews || 0;
    await updateDoc(playerRef, {
      profileViews: currentViews + 1
    });
  },
  
  // ========== CLUBS ==========
  createClub: async (clubId, clubData) => {
    const clubRef = doc(db, COLLECTIONS.CLUBS, clubId);
    await setDoc(clubRef, {
      ...clubData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return clubRef;
  },
  
  getClub: async (clubId) => {
    const clubRef = doc(db, COLLECTIONS.CLUBS, clubId);
    const docSnap = await getDoc(clubRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  updateClub: async (clubId, clubData) => {
    const clubRef = doc(db, COLLECTIONS.CLUBS, clubId);
    await updateDoc(clubRef, {
      ...clubData,
      updatedAt: Timestamp.now()
    });
  },
  
  deleteClub: async (clubId) => {
    const clubRef = doc(db, COLLECTIONS.CLUBS, clubId);
    await deleteDoc(clubRef);
  },
  
  getAllClubs: async () => {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.CLUBS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // ========== OPPORTUNITIES ==========
  createOpportunity: async (opportunityData) => {
    const docRef = await addDoc(collection(db, COLLECTIONS.OPPORTUNITIES), {
      ...opportunityData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'active'
    });
    return docRef.id;
  },
  
  getOpportunity: async (opportunityId) => {
    const opportunityRef = doc(db, COLLECTIONS.OPPORTUNITIES, opportunityId);
    const docSnap = await getDoc(opportunityRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  updateOpportunity: async (opportunityId, opportunityData) => {
    const opportunityRef = doc(db, COLLECTIONS.OPPORTUNITIES, opportunityId);
    await updateDoc(opportunityRef, {
      ...opportunityData,
      updatedAt: Timestamp.now()
    });
  },
  
  deleteOpportunity: async (opportunityId) => {
    const opportunityRef = doc(db, COLLECTIONS.OPPORTUNITIES, opportunityId);
    await deleteDoc(opportunityRef);
  },
  
  getAllOpportunities: async () => {
    const q = query(collection(db, COLLECTIONS.OPPORTUNITIES), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  getOpportunitiesByClub: async (clubId) => {
    const q = query(
      collection(db, COLLECTIONS.OPPORTUNITIES), 
      where('clubId', '==', clubId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  getActiveOpportunities: async () => {
    const q = query(
      collection(db, COLLECTIONS.OPPORTUNITIES), 
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // ========== APPLICATIONS ==========
  createApplication: async (applicationData) => {
    const applicationId = `${applicationData.opportunityId}_${applicationData.playerId}`;
    const applicationRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId);
    await setDoc(applicationRef, {
      ...applicationData,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return applicationRef;
  },
  
  getApplication: async (applicationId) => {
    const applicationRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId);
    const docSnap = await getDoc(applicationRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  updateApplication: async (applicationId, applicationData) => {
    const applicationRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId);
    await updateDoc(applicationRef, {
      ...applicationData,
      updatedAt: Timestamp.now()
    });
  },
  
  deleteApplication: async (applicationId) => {
    const applicationRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId);
    await deleteDoc(applicationRef);
  },
  
  getApplicationsByPlayer: async (playerId) => {
    const q = query(
      collection(db, COLLECTIONS.APPLICATIONS), 
      where('playerId', '==', playerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  getApplicationsByOpportunity: async (opportunityId) => {
    const q = query(
      collection(db, COLLECTIONS.APPLICATIONS), 
      where('opportunityId', '==', opportunityId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // ========== SAVED OPPORTUNITIES ==========
  saveOpportunity: async (playerId, opportunityId) => {
    const savedId = `${playerId}_${opportunityId}`;
    const savedRef = doc(db, COLLECTIONS.SAVED_OPPORTUNITIES, savedId);
    await setDoc(savedRef, {
      playerId,
      opportunityId,
      savedAt: Timestamp.now()
    });
  },
  
  unsaveOpportunity: async (playerId, opportunityId) => {
    const savedId = `${playerId}_${opportunityId}`;
    const savedRef = doc(db, COLLECTIONS.SAVED_OPPORTUNITIES, savedId);
    await deleteDoc(savedRef);
  },
  
  getSavedOpportunities: async (playerId) => {
    const q = query(
      collection(db, COLLECTIONS.SAVED_OPPORTUNITIES), 
      where('playerId', '==', playerId)
    );
    const querySnapshot = await getDocs(q);
    const savedIds = querySnapshot.docs.map(doc => doc.data().opportunityId);
    
    // Fetch full opportunity details
    const opportunities = [];
    for (const oppId of savedIds) {
      const opp = await firebaseAPI.getOpportunity(oppId);
      if (opp) opportunities.push(opp);
    }
    return opportunities;
  },
  
  // ========== MESSAGES ==========
  sendMessage: async (conversationId, messageData) => {
    const messagesRef = collection(db, COLLECTIONS.MESSAGES);
    const docRef = await addDoc(messagesRef, {
      conversationId,
      ...messageData,
      timestamp: Timestamp.now(),
      isRead: false
    });
    return docRef.id;
  },
  
  getMessages: async (conversationId) => {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  markMessageAsRead: async (messageId) => {
    const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId);
    await updateDoc(messageRef, { isRead: true });
  },
  
  createConversation: async (participants) => {
    const conversationRef = await addDoc(collection(db, COLLECTIONS.CONVERSATIONS), {
      participants,
      lastMessage: '',
      lastMessageTime: Timestamp.now(),
      createdAt: Timestamp.now()
    });
    return conversationRef.id;
  },
  
  getConversations: async (userId) => {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  updateConversation: async (conversationId, lastMessage) => {
    const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
    await updateDoc(conversationRef, {
      lastMessage,
      lastMessageTime: Timestamp.now()
    });
  },
  
  // ========== NOTIFICATIONS ==========
  createNotification: async (notificationData) => {
    const notificationRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
      ...notificationData,
      isRead: false,
      createdAt: Timestamp.now()
    });
    return notificationRef.id;
  },
  
  getNotifications: async (userId) => {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  markNotificationAsRead: async (notificationId) => {
    const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(notificationRef, { isRead: true });
  },
  
  markAllNotificationsAsRead: async (userId) => {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const querySnapshot = await getDocs(q);
    const promises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, { isRead: true })
    );
    await Promise.all(promises);
  },
  
  // ========== STORAGE / FILE UPLOADS ==========
  uploadProfileImage: async (userId, file) => {
    const storageRef = ref(storage, `profile-images/${userId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  },
  
  uploadHighlightVideo: async (playerId, videoId, file) => {
    const storageRef = ref(storage, `highlights/${playerId}/${videoId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  },
  
  deleteFile: async (filePath) => {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  },
  
  // ========== SEARCH ==========
  searchPlayers: async (searchTerm) => {
    const playersRef = collection(db, COLLECTIONS.PLAYERS);
    const querySnapshot = await getDocs(playersRef);
    const players = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter by search term
    return players.filter(player => 
      player.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
  
  searchOpportunities: async (searchTerm) => {
    const opportunitiesRef = collection(db, COLLECTIONS.OPPORTUNITIES);
    const querySnapshot = await getDocs(opportunitiesRef);
    const opportunities = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return opportunities.filter(opp =>
      opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.clubName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
};

export default app;