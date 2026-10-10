import { Company, Product, PriceObservation, Offer, Campaign, AIInsight, Alert } from '../types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'samsung',
    name: 'Samsung',
    slug: 'samsung',
    ticker: 'SMSN',
    logo: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=128&auto=format&fit=crop&q=80',
    isReference: true,
    marketShare: 21.4,
    productCount: 18,
    activeOffersCount: 6,
    lastMonitored: 'Just now',
    status: 'active',
    headquarters: 'Suwon, South Korea',
    website: 'https://www.samsung.com/in/',
    primaryColor: '#124E96'
  },
  {
    id: 'apple',
    name: 'Apple',
    slug: 'apple',
    ticker: 'AAPL',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=128&auto=format&fit=crop&q=80',
    isReference: false,
    marketShare: 19.8,
    productCount: 14,
    activeOffersCount: 4,
    lastMonitored: '3 mins ago',
    status: 'active',
    headquarters: 'Cupertino, California, USA',
    website: 'https://www.apple.com/in/',
    primaryColor: '#173B67'
  },
  {
    id: 'motorola',
    name: 'Motorola',
    slug: 'motorola',
    ticker: 'MSI',
    logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=128&auto=format&fit=crop&q=80',
    isReference: false,
    marketShare: 6.2,
    productCount: 12,
    activeOffersCount: 7,
    lastMonitored: '1 min ago',
    status: 'active',
    headquarters: 'Chicago, Illinois, USA',
    website: 'https://www.motorola.in/',
    primaryColor: '#001428'
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    slug: 'oneplus',
    ticker: 'OP',
    logo: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=128&auto=format&fit=crop&q=80',
    isReference: false,
    marketShare: 5.6,
    productCount: 9,
    activeOffersCount: 8,
    lastMonitored: '4 mins ago',
    status: 'active',
    headquarters: 'Shenzhen, China',
    website: 'https://www.oneplus.com/in',
    primaryColor: '#EB0029'
  },
  {
    id: 'pixel',
    name: 'Google Pixel',
    slug: 'google-pixel',
    ticker: 'GOOGL',
    logo: 'https://images.unsplash.com/photo-1573883431205-98b5f10aaedb?w=128&auto=format&fit=crop&q=80',
    isReference: false,
    marketShare: 4.8,
    productCount: 8,
    activeOffersCount: 5,
    lastMonitored: '6 mins ago',
    status: 'active',
    headquarters: 'Mountain View, California, USA',
    website: 'https://store.google.com/in/',
    primaryColor: '#4285F4'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-sam-s24u',
    companyId: 'samsung',
    name: 'Galaxy S24 Ultra',
    segment: 'Ultra Premium',
    currentPrice: 129999,
    msrp: 129999,
    currency: '₹',
    changePercent: 0,
    changeDirection: 'neutral',
    specsSummary: '6.8″ QHD+ Dynamic AMOLED 2X 120Hz, Snapdragon 8 Gen 3 for Galaxy, 200MP Quad Cam, 5000mAh, Titanium Frame',
    soc: 'Snapdragon 8 Gen 3 for Galaxy',
    ramStorage: '12GB / 256GB–1TB',
    camera: '200MP + 50MP (5×) + 12MP + 10MP (3×)',
    battery: '5000 mAh (45W wired)',
    lastUpdated: 'Live Active',
    sourceUrl: 'https://www.samsung.com/in/smartphones/galaxy-s24-ultra/'
  },
  {
    id: 'prod-sam-zfold6',
    companyId: 'samsung',
    name: 'Galaxy Z Fold6',
    segment: 'Foldable',
    currentPrice: 164999,
    msrp: 164999,
    currency: '₹',
    changePercent: 0,
    changeDirection: 'neutral',
    specsSummary: '7.6″ Dynamic AMOLED 2X 120Hz + 6.3″ Cover Screen, Snapdragon 8 Gen 3, 50MP Triple Cam, 4400mAh, S Pen support',
    soc: 'Snapdragon 8 Gen 3 for Galaxy',
    ramStorage: '12GB / 256GB–1TB',
    camera: '50MP + 10MP (3×) + 12MP',
    battery: '4400 mAh (25W wired)',
    lastUpdated: 'Live Active',
    sourceUrl: 'https://www.samsung.com/in/smartphones/galaxy-z-fold6/'
  },
  {
    id: 'prod-app-ip16pm',
    companyId: 'apple',
    name: 'iPhone 16 Pro Max',
    segment: 'Ultra Premium',
    currentPrice: 144900,
    msrp: 144900,
    currency: '₹',
    changePercent: 0,
    changeDirection: 'neutral',
    specsSummary: '6.9″ Super Retina XDR OLED 120Hz, Apple A18 Pro, 48MP Fusion Triple Cam (5× Tetraprism), Titanium Frame, Apple Intelligence',
    soc: 'Apple A18 Pro',
    ramStorage: '8GB / 256GB–1TB',
    camera: '48MP Fusion + 48MP Ultrawide + 12MP 5× Telephoto',
    battery: '4685 mAh (MagSafe 25W)',
    lastUpdated: 'Live Active',
    sourceUrl: 'https://www.apple.com/in/shop/buy-iphone/iphone-16-pro'
  },
  {
    id: 'prod-moto-edge50u',
    companyId: 'motorola',
    name: 'Motorola Edge 50 Ultra',
    segment: 'Ultra Premium',
    currentPrice: 59999,
    msrp: 69999,
    currency: '₹',
    changePercent: -14.3,
    changeDirection: 'down',
    specsSummary: '6.7″ Super HD 144Hz pOLED (Pantone Validated), Snapdragon 8s Gen 3, 50MP Triple Cam with 64MP 3× Periscope, 4500mAh, 125W TurboPower, Real Wood Finish',
    soc: 'Snapdragon 8s Gen 3',
    ramStorage: '16GB / 512GB',
    camera: '50MP OIS + 50MP Ultrawide + 64MP 3× Periscope',
    battery: '4500 mAh (125W wired, 50W wireless)',
    lastUpdated: 'Just now',
    sourceUrl: 'https://www.motorola.in/motorola-edge-50-ultra/p'
  },
  {
    id: 'prod-moto-razr50u',
    companyId: 'motorola',
    name: 'Motorola Razr 50 Ultra',
    segment: 'Foldable',
    currentPrice: 89999,
    msrp: 99999,
    currency: '₹',
    changePercent: -10.0,
    changeDirection: 'down',
    specsSummary: '6.9″ FHD+ 165Hz Foldable LTPO AMOLED + 4.0″ Quick View Cover Screen, Snapdragon 8s Gen 3, 50MP Dual Cam, 4000mAh',
    soc: 'Snapdragon 8s Gen 3',
    ramStorage: '12GB / 512GB',
    camera: '50MP Main OIS + 50MP 2× Telephoto',
    battery: '4000 mAh (45W TurboPower, 15W wireless)',
    lastUpdated: '5 mins ago',
    sourceUrl: 'https://www.motorola.in/motorola-razr-50-ultra/p'
  },
  {
    id: 'prod-op-12',
    companyId: 'oneplus',
    name: 'OnePlus 12',
    segment: 'Flagship',
    currentPrice: 64999,
    msrp: 69999,
    currency: '₹',
    changePercent: -7.1,
    changeDirection: 'down',
    specsSummary: '6.82″ 2K 120Hz ProXDR, Snapdragon 8 Gen 3, Hasselblad 4th Gen 50MP, 5400mAh, 100W SUPERVOOC',
    soc: 'Snapdragon 8 Gen 3',
    ramStorage: '16GB / 512GB',
    camera: '50MP Sony LYT-808 + 64MP Periscope + 48MP',
    battery: '5400 mAh (100W SUPERVOOC, 50W AIRVOOC)',
    lastUpdated: '8 mins ago',
    sourceUrl: 'https://www.oneplus.com/in/oneplus-12'
  },
  {
    id: 'prod-pix-9pro',
    companyId: 'pixel',
    name: 'Google Pixel 9 Pro',
    segment: 'Ultra Premium',
    currentPrice: 109999,
    msrp: 109999,
    currency: '₹',
    changePercent: 0,
    changeDirection: 'neutral',
    specsSummary: '6.3″ Super Actua LTPO OLED 120Hz, Google Tensor G4, 50MP Triple Cam with Gemini Nano on-device, 4700mAh',
    soc: 'Google Tensor G4',
    ramStorage: '16GB / 128GB–512GB',
    camera: '50MP + 48MP (5×) + 48MP Ultrawide',
    battery: '4700 mAh (27W wired)',
    lastUpdated: '12 mins ago',
    sourceUrl: 'https://store.google.com/in/product/pixel_9_pro'
  }
];

