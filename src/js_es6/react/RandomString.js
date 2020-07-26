/**
 * Far from cryptographically secure, but good enough to avoid component naming collisions.
 */
export default function randomString() {
  return (
    Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
  );
}