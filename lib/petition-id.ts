import { randomBytes } from 'crypto';

export function makePetitionId() {
  const suffix = randomBytes(4).toString('hex').toUpperCase();
  return `JKJB-${new Date().getFullYear()}-${suffix}`;
}
