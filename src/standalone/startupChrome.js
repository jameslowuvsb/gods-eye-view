import { startApplicationChrome } from '../app/startupChrome.js';
import { initKeySetup } from '../keySetup.js';
import { healthNoticeCopy, startLoadingHealthCheck } from '../loadingHealth.js';

/**
 * Standalone chrome: the provider-settings dialog plus the startup API health
 * roster. The cover waits for the roster (bounded by its own timeout) so a
 * dead feed or a rejected key is visible before the globe is, and anything
 * it flagged gets one more surface in the status banner after the reveal.
 */
export function startStandaloneChrome(options) {
  const { loadingScreen, styleManager } = options;
  const health = startLoadingHealthCheck({
    listEl: loadingScreen?.querySelector?.('#loader-health') ?? null,
    summaryEl: loadingScreen?.querySelector?.('#loader-health-summary') ?? null,
    continueEl: loadingScreen?.querySelector?.('#loader-health-continue') ?? null,
  });
  let report = null;
  const ready = health.done.then((result) => {
    report = result;
  });
  return startApplicationChrome({
    initializeSettings: initKeySetup,
    ready,
    onRevealed: () => {
      const notice = healthNoticeCopy(report?.results, report || {});
      if (notice) {
        styleManager?.notifyStatus?.(notice.label, {
          detail: notice.detail,
          state: notice.state,
        });
      }
    },
    ...options,
  });
}