export const INITIAL_OBSERVATIONS: PriceObservation[] = [
  {
    id: 'obs-moto-1',
    productId: 'prod-moto-edge50u',
    productName: 'Motorola Edge 50 Ultra (16GB/512GB)',
    companyName: 'Motorola',
    price: 59999,
    previousPrice: 69999,
    currency: '₹',
    observedAt: 'Just now',
    sourceName: 'Motorola India Store',
    sourceUrl: 'https://www.motorola.in/motorola-edge-50-ultra/p',
    evidenceSnippet: '"Limited period offer: ₹10,000 instant discount on Motorola Edge 50 Ultra. Additional exchange bonus up to ₹5,000 on select Samsung/OnePlus devices."',
    discountType: 'Instant Price Reduction + Exchange Bonus'
  },
  {
    id: 'obs-1',
    productId: 'prod-op-12',
    productName: 'OnePlus 12 (16GB/512GB)',
    companyName: 'OnePlus',
    price: 64999,
    previousPrice: 69999,
    currency: '₹',
    observedAt: '12 mins ago',
    sourceName: 'Amazon India',
    sourceUrl: 'https://www.amazon.in/s?k=OnePlus+12+16GB+512GB',
    evidenceSnippet: '"Bank offer: ₹5,000 instant discount on OnePlus 12 with HDFC, ICICI, and SBI credit cards at checkout."',
    discountType: 'Bank Cashback + Direct Price Reduction'
  },
  {
    id: 'obs-2',
    productId: 'prod-pix-9pro',
    productName: 'Pixel 9 Pro (128GB)',
    companyName: 'Google Pixel',
    price: 109999,
    previousPrice: 109999,
    currency: '₹',
    observedAt: '25 mins ago',
    sourceName: 'Google Store India',
    sourceUrl: 'https://store.google.com/in/product/pixel_9_pro',
    evidenceSnippet: '"No-cost EMI available. Free 12-month Gemini Advanced subscription included with purchase on Google Store India."',
    discountType: 'Bundle: Gemini Advanced Subscription'
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-moto-1',
    companyId: 'motorola',
    companyName: 'Motorola',
    productName: 'Motorola Edge 50 Ultra',
    title: 'Flat ₹10,000 Off + Free Moto Buds+ (₹6,999 value) + ₹5,000 Exchange Bonus',
    type: 'Bundle',
    discountValue: '₹21,999 total savings',
    validUntil: 'May 31, 2026',
    description: 'Instant ₹10,000 price cut on Edge 50 Ultra with free Moto Buds+ earphones. Additional ₹5,000 exchange bonus on Galaxy S22 or older devices.',
    sourceName: 'Motorola India Store',
    sourceUrl: 'https://www.motorola.in/motorola-edge-50-ultra/p',
    status: 'active'
  },
  {
    id: 'off-1',
    companyId: 'oneplus',
    companyName: 'OnePlus',
    productName: 'OnePlus 12',
    title: 'Bank Cashback + No-Cost EMI: Up to ₹5,000 Instant Off',
    type: 'Instant Cashback',
    discountValue: '₹5,000 cashback',
    validUntil: 'April 30, 2026',
    description: '₹5,000 instant discount with HDFC, ICICI & SBI credit cards. 24-month no-cost EMI available. Targeted at Samsung Galaxy and Apple iPhone switchers.',
    sourceName: 'Amazon India',
    sourceUrl: 'https://www.amazon.in/s?k=OnePlus+12+16GB+512GB',
    status: 'active'
  },
  {
    id: 'off-2',
    companyId: 'pixel',
    companyName: 'Google Pixel',
    productName: 'Pixel 9 Pro',
    title: 'Free 12-Month Gemini Advanced + No-Cost EMI up to 24 Months',
    type: 'Bundle',
    discountValue: '₹14,388 value',
    validUntil: 'May 15, 2026',
    description: 'Includes 1-year Gemini Advanced access (₹1,199/month value = ₹14,388). Includes Google One AI Premium tier. No-cost EMI across all major Indian banks.',
    sourceName: 'Google Store India',
    sourceUrl: 'https://store.google.com/in/product/pixel_9_pro',
    status: 'active'
  },
  {
    id: 'off-3',
    companyId: 'apple',
    companyName: 'Apple',
    productName: 'iPhone 16 Pro Max',
    title: 'No-Cost EMI up to 24 Months + ₹5,000 Exchange Bonus',
    type: '0% Financing',
    discountValue: '0% Interest + ₹5,000',
    validUntil: 'Ongoing',
    description: 'Zero-cost EMI across HDFC, Axis, and ICICI bank cards. Exchange bonus of up to ₹5,000 on select older iPhones at Apple Authorised Resellers.',
    sourceName: 'Apple India',
    sourceUrl: 'https://www.apple.com/in/shop/buy-iphone/iphone-16-pro',
    status: 'active'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-moto-1',
    companyId: 'motorola',
    companyName: 'Motorola',
    headline: 'Why Wait 45 Minutes? 125W Fast Charge in 19 Mins.',
    platform: 'YouTube',
    audienceTarget: 'High-volume smartphone users, Tech early adopters',
    keyHook: 'Direct comparative speed: 125W charge vs 25W/45W of Galaxy S24 and iPhone 16',
    detectedAt: 'Just now',
    landingPageUrl: 'https://www.motorola.in/motorola-edge-50-ultra/p',
    adMediaUrl: 'https://www.youtube.com/results?search_query=Motorola+Edge+50+Ultra+Official+Ad+India',
    adMediaLabel: 'Watch Motorola YouTube Ads 🎥',
    estimatedSpendTier: '₹50L-₹2.5Cr'
  },
  {
    id: 'camp-moto-2',
    companyId: 'motorola',
    companyName: 'Motorola',
    headline: 'Intelligence Meets Art: Real Wood Finish, 125W Charging.',
    platform: 'Meta',
    audienceTarget: 'Design enthusiasts, Tech switchers, Business executives',
    keyHook: 'Real Nordic Wood back panel & 125W charge (0–100% in 19 mins) vs 45W Samsung',
    detectedAt: '10 mins ago',
    landingPageUrl: 'https://www.motorola.in/motorola-edge-50-ultra/p',
    adMediaUrl: 'https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=IN&q=Motorola+Edge+50+Ultra',
    adMediaLabel: 'Inspect Meta Ad Archive 📘',
    estimatedSpendTier: '₹50L-₹2.5Cr'
  },
  {
    id: 'camp-1',
    companyId: 'apple',
    companyName: 'Apple',
    headline: 'Say Hello to Apple Intelligence.',
    platform: 'YouTube',
    audienceTarget: 'High-income professionals, Tech enthusiasts',
    keyHook: 'On-device private AI, Siri revamp, Writing Tools & Genmoji',
    detectedAt: '2 hours ago',
    landingPageUrl: 'https://www.apple.com/in/apple-intelligence/',
    adMediaUrl: 'https://www.youtube.com/results?search_query=Apple+Intelligence+Official+Ad',
    adMediaLabel: 'Watch Apple YouTube Ad 🎥',
    estimatedSpendTier: '₹2.5Cr+'
  },
  {
    id: 'camp-2',
    companyId: 'pixel',
    companyName: 'Google Pixel',
    headline: 'Ask more of your phone with Gemini Live.',
    platform: 'Google Ads',
    audienceTarget: 'Android switchers, Creators, Productivity users',
    keyHook: 'Real-time conversational camera assistance & Magic Editor powered by Gemini',
    detectedAt: '6 hours ago',
    landingPageUrl: 'https://store.google.com/in/product/pixel_9_pro',
    adMediaUrl: 'https://adstransparency.google.com/?region=any&q=Google+Pixel',
    adMediaLabel: 'Google Ad Archive 🎥',
    estimatedSpendTier: '₹50L-₹2.5Cr'
  },
  {
    id: 'camp-3',
    companyId: 'oneplus',
    companyName: 'OnePlus',
    headline: 'Flagship Killer: Double the RAM, Half the Price.',
    platform: 'Instagram',
    audienceTarget: 'Gamers, Price-to-performance shoppers, Young professionals',
    keyHook: '16GB RAM standard vs 8GB on iPhone 16 Pro Max; ₹64,999 vs ₹1,44,900',
    detectedAt: '12 hours ago',
    landingPageUrl: 'https://www.oneplus.com/in/oneplus-12',
    adMediaUrl: 'https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=IN&q=OnePlus+12',
    adMediaLabel: 'Inspect Instagram Ad Archive 📸',
    estimatedSpendTier: '₹10L-₹50L'
  }
];

