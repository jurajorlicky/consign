import { supabase } from './supabase';

interface AdminSettings {
  fee_percent: number;
  fee_fixed: number;
}

let cachedSettings: AdminSettings | null = null;

export async function getFees(): Promise<AdminSettings> {
  if (cachedSettings) {
    return cachedSettings;
  }

  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('fee_percent, fee_fixed')
      .single();

    if (error) {
      console.error('Error fetching admin settings:', error);
      // Return default values if no settings found
      return { fee_percent: 0.2, fee_fixed: 5 };
    }

    if (data) {
      cachedSettings = {
        fee_percent: data.fee_percent,
        fee_fixed: data.fee_fixed
      };
      return cachedSettings;
    }

    // Default values if no settings found
    return { fee_percent: 0.2, fee_fixed: 5 };
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return { fee_percent: 0.2, fee_fixed: 5 };
  }
}

export function calculatePayout(price: number, feePercent: number, feeFixed: number): number {
  const result = price * (1 - feePercent) - feeFixed;
  return Math.max(0, result); // Ensure payout is never negative
}

// Clear cache when needed
export function clearFeesCache() {
  cachedSettings = null;
}