import { useGame } from '../../context/GameContext';
import { useTranslation } from '../../i18n/useTranslation';

export type ScreenBackButtonProps = {
  onBack: () => void;
};

/**
 * The single back control used by the mode picker and the game catalog.
 * Keep navigation (onBack) owned by the parent and all presentation here.
 */
export function ScreenBackButton({ onBack }: ScreenBackButtonProps) {
  const { snapshot } = useGame();
  const t = useTranslation();
  const isRtl = snapshot.direction === 'rtl';

  return (
    <button
      className="screen-back-button"
      type="button"
      dir={snapshot.direction}
      onClick={onBack}
    >
      <span className="screen-back-button__chevron" aria-hidden="true">
        {isRtl ? '›' : '‹'}
      </span>
      <span className="screen-back-button__label">{t('main.back')}</span>
    </button>
  );
}