export const INITIAL_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-moto-1',
    title: 'Motorola Edge 50 Ultra at ₹59,999 Directly Challenges Galaxy S24 Upper Mid-Segment',
    urgency: 'high',
    category: 'Pricing Pressure',
    competitorAffected: 'Motorola',
    summary: 'Motorola cut the Edge 50 Ultra from ₹69,999 to ₹59,999 in India (14.3% reduction) with free Moto Buds+ and a ₹5,000 exchange bonus. With 125W fast charging, 16GB RAM, and real wood finish, this directly threatens Samsung Galaxy S24 FE and Galaxy S24 volumes in the ₹55,000–₹70,000 price band.',
    strategicImpact: 'Risk of conversion leakage from Galaxy S24 FE and S24 buyers prioritising fast charging speed and differentiated materials. The free earphones further increase perceived value advantage.',
    suggestedAction: 'Deploy a defensive ₹5,000 trade-in booster for Galaxy S24 FE on Flipkart & Amazon India. Run comparison ads highlighting Samsung 7-year OS update guarantee and Galaxy AI ecosystem lock-in benefits.',
    sourceEvidence: {
      sourceName: 'Motorola India Store — Live Product Page',
      url: 'https://www.motorola.in/motorola-edge-50-ultra/p',
      observedValue: '₹59,999 (Reduced from ₹69,999)',
      date: 'Live Telemetry'
    },
    generatedAt: 'Just now'
  },
  {
    id: 'ins-1',
    title: 'OnePlus 12 Bank Cashback at ₹64,999 Targeting Samsung Android Switchers',
    urgency: 'high',
    category: 'Pricing Pressure',
    competitorAffected: 'OnePlus',
    summary: 'OnePlus 12 is available at an effective price of ₹64,999 after ₹5,000 bank cashback on Amazon India, positioned directly against Galaxy S24+. With Snapdragon 8 Gen 3, 16GB RAM, 100W SuperVOOC, and 5400mAh battery, the value proposition significantly exceeds Samsung\'s offering at this price point.',
    strategicImpact: 'Expect migration pressure among value-conscious online buyers in metro India who prioritise raw performance and battery life over ecosystem integration.',
    suggestedAction: 'Bundle Galaxy Buds FE or Galaxy Watch FE with Galaxy S24+ purchases on Flipkart Big Billion Days and offer ₹3,000 Amazon Pay credit to lock-in preference.',
    sourceEvidence: {
      sourceName: 'Amazon India — OnePlus 12 Live Listing',
      url: 'https://www.amazon.in/s?k=OnePlus+12+16GB+512GB',
      observedValue: '₹64,999 effective (after bank cashback)',
      date: 'Verified'
    },
    generatedAt: '15 mins ago'
  },
  {
    id: 'ins-2',
    title: 'Google Pixel 9 Pro Bundling 12-Month Gemini Advanced to Defend AI Leadership in India',
    urgency: 'medium',
    category: 'Promotional Threat',
    competitorAffected: 'Google Pixel',
    summary: 'Google is offering 12 months of Gemini Advanced (₹1,199/month, valued at ₹14,388) with every Pixel 9 Pro purchase at ₹1,09,999 on Google Store India — the only flagship with a bundled AI subscription at launch, creating a differentiated value narrative versus Galaxy AI.',
    strategicImpact: 'Appeals to India\'s rapidly growing developer and AI-aware professional segment who are comparing Samsung Galaxy AI vs. native Gemini integration depth.',
    suggestedAction: 'Highlight Samsung Galaxy AI features that don\'t require a subscription (Circle to Search, Live Translate, Chat Assist, Notes Assist) in digital ad campaigns. Promote on tech forums like XDA, Reddit India, and YouTube tech reviews.',
    sourceEvidence: {
      sourceName: 'Google Store India — Pixel 9 Pro Product Page',
      url: 'https://store.google.com/in/product/pixel_9_pro',
      observedValue: '12-month Gemini Advanced included (₹14,388 value)',
      date: 'Verified'
    },
    generatedAt: '35 mins ago'
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt-moto-1',
    type: 'price_drop',
    title: 'Live Alert: Motorola Edge 50 Ultra dropped ₹10,000 to ₹59,999',
    message: 'Motorola India reduced Edge 50 Ultra from ₹69,999 to ₹59,999 with free Moto Buds+ bundle and ₹5,000 exchange bonus.',
    severity: 'urgent',
    timestamp: 'Just now',
    read: false,
    link: '/pricing',
    targetCompany: 'Motorola'
  },
  {
    id: 'alt-1',
    type: 'price_drop',
    title: 'Price Drop: OnePlus 12 effective price ₹64,999 after bank cashback',
    message: 'OnePlus & Amazon India activated ₹5,000 bank cashback on OnePlus 12 (HDFC, ICICI, SBI cards).',
    severity: 'urgent',
    timestamp: '15 mins ago',
    read: false,
    link: '/pricing',
    targetCompany: 'OnePlus'
  },
  {
    id: 'alt-2',
    type: 'new_offer',
    title: 'New Bundle: Google Pixel 9 Pro includes free 12-Month Gemini Advanced',
    message: 'Google added free Gemini Advanced subscription (₹14,388 value) with every Pixel 9 Pro purchase on Google Store India.',
    severity: 'warning',
    timestamp: '35 mins ago',
    read: false,
    link: '/pricing',
    targetCompany: 'Google Pixel'
  },
  {
    id: 'alt-3',
    type: 'campaign_launch',
    title: 'Major Campaign Detected: Apple Intelligence push on YouTube India',
    message: 'Apple launched heavy video ad spend on YouTube India highlighting Apple Intelligence on-device AI features.',
    severity: 'info',
    timestamp: '2 hours ago',
    read: true,
    link: '/campaigns',
    targetCompany: 'Apple'
  }
];

