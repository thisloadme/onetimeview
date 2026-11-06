export const SHARE_PRESETS = [
  { id: 'once', label: 'Sekali lihat · 24 jam', maxAccesses: 1, expiresIn: 24 },
  { id: 'day', label: '5 kali · 24 jam', maxAccesses: 5, expiresIn: 24 },
  { id: 'week', label: '10 kali · 7 hari', maxAccesses: 10, expiresIn: 168 }
] as const
