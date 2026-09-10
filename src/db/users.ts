import { db } from './index.ts';
import { users, auditLogs } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string) {
  const result = await db.insert(users)
    .values({
      uid,
      email,
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
      },
    })
    .returning();

  return result[0];
}

export async function logAuditAction(uid: string, action: string, details?: string, ipAddress?: string) {
    await db.insert(auditLogs).values({
        userId: uid,
        action,
        details,
        ipAddress
    });
}
