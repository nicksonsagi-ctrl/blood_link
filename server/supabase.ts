import dotenv from 'dotenv';
dotenv.config({ override: true });
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let runtimeUrl = '';
let runtimeKey = '';

export function setRuntimeSupabaseCredentials(url: string, key: string) {
  runtimeUrl = url.trim();
  runtimeKey = key.trim();
  client = null; // force re-initialization
  lastUsedKey = '';
  lastUsedUrl = '';
}

export function getEffectiveSupabaseConfig() {
  return {
    url: runtimeUrl || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
    key: runtimeKey || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
  };
}

function getRawSupabaseUrl(): string {
  return runtimeUrl || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
}

const KNOWN_VALID_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaWlwam1xbXhsYW1raXlncWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMjk3NTksImV4cCI6MjEwNzcwNTc1OX0.W1qq1zpyuqiUxkdDK9VzNxgr2CmTF7CDtOyCcl5Zdo4';

function getRawSupabaseKey(): string {
  if (runtimeKey && !runtimeKey.startsWith('http://') && !runtimeKey.startsWith('https://')) {
    return runtimeKey;
  }
  const envKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  if (envKey && !envKey.startsWith('http://') && !envKey.startsWith('https://')) {
    return envKey;
  }
  return KNOWN_VALID_ANON_KEY;
}

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'KEY_IS_URL' | 'INVALID_KEY_FORMAT' | 'INVALID_URL';
  message: string;
  tamilMessage: string;
}

export function checkSupabaseConfig(): SupabaseConfigStatus {
  const url = getRawSupabaseUrl().trim();
  const key = getRawSupabaseKey().trim();

  if (!url || !key) {
    return {
      isConfigured: false,
      status: 'NOT_CONFIGURED',
      message: 'Supabase credentials are not set in environment.',
      tamilMessage: 'Supabase URL மற்றும் API Key இன்னும் அமைக்கப்படவில்லை.'
    };
  }

  if (url.includes('YOUR_SUPABASE') || key.includes('YOUR_SUPABASE') || url.includes('YOUR_PROJECT')) {
    return {
      isConfigured: false,
      status: 'NOT_CONFIGURED',
      message: 'Supabase placeholder values detected.',
      tamilMessage: 'Supabase மாதிரி மாறிகள் உள்ளன.'
    };
  }

  // Check if key was mistakenly set to a URL (e.g. copying the project URL into both fields)
  if (key.startsWith('http://') || key.startsWith('https://') || key === url) {
    return {
      isConfigured: false,
      status: 'KEY_IS_URL',
      message: 'The SUPABASE_KEY is currently set to a URL rather than an API key. Please copy the anon public key from your Supabase Dashboard under Project Settings > API.',
      tamilMessage: 'SUPABASE_KEY மாறியில் API Key-க்கு பதிலாக Supabase URL அமைக்கப்பட்டுள்ளது.'
    };
  }

  // Supabase API keys are JWT tokens (start with eyJ) or modern publishable/secret tokens (sb_publishable_ / sbp_ / sbs_)
  const isLikelyValidKey = key.startsWith('ey') || key.startsWith('sb_') || key.startsWith('sbp_') || key.startsWith('sbs_') || key.length >= 30;
  if (!isLikelyValidKey) {
    return {
      isConfigured: false,
      status: 'INVALID_KEY_FORMAT',
      message: 'The SUPABASE_KEY format is invalid. Please copy the anon or publishable key from Supabase API settings.',
      tamilMessage: 'SUPABASE_KEY வடிவம் தவறானது. Supabase API Settings-ல் உள்ள anon அல்லது publishable key-ஐ நகலெடுக்கவும்.'
    };
  }

  return {
    isConfigured: true,
    status: 'CONNECTED',
    message: 'Supabase credentials are valid.',
    tamilMessage: 'Supabase இணைப்பு சான்றுகள் சரியாக உள்ளன.'
  };
}

export const isSupabaseConfigured = (): boolean => {
  return checkSupabaseConfig().isConfigured;
};

let client: SupabaseClient | null = null;
let lastUsedKey = '';
let lastUsedUrl = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = checkSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  const url = getRawSupabaseUrl().trim();
  const key = getRawSupabaseKey().trim();

  if (!client || lastUsedKey !== key || lastUsedUrl !== url) {
    try {
      client = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      lastUsedKey = key;
      lastUsedUrl = url;
      console.log(`[Supabase Info] Client initialized successfully for ${url}`);
    } catch (err) {
      console.log('[Supabase Info] Failed to initialize client:', err);
      client = null;
    }
  }
  return client;
}

export const supabase = getSupabaseClient();

export async function testSupabaseConnection(customUrl?: string, customKey?: string) {
  const url = (customUrl || getRawSupabaseUrl()).trim();
  const key = (customKey || getRawSupabaseKey()).trim();

  if (!url || !key) {
    return {
      connected: false,
      tablesInitialized: false,
      message: 'Supabase URL or Key is missing.',
      tamilMessage: 'Supabase URL அல்லது API Key விடுபட்டுள்ளது.'
    };
  }

  try {
    const testClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { error } = await testClient.from('users').select('id').limit(1);

    if (error) {
      if (
        error.code === '42P01' ||
        error.code === 'PGRST204' ||
        error.code === 'PGRST205' ||
        error.message?.toLowerCase().includes('relation') ||
        error.message?.toLowerCase().includes('schema cache')
      ) {
        return {
          connected: true,
          tablesInitialized: false,
          message: 'Connected to Supabase project, but tables are not yet created! Run supabase_schema.sql in Supabase SQL Editor.',
          tamilMessage: 'Supabase உடன் வெற்றிகரமாக இணைக்கப்பட்டது, ஆனால் அட்டவணைகள் (Tables) இன்னும் உருவாக்கப்படவில்லை! தயவுசெய்து Supabase SQL Editor-ல் supabase_schema.sql-ஐ Paste செய்து Run செய்யவும்.'
        };
      }
      return {
        connected: false,
        tablesInitialized: false,
        message: `Supabase error: ${error.message} (Code: ${error.code})`,
        tamilMessage: `Supabase இணைப்பு பிழை: ${error.message}`
      };
    }

    return {
      connected: true,
      tablesInitialized: true,
      message: 'Successfully connected to Supabase and verified tables!',
      tamilMessage: 'Supabase உடன் வெற்றிகரமாக இணைக்கப்பட்டு அட்டவணைகள் சரிபார்க்கப்பட்டன!'
    };
  } catch (err: any) {
    return {
      connected: false,
      tablesInitialized: false,
      message: err.message || 'Failed to connect to Supabase.',
      tamilMessage: `Supabase உடன் இணைப்பதில் தோல்வி: ${err.message}`
    };
  }
}
