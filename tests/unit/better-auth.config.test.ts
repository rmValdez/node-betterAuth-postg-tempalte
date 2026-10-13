import { auth } from '../../src/auth/better-auth';

/**
 * Better Auth accepts every `additionalFields` entry from the client (sign-up
 * and update-user) unless it is marked `input: false`. These fields grant
 * privileges or control account state, so clients must never be able to set
 * them — e.g. `POST /api/auth/sign-up/email { role: 'SUPER_ADMIN' }`.
 */
describe('Better Auth user field lockdown', () => {
  const fields: Record<string, { type: string; input?: boolean }> =
    auth.options.user?.additionalFields ?? {};

  it.each(['role', 'isActive', 'isDeleted', 'onboardingCompleted'])(
    '%s is server-managed (input: false)',
    (name) => {
      expect(fields[name]).toBeDefined();
      expect(fields[name].input).toBe(false);
    },
  );

  it('keeps username client-settable', () => {
    expect(fields.username.input).not.toBe(false);
  });
});
