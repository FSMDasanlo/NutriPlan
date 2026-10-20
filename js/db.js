import { firebaseConfig } from "./firebase-config.js";

const FB = "https://www.gstatic.com/firebasejs/10.12.2";
export const isCloud = !Object.values(firebaseConfig).some((v) => String(v).includes("PEGA_AQUI"));

const LS_KEY = "nutriplan_days_v1";

// ---------- modo local ----------
const local = {
  async init(onUser) { onUser({ uid: "local", name: "Modo local" }); },
  async signIn() {},
  async signOut() {},
  async getAll() {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  },
  async save(day) {
    const all = await this.getAll();
    all[day.date] = day;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  },
  async seed(days) {
    const all = await this.getAll();
    days.forEach((d) => { all[d.date] = d; });
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  },
};

// ---------- Firestore ----------
const cloud = {
  async init(onUser) {
    const [{ initializeApp }, auth, fs] = await Promise.all([
      import(`${FB}/firebase-app.js`),
      import(`${FB}/firebase-auth.js`),
      import(`${FB}/firebase-firestore.js`),
    ]);
    this.fs = fs;
    this.auth = auth;
    const app = initializeApp(firebaseConfig);
    this.a = auth.getAuth(app);
    this.db = fs.getFirestore(app);
    auth.onAuthStateChanged(this.a, (u) => {
      this.uid = u ? u.uid : null;
      onUser(u ? { uid: u.uid, name: u.displayName || u.email } : null);
    });
  },
  signIn() { return this.auth.signInWithPopup(this.a, new this.auth.GoogleAuthProvider()); },
  signOut() { return this.auth.signOut(this.a); },
  col() { return this.fs.collection(this.db, "users", this.uid, "days"); },
  async getAll() {
    const snap = await this.fs.getDocs(this.col());
    const out = {};
    snap.forEach((d) => { out[d.id] = d.data(); });
    return out;
  },
  save(day) { return this.fs.setDoc(this.fs.doc(this.col(), day.date), day); },
  async seed(days) {
    const batch = this.fs.writeBatch(this.db);
    days.forEach((d) => batch.set(this.fs.doc(this.col(), d.date), d));
    await batch.commit();
  },
};

export const db = isCloud ? cloud : local;
