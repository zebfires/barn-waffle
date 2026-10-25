import type { Lang } from '@/lib/translations';
import type { MenuCategory } from './site';

interface Value {
  title: string;
  body: string;
}

interface Step {
  title: string;
  body: string;
}

export interface LandingCopy {
  skip: string;
  nav: {
    menu: string;
    story: string;
    visit: string;
    order: string;
    language: string;
    menuToggle: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    subtitle: string;
    primary: string;
    secondary: string;
    callPrefix: string;
    photoAlt: string;
    noteTitle: string;
    noteBody: string;
    stamp: string;
  };
  marquee: string[];
  menu: {
    eyebrow: string;
    title: string;
    subtitle: string;
    all: string;
    categories: Record<MenuCategory, string>;
    add: string;
    remove: string;
    empty: string;
  };
  tray: {
    title: string;
    itemOne: string;
    itemMany: string;
    total: string;
    send: string;
    clear: string;
    copied: string;
    copiedHint: string;
    copyFailed: string;
    copyFailedHint: string;
    readyHint: string;
    removeItem: string;
    empty: string;
  };
  story: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
    photoAlt: string;
    values: Value[];
  };
  how: {
    eyebrow: string;
    title: string;
    steps: Step[];
  };
  visit: {
    eyebrow: string;
    title: string;
    subtitle: string;
    hoursTitle: string;
    hoursEmpty: string;
    addressTitle: string;
    phoneTitle: string;
    lineTitle: string;
    directions: string;
    call: string;
    lineValue: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
  footer: {
    tagline: string;
    explore: string;
    contact: string;
    staff: string;
    rights: string;
    made: string;
  };
}

