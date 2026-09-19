export type MenuItem = { name: string; price: string; note?: string; category: string };

export const siteConfig = {
  tagline: 'beware you will go mad.',
  currency: '৳',
  location: 'Chittagong / Bangladesh',
  contact: {
    address: ['14 Food Street', 'Chittagong, Bangladesh'],
    phone: '+880 1712 345 678',
    hours: ['Every day', '11:00 AM to 11:00 PM'],
    whatsapp: 'https://wa.me/8801712345678',
  },
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Inside the Wrap', href: '/inside' },
  { label: 'Menu', href: '/menu' },
  { label: 'Contact', href: '/contact' },
];

export const ingredients = [
  { id: 'flatbread', label: 'Warm flatbread', image: '/ingredients/flatbread.svg', desc: 'Soft, toasted, ready for trouble.' },
  { id: 'sauce', label: 'Garlic sauce', image: '/ingredients/garlic-sauce.svg', desc: 'The creamy part that starts the spiral.' },
  { id: 'chicken', label: 'Juicy chicken', image: '/ingredients/chicken.svg', desc: 'Spiced, charred, shaved thin.' },
  { id: 'pickles', label: 'Pickles', image: '/ingredients/pickles.svg', desc: 'A bright little snap.' },
  { id: 'tomato', label: 'Tomato', image: '/ingredients/tomato.svg', desc: 'Red, ripe, no shyness.' },
  { id: 'lettuce', label: 'Fresh veg', image: '/ingredients/lettuce.svg', desc: 'Crunch to keep things moving.' },
  { id: 'fries', label: 'Crispy fries', image: '/ingredients/fries.svg', desc: 'Because inside is better.' },
  { id: 'red-sauce', label: 'Red sauce', image: '/ingredients/red-sauce.svg', desc: 'One last hit of heat.' },
];

export const areas = [
  { name: 'GEC Circle', image: '/ingredients/area-gec.svg' },
  { name: 'Nasirabad', image: '/ingredients/area-nasirabad.svg' },
  { name: 'Agrabad', image: '/ingredients/area-agrabad.svg' },
  { name: 'Khulshi', image: '/ingredients/area-khulshi.svg' },
  { name: 'Halishahar', image: '/ingredients/area-halishahar.svg' },
];

export const menuCategories = [
  'Shawarmas', 'Wraps', 'Cone Crave', 'Specials', 'Add Ons', 'Grills and Kababs',
  'Breads', 'Arabian Broast Chickens', 'Mad Fries', 'Wings', 'Drinks',
];

export const menuItems: MenuItem[] = [
  { category: 'Shawarmas', name: 'Classic Shawarma', price: '150' },
  { category: 'Shawarmas', name: 'Cheesy Shawarma', price: '220' },
  { category: 'Shawarmas', name: 'Arabian Shawarma', price: '250' },
  { category: 'Wraps', name: 'BBQ Wrap', price: '250' }, { category: 'Wraps', name: 'Kabab Wrap', price: '300' },
  { category: 'Cone Crave', name: 'BBQ Meat Cone', price: '150' }, { category: 'Cone Crave', name: 'Cheesy Meat Cone', price: '200' },
  { category: 'Specials', name: 'Arabian Sandwich', price: '250' }, { category: 'Specials', name: 'Danish Chicken', price: '250' }, { category: 'Specials', name: 'Chicken Pop Corn', price: '300' },
  { category: 'Add Ons', name: 'Mayo', price: '30' }, { category: 'Add Ons', name: 'Red Sauce', price: '20' },
  { category: 'Grills and Kababs', name: 'Arabian Grilled Chicken', price: '200' }, { category: 'Grills and Kababs', name: 'Arabian Chicken Chap', price: '220' },
  { category: 'Breads', name: 'Parata', price: '30' }, { category: 'Breads', name: 'Pita Nan', price: '30' },
  { category: 'Arabian Broast Chickens', name: 'Classic Broast', price: '150' }, { category: 'Arabian Broast Chickens', name: 'Arabian Spicy Broast', price: '180' }, { category: 'Arabian Broast Chickens', name: 'Arabian Saucy Broast', price: '200' },
  { category: 'Mad Fries', name: 'Mad Fries Small', price: '150' }, { category: 'Mad Fries', name: 'Mad Fries Large', price: '200' },
  { category: 'Wings', name: 'Arabian Crispy Wings', price: '300', note: '5 pcs' }, { category: 'Wings', name: 'Lebanese Wings', price: '350', note: '6 pcs' },
  { category: 'Drinks', name: 'Water', price: '20' }, { category: 'Drinks', name: 'Beverage', price: '20 / 25' }, { category: 'Drinks', name: 'Laban', price: '99' },
];