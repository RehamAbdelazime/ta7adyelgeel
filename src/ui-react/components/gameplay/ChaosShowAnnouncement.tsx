import type { ChaosEventSnapshot } from '../../../game-core/chaos/chaos-types';
import type { TourSnapshot } from '../../../game-core/tours/tour-types';
import { useTranslation } from '../../i18n/useTranslation';

/** Independent 3.9s cinematic between How To Play and the actual round.
 * The Tour FSM owns its duration (and pause/skip), not a UI timeout.
 * No question, tutorial, or answer clock is mounted beneath this overlay. */
export function ChaosShowAnnouncement({ tour, event }: { tour: TourSnapshot; event: ChaosEventSnapshot }) {
  const t = useTranslation();
  if (tour.phase !== 'chaos_announcement' || !event.active) return null;

  return (
    <section
      className={`chaos-show-v85 chaos-show-${event.rarity ?? 'common'} ${tour.isPaused ? 'chaos-show-paused' : ''}`}
      aria-label={`${t('chaos.show.title')} ${event.title}. ${event.description}`}
      role="status" aria-live="polite"
      data-chaos-event={event.id ?? ''}
    >
      <div className="chaos-show-blackout-v85" aria-hidden="true" />
      <div className="chaos-show-strobe-v85" aria-hidden="true" />
      <div className="chaos-show-announcement-v85">
        <span className="chaos-show-kicker-v85">⚡ {t('chaos.show.title')} ⚡</span>
        <div className="chaos-show-divider-v85" aria-hidden="true"><i /><b>✦</b><i /></div>
        <small>{t('chaos.show.subtitle')}</small>
        <strong>{event.title}</strong>
        <p>{event.description}</p>
      </div>
    </section>
  );
}
