import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export type HazardReport = {
  hazardType: string;
  severity: string;
  description: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
};

export const submitHazardReport = async (report: HazardReport) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  return await addDoc(collection(db, "hazardReports"), {
    ...report,
    userId: user.uid,
    userEmail: user.email,
    status: "submitted",
    createdAt: serverTimestamp(),
  });
};

export const getUserHazardReports = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  const q = query(
    collection(db, "hazardReports"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    source: "online",
  }));
};
