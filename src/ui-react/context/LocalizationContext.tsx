import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { setRuntimeTranslations, type RuntimeTranslationOverrides } from '../../game-core/localization/translations';
import type { LocaleCode } from '../../game-core/localization/locale-types';

type LocalizationReloadResult = {
  ok: boolean;
  error?: string;
};

type LocalizationContextValue = {
  configPath: string;
  loadedAt: number | null;
  lastError: string | null;
  reloadLocalization: () => Promise<LocalizationReloadResult>;
};

const LOCALIZATION_CONFIG_PATH = './assets/game/runtime/config/localization.json';
const LocalizationContext = createContext<LocalizationContextValue | null>(null);

function normalizeLocalizationConfig(rawConfig: unknown): RuntimeTranslationOverrides {
  const result: RuntimeTranslationOverrides = {};

  if (!rawConfig || typeof rawConfig !== 'object') {
    return result;
  }

  (['en', 'ar'] satisfies LocaleCode[]).forEach((locale) => {
    const localeBlock = (rawConfig as Record<string, unknown>)[locale];

    if (!localeBlock || typeof localeBlock !== 'object') {
      return;
    }

    const normalizedLocale: Record<string, string> = {};

    Object.entries(localeBlock as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === 'string') {
        normalizedLocale[key] = value;
      }
    });

    result[locale] = normalizedLocale;
  });

  return result;
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [loadedAt, setLoadedAt] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const reloadLocalization = useCallback(async (): Promise<LocalizationReloadResult> => {
    try {
      const response = await fetch(`${LOCALIZATION_CONFIG_PATH}?v=${Date.now()}`, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rawConfig = await response.json();
      setRuntimeTranslations(normalizeLocalizationConfig(rawConfig));
      setLoadedAt(Date.now());
      setLastError(null);
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown localization load error';
      setLastError(message);
      return { ok: false, error: message };
    }
  }, []);

  useEffect(() => {
    void reloadLocalization();
  }, [reloadLocalization]);

  const value = useMemo<LocalizationContextValue>(() => ({
    configPath: LOCALIZATION_CONFIG_PATH,
    loadedAt,
    lastError,
    reloadLocalization,
  }), [lastError, loadedAt, reloadLocalization]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization(): LocalizationContextValue {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error('useLocalization must be used inside LocalizationProvider.');
  }

  return context;
}