export const copy: Record<Lang, LandingCopy> = {
  en: {
    skip: 'Skip to content',
    nav: {
      menu: 'Menu',
      story: 'Our Story',
      visit: 'Visit',
      order: 'Order on LINE',
      language: 'Language',
      menuToggle: 'Open menu',
      closeMenu: 'Close menu',
    },
    hero: {
      eyebrow: 'Fresh from the iron, all day',
      titleBefore: 'Warm waffles,',
      titleAccent: 'made to order',
      subtitle:
        'Golden, butter-rich waffles with real pearl sugar — pressed after you order and wrapped while they’re still warm.',
      primary: 'Order on LINE',
      secondary: 'See the menu',
      callPrefix: 'or call',
      photoAlt: 'Golden waffles from Barn Waffles',
      noteTitle: 'Today’s batch',
      noteBody: 'Butter & pearl sugar, pressed to order',
      stamp: 'Fresh daily',
    },
    marquee: [
      'Belgian pearl sugar',
      'Pressed to order',
      'Real butter',
      'Fresh fruit',
      'Never held over',
      'Takeaway ready',
    ],
    menu: {
      eyebrow: 'The menu',
      title: 'Pick your waffle',
      subtitle:
        'A short list on purpose. Add what you want to the tray and send it over on LINE.',
      all: 'All',
      categories: {
        Classic: 'Classic',
        Chocolate: 'Chocolate',
        Matcha: 'Matcha',
        Fruit: 'Fruit',
      },
      add: 'Add',
      remove: 'Remove one',
      empty: 'Nothing in this category yet.',
    },
    tray: {
      title: 'Your order',
      itemOne: 'item',
      itemMany: 'items',
      total: 'Total',
      send: 'Send on LINE',
      clear: 'Clear',
      copied: 'Order copied',
      copiedHint: 'Paste it into our LINE chat and we’ll start pressing.',
      copyFailed: 'Couldn’t copy automatically',
      copyFailedHint: 'Your order is on screen — send it to us in LINE.',
      readyHint: 'We’ll confirm your pickup time in chat.',
      removeItem: 'Remove one',
      empty: 'Tap + on a waffle to start your order. It stays here until you send it.',
    },
    story: {
      eyebrow: 'Our story',
      title: 'A small barn, a hot iron, a short list',
      p1: 'We keep the menu short on purpose: a handful of waffles we can make properly, all day. Each one is mixed and pressed after you order.',
      p2: 'They leave the counter warm, in a box that travels well — still crisp by the time you get home.',
      photoAlt: 'The Barn Waffles logo',
      values: [
        {
          title: 'Pressed to order',
          body: 'Nothing sits under a lamp waiting for a customer.',
        },
        {
          title: 'Real ingredients',
          body: 'Butter, pearl sugar, fresh fruit — ingredients that already taste like themselves.',
        },
        {
          title: 'Built to travel',
          body: 'Boxed to stay crisp on the way home, or eaten at the counter.',
        },
      ],
    },
    how: {
      eyebrow: 'How to order',
      title: 'From the iron to your hands',
      steps: [
        {
          title: 'Pick your waffles',
          body: 'Tap + on the ones you want. The tray totals as you go.',
        },
        {
          title: 'Send it on LINE',
          body: 'We confirm the order in chat and tell you when it’s ready.',
        },
        {
          title: 'Collect at the barn',
          body: 'Come by at your pickup time and we’ll hand it over warm.',
        },
      ],
    },
    visit: {
      eyebrow: 'Visit',
      title: 'Find the barn',
      subtitle: 'Walk in, call ahead, or send your order on LINE first.',
      hoursTitle: 'Opening hours',
      hoursEmpty: 'Hours coming soon — call ahead to check.',
      addressTitle: 'Address',
      phoneTitle: 'Phone',
      lineTitle: 'LINE',
      directions: 'Get directions',
      call: 'Call the shop',
      lineValue: 'Chat with us on LINE',
    },
    cta: {
      eyebrow: 'Hungry yet?',
      title: 'Get your order in before the next batch',
      subtitle: 'Send it on LINE and we’ll start pressing.',
      primary: 'Order on LINE',
      secondary: 'Call the shop',
    },
    footer: {
      tagline: 'Golden waffles, pressed to order.',
      explore: 'Explore',
      contact: 'Contact',
      staff: 'Staff Login',
      rights: 'All rights reserved.',
      made: 'Made in small batches.',
    },
  },

  th: {
    skip: 'ข้ามไปที่เนื้อหา',
    nav: {
      menu: 'เมนู',
      story: 'เรื่องของเรา',
      visit: 'มาหาเรา',
      order: 'สั่งผ่าน LINE',
      language: 'ภาษา',
      menuToggle: 'เปิดเมนู',
      closeMenu: 'ปิดเมนู',
    },
    hero: {
      eyebrow: 'อบร้อน ๆ ทั้งวัน',
      titleBefore: 'วาฟเฟิลร้อน',
      titleAccent: 'อบตามออเดอร์',
      subtitle:
        'วาฟเฟิลเนยหอมสีทอง โรยน้ำตาลเพิร์ลแท้ อบใหม่หลังคุณสั่ง แล้วห่อให้ตอนยังร้อน',
      primary: 'สั่งผ่าน LINE',
      secondary: 'ดูเมนู',
      callPrefix: 'หรือโทร',
      photoAlt: 'วาฟเฟิลสีทองของบ้าน Waffles',
      noteTitle: 'รอบนี้เพิ่งออกจากเตา',
      noteBody: 'เนย + น้ำตาลเพิร์ล อบตามสั่ง',
      stamp: 'อบสดทุกวัน',
    },
    marquee: [
      'น้ำตาลเพิร์ลเบลเยียม',
      'อบตามออเดอร์',
      'เนยแท้',
      'ผลไม้สด',
      'ไม่ค้างคืน',
      'พร้อมพกกลับ',
    ],
    menu: {
      eyebrow: 'เมนู',
      title: 'เลือกวาฟเฟิลของคุณ',
      subtitle: 'ตั้งใจทำเมนูให้สั้น เพิ่มรายการที่อยากได้ลงถาด แล้วส่งออเดอร์ผ่าน LINE',
      all: 'ทั้งหมด',
      categories: {
        Classic: 'คลาสสิก',
        Chocolate: 'ช็อกโกแลต',
        Matcha: 'มัทฉะ',
        Fruit: 'ผลไม้',
      },
      add: 'เพิ่ม',
      remove: 'ลดหนึ่งชิ้น',
      empty: 'ยังไม่มีเมนูในหมวดนี้',
    },
    tray: {
      title: 'ออเดอร์ของคุณ',
      itemOne: 'รายการ',
      itemMany: 'รายการ',
      total: 'รวม',
      send: 'ส่งออเดอร์ทาง LINE',
      clear: 'ล้าง',
      copied: 'คัดลอกออเดอร์แล้ว',
      copiedHint: 'วางในแชท LINE ของเรา แล้วเราจะเริ่มอบให้เลย',
      copyFailed: 'คัดลอกอัตโนมัติไม่สำเร็จ',
      copyFailedHint: 'ออเดอร์อยู่ในหน้านี้แล้ว ส่งให้เราใน LINE ได้เลย',
      readyHint: 'เราจะยืนยันเวลารับในแชท',
      removeItem: 'ลดหนึ่งชิ้น',
      empty: 'กด + ที่เมนูเพื่อเริ่มสั่ง รายการจะค้างไว้ที่นี่จนกว่าจะส่ง',
    },
    story: {
      eyebrow: 'เรื่องของเรา',
      title: 'โรงนาเล็ก ๆ เตาร้อน ๆ เมนูสั้น ๆ',
      p1: 'เราเลือกทำเมนูให้สั้น เพราะอยากทำแต่ละอย่างให้ดี ทุกชิ้นผสมและอบหลังคุณสั่ง',
      p2: 'ออกจากเคาน์เตอร์ตอนยังร้อน ใส่กล่องที่พกง่าย ถึงบ้านก็ยังกรอบ',
      photoAlt: 'โลโก้บ้าน Waffles',
      values: [
        {
          title: 'อบตามสั่ง',
          body: 'ไม่มีอะไรนั่งรออยู่ใต้ตะเกียงรอลูกค้า',
        },
        {
          title: 'วัตถุดิบจริง',
          body: 'เนย น้ำตาลเพิร์ล ผลไม้สด วัตถุดิบไม่กี่อย่างที่รสชาติดีอยู่แล้ว',
        },
        {
          title: 'พกกลับง่าย',
          body: 'ใส่กล่องให้กรอบถึงบ้าน หรือจะกินที่ร้านก็ได้',
        },
      ],
    },
    how: {
      eyebrow: 'วิธีสั่ง',
      title: 'จากเตาร้อน ๆ ถึงมือคุณ',
      steps: [
        {
          title: 'เลือกวาฟเฟิล',
          body: 'กด + ที่เมนูที่อยากได้ ยอดรวมขึ้นที่ถาดด้านล่าง',
        },
        {
          title: 'ส่งทาง LINE',
          body: 'เรายืนยันออเดอร์ในแชท และบอกเวลาเสร็จ',
        },
        {
          title: 'มารับที่ร้าน',
          body: 'มารับตามเวลา เราจะยื่นให้ตอนยังร้อน',
        },
      ],
    },
    visit: {
      eyebrow: 'มาหาเรา',
      title: 'ที่ตั้งร้าน',
      subtitle: 'แวะหน้าร้าน โทรก่อน หรือส่งออเดอร์ทาง LINE ก่อนก็ได้',
      hoursTitle: 'เวลาเปิดร้าน',
      hoursEmpty: 'ยังไม่ระบุเวลาเปิดร้าน — โทรสอบถามได้เลย',
      addressTitle: 'ที่อยู่',
      phoneTitle: 'โทร',
      lineTitle: 'LINE',
      directions: 'เปิดแผนที่',
      call: 'โทรหาร้าน',
      lineValue: 'ทักเราทาง LINE',
    },
    cta: {
      eyebrow: 'หิวหรือยัง',
      title: 'ส่งออเดอร์ก่อนรอบต่อไปจะเริ่ม',
      subtitle: 'ส่งทาง LINE แล้วเราจะเริ่มอบให้เลย',
      primary: 'สั่งผ่าน LINE',
      secondary: 'โทรหาร้าน',
    },
    footer: {
      tagline: 'วาฟเฟิลสีทอง อบตามสั่ง',
      explore: 'เมนู',
      contact: 'ติดต่อ',
      staff: 'เข้าสู่ระบบพนักงาน',
      rights: 'สงวนลิขสิทธิ์',
      made: 'อบทีละน้อย',
    },
  },
};
