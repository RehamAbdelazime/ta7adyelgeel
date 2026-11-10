/**
 * The exact same hint markup is rendered in the LIVE Food Origin round and
 * in the small pre-game walkthrough. Keep presentation in the same stylesheet
 * so the tutorial can't quietly drift from the real game again.
 */
export function FoodOriginHintPill({ label, revealed }: { label: string; revealed: boolean }) {
  return (
    <div className="gameplay-food-hint-slot" aria-live="polite">
      <strong className={revealed ? 'gameplay-dish-hint-revealed' : 'gameplay-dish-hint-countdown'}>
        {label}
      </strong>
    </div>
  );
}
