import type { Lang } from '@/lib/translations';

export type Localized = Record<Lang, string>;

export type MenuCategory = 'Classic' | 'Chocolate' | 'Matcha' | 'Fruit';

export interface StoreMenuItem {
  id: string;
  name: Localized;
  description: Localized;
  category: MenuCategory;
  price: number;
  image: string;
}

/**
 * Shop details for the storefront.
 *
 * TODO: fill these in. Everything left blank degrades gracefully, so the page
 * never ships a dead button or an empty labelled box:
 *   - lineId blank  → the order tray copies the order and opens LINE instead of
 *                     deep-linking a chat.
 *   - address blank → the Visit card drops the address row and the directions button.
 *   - hours blank   → the Visit card asks customers to call ahead.
 *   - phone blank   → call buttons are not rendered.
 *
 * `lineId` takes a LINE Official Account id, e.g. '@barnwaffles'.
 */
export const SHOP = {
  name: 'Barn Waffles',
  nameTh: 'บ้าน Waffles',
  phone: '094-996-9853',
  lineId: '',
  address: '',
  /** Optional explicit Maps query; falls back to `address`. */
  mapsQuery: '',
  hours: [] as { day: Localized; open: string; close: string }[],
};

export const MENU: StoreMenuItem[] = [
  {
    id: 'classic',
    category: 'Classic',
    price: 89,
    image:
      'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=900&q=80',
    name: { en: 'Classic Waffle', th: 'วาฟเฟิลคลาสสิก' },
    description: {
      en: 'Butter waffle with a pearl-sugar crust, maple syrup on the side.',
      th: 'วาฟเฟิลเนยหอม กรอบน้ำตาลเพิร์ล เสิร์ฟไซรัปเมเปิลแยกถ้วย',
    },
  },
  {
    id: 'chocolate',
    category: 'Chocolate',
    price: 109,
    image:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80',
    name: { en: 'Chocolate Waffle', th: 'วาฟเฟิลช็อกโกแลต' },
    description: {
      en: 'Dark chocolate sauce, cocoa nibs, a pinch of sea salt.',
      th: 'ซอสดาร์กช็อกโกแลต เกล็ดโกโก้ เกลือทะเลเล็กน้อย',
    },
  },
  {
    id: 'matcha',
    category: 'Matcha',
    price: 119,
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
    name: { en: 'Matcha Waffle', th: 'วาฟเฟิลมัทฉะ' },
    description: {
      en: 'Matcha batter with a white chocolate drizzle.',
      th: 'เนื้อวาฟเฟิลมัทฉะ เสิร์ฟกับไวต์ช็อกโกแลต',
    },
  },
  {
    id: 'strawberry',
    category: 'Fruit',
    price: 119,
    image:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80',
    name: { en: 'Strawberry Waffle', th: 'วาฟเฟิลสตรอว์เบอร์รี' },
    description: {
      en: 'Fresh strawberries, whipped cream, strawberry jam.',
      th: 'สตรอว์เบอร์รีสด วิปครีม แยมสตรอว์เบอร์รี',
    },
  },
];

export const CATEGORIES: MenuCategory[] = ['Classic', 'Chocolate', 'Matcha', 'Fruit'];

export const hasPhone = SHOP.phone.trim().length > 0;
export const hasAddress = SHOP.address.trim().length > 0;

export function telHref() {
  return `tel:${SHOP.phone.replace(/[^\d+]/g, '')}`;
}

/** LINE chat URL, with an optional prefilled message for the order tray. */
export function lineChatUrl(message?: string) {
  const base = SHOP.lineId ? `https://line.me/R/oaMessage/${SHOP.lineId}/` : 'https://line.me/';
  return message ? `${base}?${encodeURIComponent(message)}` : base;
}

export function directionsUrl() {
  const query = SHOP.mapsQuery || SHOP.address;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Prices are whole baht; `narrowSymbol` keeps the ฿ sign in both locales. */
export function formatPrice(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: 'THB',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Clipboard with a fallback for browsers that block the async API. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand('copy');
    field.remove();
    return ok;
  } catch {
    return false;
  }
}
