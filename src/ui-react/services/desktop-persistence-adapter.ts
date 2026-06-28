import type { GamePersistencePort, PersistentFileName } from '../../game-core';

export function createDesktopPersistenceAdapter(): GamePersistencePort | null {
  const api = window.elGeel?.storage;

  if (!api) {
    return null;
  }

  return {
    readJson: <T>(fileName: PersistentFileName) => api.readJson<T>(fileName),
    writeJson: (fileName: PersistentFileName, data: unknown) => api.writeJson(fileName, data),
  };
}
