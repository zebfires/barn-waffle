import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  where,
  limit,
} from 'firebase/firestore';
import { db } from './config';
import type { MenuItem, Order, InventoryItem, Analytics, CalculatorItem } from '@/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function tsToString(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
}

// ── Menus ─────────────────────────────────────────────────────────────────────

export async function addMenu(data: Omit<MenuItem, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'menus'), { ...data, createdAt: serverTimestamp() });
}

export async function updateMenu(id: string, data: Partial<MenuItem>) {
  return updateDoc(doc(db, 'menus', id), data);
}

export async function deleteMenu(id: string) {
  return deleteDoc(doc(db, 'menus', id));
}

export function onMenusSnapshot(callback: (items: MenuItem[]) => void) {
  const q = query(collection(db, 'menus'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: tsToString(d.data().createdAt) } as MenuItem)));
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function addOrder(data: Omit<Order, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'orders'), { ...data, createdAt: serverTimestamp() });
}

export function onOrdersSnapshot(callback: (items: Order[]) => void) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: tsToString(d.data().createdAt) } as Order)));
  });
}

export async function deleteOrder(id: string) {
  return deleteDoc(doc(db, 'orders', id));
}

export async function deleteAllOrders() {
  const snap = await getDocs(collection(db, 'orders'));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}

export async function getRecentOrders(limitCount = 50): Promise<Order[]> {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: tsToString(d.data().createdAt) } as Order));
}

// ── Inventory ─────────────────────────────────────────────────────────────────

export async function addInventoryItem(data: Omit<InventoryItem, 'id'>) {
  return addDoc(collection(db, 'inventory'), data);
}

export async function updateInventoryItem(id: string, data: Partial<InventoryItem>) {
  return updateDoc(doc(db, 'inventory', id), data);
}

export async function deleteInventoryItem(id: string) {
  return deleteDoc(doc(db, 'inventory', id));
}

export function onInventorySnapshot(callback: (items: InventoryItem[]) => void) {
  return onSnapshot(collection(db, 'inventory'), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as InventoryItem)));
  });
}

// ── Auth Logs ────────────────────────────────────────────────────────────────

export async function logAuthEvent(uid: string, email: string, action: 'login' | 'register' | 'google') {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const { ip } = await res.json() as { ip: string };
    await addDoc(collection(db, 'logs'), {
      uid,
      email,
      action,
      ip,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      createdAt: serverTimestamp(),
    });
  } catch {
    // silently ignore — logging should never break auth flow
  }
}

// ── Shop Config ───────────────────────────────────────────────────────────────

export interface ShopConfig {
  promptPayId?: string; // phone number or national ID
}

export async function getShopConfig(): Promise<ShopConfig> {
  const snap = await getDoc(doc(db, 'config', 'shop'));
  return snap.exists() ? (snap.data() as ShopConfig) : {};
}

export async function setShopConfig(data: Partial<ShopConfig>) {
  return setDoc(doc(db, 'config', 'shop'), data, { merge: true });
}

export async function getAllMenus(): Promise<MenuItem[]> {
  const snap = await getDocs(collection(db, 'menus'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: tsToString(d.data().createdAt) } as MenuItem));
}

export async function getAllInventory(): Promise<InventoryItem[]> {
  const snap = await getDocs(collection(db, 'inventory'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as InventoryItem));
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export async function upsertAnalytics(date: string, data: Partial<Analytics>) {
  const ref = doc(db, 'analytics', date);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return updateDoc(ref, data);
  }
  return addDoc(collection(db, 'analytics'), { ...data, date });
}

export async function getAnalyticsRange(startDate: string, endDate: string): Promise<Analytics[]> {
  const q = query(
    collection(db, 'analytics'),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Analytics));
}

export function onAnalyticsSnapshot(callback: (items: Analytics[]) => void) {
  const q = query(collection(db, 'analytics'), orderBy('date', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Analytics)));
  });
}

// ── Calculator ────────────────────────────────────────────────────────────────

export async function saveCalculation(data: Omit<CalculatorItem, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'calculations'), { ...data, createdAt: serverTimestamp() });
}

export async function updateCalculation(id: string, data: Partial<CalculatorItem>) {
  return updateDoc(doc(db, 'calculations', id), data);
}

export async function deleteCalculation(id: string) {
  return deleteDoc(doc(db, 'calculations', id));
}

export function onCalculationsSnapshot(callback: (items: CalculatorItem[]) => void) {
  const q = query(collection(db, 'calculations'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: tsToString(d.data().createdAt) } as CalculatorItem)));
  });
}
