import type { TranslationKey } from '../../game-core/localization/locale-types';
import { translate } from '../../game-core/localization/translations';
import { useGame } from '../context/GameContext';
import { useLocalization } from '../context/LocalizationContext';

export function useTranslation(): (key: TranslationKey, params?: Record<string, string>) => string {
  const { snapshot } = useGame();
  const { loadedAt } = useLocalization();
  void loadedAt;

  return (key: TranslationKey, params: Record<string, string> = {}) => translate(snapshot.locale, key, params);
}
