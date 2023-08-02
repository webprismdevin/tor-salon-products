export default function extractGID (gid: string): string {
  return gid.split('/')[4]
}