// Change history events (new data structure for changelog)
export interface ChangeEvent {
  id: string;
  type: 'price_change' | 'offer_added' | 'offer_expired' | 'campaign_detected' | 'spec_update' | 'insight_generated';
  competitorName: string;
  competitorId: string;
  productName?: string;
  fieldChanged: string;
  previousValue: string;
  newValue: string;
  detectedAt: string;
  sourceUrl: string;
  sourceName: string;
  verificationStatus: 'verified' | 'unverified' | 'pending';
}

export const INITIAL_CHANGE_EVENTS: ChangeEvent[] = [
  {
    id: 'chg-1',
    type: 'price_change',
    competitorName: 'Motorola',
    competitorId: 'motorola',
    productName: 'Motorola Edge 50 Ultra (16GB/512GB)',
    fieldChanged: 'Selling Price',
    previousValue: '₹69,999',
    newValue: '₹59,999',
    detectedAt: 'Just now',
    sourceUrl: 'https://www.motorola.in/motorola-edge-50-ultra/p',
    sourceName: 'Motorola India Store',
    verificationStatus: 'verified'
  },
  {
    id: 'chg-2',
    type: 'offer_added',
    competitorName: 'Motorola',
    competitorId: 'motorola',
    productName: 'Motorola Edge 50 Ultra',
    fieldChanged: 'Active Promotion',
    previousValue: 'No bundle offer',
    newValue: 'Free Moto Buds+ (₹6,999) + ₹5,000 Exchange Bonus',
    detectedAt: 'Just now',
    sourceUrl: 'https://www.motorola.in/motorola-edge-50-ultra/p',
    sourceName: 'Motorola India Store',
    verificationStatus: 'verified'
  },
  {
    id: 'chg-3',
    type: 'price_change',
    competitorName: 'OnePlus',
    competitorId: 'oneplus',
    productName: 'OnePlus 12 (16GB/512GB)',
    fieldChanged: 'Effective Price (with bank offer)',
    previousValue: '₹69,999',
    newValue: '₹64,999 (after ₹5,000 bank cashback)',
    detectedAt: '12 mins ago',
    sourceUrl: 'https://www.amazon.in/s?k=OnePlus+12+16GB+512GB',
    sourceName: 'Amazon India',
    verificationStatus: 'verified'
  },
  {
    id: 'chg-4',
    type: 'offer_added',
    competitorName: 'Google Pixel',
    competitorId: 'pixel',
    productName: 'Pixel 9 Pro',
    fieldChanged: 'Bundle Offer',
    previousValue: 'No subscription bundle',
    newValue: '12-Month Gemini Advanced included (₹14,388 value)',
    detectedAt: '35 mins ago',
    sourceUrl: 'https://store.google.com/in/product/pixel_9_pro',
    sourceName: 'Google Store India',
    verificationStatus: 'verified'
  },
  {
    id: 'chg-5',
    type: 'campaign_detected',
    competitorName: 'Apple',
    competitorId: 'apple',
    productName: 'iPhone 16 Pro',
    fieldChanged: 'Active Campaign',
    previousValue: 'No active campaign',
    newValue: 'Apple Intelligence YouTube campaign — $250k+ spend tier',
    detectedAt: '2 hours ago',
    sourceUrl: 'https://www.youtube.com/results?search_query=Apple+Intelligence+Official+Ad',
    sourceName: 'YouTube Ad Intelligence',
    verificationStatus: 'verified'
  },
  {
    id: 'chg-6',
    type: 'campaign_detected',
    competitorName: 'Motorola',
    competitorId: 'motorola',
    productName: 'Motorola Edge 50 Ultra',
    fieldChanged: 'Active Campaign',
    previousValue: 'No YouTube campaign',
    newValue: '"Why Wait 45 Minutes?" comparative charging speed campaign',
    detectedAt: 'Just now',
    sourceUrl: 'https://www.youtube.com/results?search_query=Motorola+Edge+50+Ultra+Official+Ad+India',
    sourceName: 'YouTube Ad Intelligence',
    verificationStatus: 'verified'
  }
];
