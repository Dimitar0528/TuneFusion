export default function extractUUIDPrefix(uuid) {
  if (uuid)  return uuid.slice(0, 6);
  
  return null;
}
