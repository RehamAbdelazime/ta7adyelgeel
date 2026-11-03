/** Single stage-space coordinate contract (percentages of the authored 16:9 scene).
 * Choice labels sit against the screen apron; the lit lanes run forward into
 * the spectator floor. Citizen motion uses the exact same left/width geometry.
 * Number 1 always stays at the physical left, even in RTL mode.
 */
export const ANSWER_STAGE_LAYOUT = {
  leftPercent: 13,
  widthPercent: 74,
  topPercent: 80.5,
  heightPercent: 19.5,
} as const;
