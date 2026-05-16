import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export type HazardReport = {
  hazardType: string;
  severity: string;
  description: string;
  latitude: number;
  longitude: number;
};

export const submitHazardReport = async (report: HazardReport) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not logged in');
  }

  return await addDoc(collection(db, 'hazardReports'), {
    ...report,
    userId: user.uid,
    userEmail: user.email,
    status: 'submitted',
    createdAt: serverTimestamp(),
  });
};