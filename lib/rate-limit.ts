import { prisma } from "./prisma";

interface RateLimitConfig {
  key: string;
  limit: number;
  windowInMinutes: number;
}

export const checkRateLimit = async ({
  key,
  limit,
  windowInMinutes,
}: RateLimitConfig) => {
  // Skip rate limiting if disabled via environment variable (useful for development)
  if (process.env.DISABLE_RATE_LIMIT === "true") {
    return { success: true, remaining: limit };
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowInMinutes * 60 * 1000);

  const rateLimit = await prisma.rateLimit.findUnique({
    where: { key },
  });

  if (!rateLimit) {
    await prisma.rateLimit.create({
      data: {
        key,
        count: 1,
        expiresAt,
      },
    });
    return { success: true, remaining: limit - 1 };
  }

  if (now > rateLimit.expiresAt) {
    // Reset if expired
    await prisma.rateLimit.update({
      where: { key },
      data: {
        count: 1,
        expiresAt,
      },
    });
    return { success: true, remaining: limit - 1 };
  }

  if (rateLimit.count >= limit) {
    return { success: false, remaining: 0 };
  }

  const updatedRateLimit = await prisma.rateLimit.update({
    where: { key },
    data: {
      count: {
        increment: 1,
      },
    },
  });

  return { success: true, remaining: limit - updatedRateLimit.count };
};
