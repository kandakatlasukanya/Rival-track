export interface Company {
  id: string;
  name: string;
  slug: string;
  ticker?: string;
  logo: string;
  isReference?: boolean;
  marketShare: number;
  productCount: number;
  activeOffersCount: number;
  lastMonitored: string;
  status: 'active' | 'updating' | 'warning';
  headquarters: string;
  website: string;
  primaryColor: string;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  segment: 'Ultra Premium' | 'Flagship' | 'Upper Mid-Range' | 'Foldable';
  currentPrice: number;
  msrp: number;
  currency: string;
  changePercent: number;
  changeDirection: 'up' | 'down' | 'neutral';
  specsSummary: string;
  soc: string;
  ramStorage: string;
  camera: string;
  battery: string;
  lastUpdated: string;
  sourceUrl: string;
}

export interface PriceObservation {
  id: string;
  productId: string;
  productName: string;
  companyName: string;
  price: number;
  previousPrice: number;
  currency: string;
  observedAt: string;
  sourceUrl: string;
  sourceName?: string;
  evidenceSnippet: string;
  discountType?: string;
}

export interface Offer {
  id: string;
  companyId: string;
  companyName: string;
  productId?: string;
  productName?: string;
  title: string;
  type: 'Instant Cashback' | 'Trade-in Bonus' | 'Bundle' | 'Seasonal Sale' | '0% Financing';
  discountValue: string;
  validUntil: string;
  description: string;
  sourceUrl: string;
  sourceName?: string;
  status: 'active' | 'expiring-soon' | 'expired';
}

export interface Campaign {
  id: string;
  companyId: string;
  companyName: string;
  headline: string;
  platform: 'Google Ads' | 'Meta' | 'YouTube' | 'X' | 'Instagram' | 'Billboard';
  audienceTarget: string;
  keyHook: string;
  detectedAt: string;
  landingPageUrl: string;
  adMediaUrl?: string;
  adMediaLabel?: string;
  estimatedSpendTier: '₹10L-₹50L' | '₹50L-₹2.5Cr' | '₹2.5Cr+';
}

export interface AIInsight {
  id: string;
  title: string;
  urgency: 'high' | 'medium' | 'low';
  category: 'Pricing Pressure' | 'Spec Advantage' | 'Promotional Threat' | 'Market Opportunity';
  competitorAffected: string;
  summary: string;
  strategicImpact: string;
  suggestedAction: string;
  sourceEvidence: {
    sourceName: string;
    url: string;
    observedValue: string;
    date: string;
  };
  generatedAt: string;
}

export interface Alert {
  id: string;
  type: 'price_drop' | 'new_offer' | 'campaign_launch' | 'spec_update';
  title: string;
  message: string;
  severity: 'urgent' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  link: string;
  targetCompany: string;
}

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

export interface UserSession {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyId: string;
  } | null;
}

// Helper: Format price in Indian Rupees
export const formatINR = (amount: number): string => {
  // Indian numbering system: 1,00,000 = one lakh
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  const parts = amount.toFixed(0).split('');
  const result: string[] = [];
  const len = parts.length;
  for (let i = 0; i < len; i++) {
    const fromRight = len - 1 - i;
    result.push(parts[i]);
    if (fromRight !== 0) {
      if (fromRight === 3) result.push(',');
      else if (fromRight > 3 && (fromRight - 3) % 2 === 0) result.push(',');
    }
  }
  return `₹${result.join('')}`;
};
