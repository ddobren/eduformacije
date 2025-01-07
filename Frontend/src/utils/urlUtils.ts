// src/utils/urlUtils.ts
export const getValidUrl = (inputStr: string): string | null => {
    if (!inputStr) return null;
  
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
    const match = inputStr.match(urlRegex);
  
    if (match && match[0]) {
      const possibleUrl = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
  
      try {
        new URL(possibleUrl);
        return possibleUrl;
      } catch {
        const trimmed = inputStr.trim();
        const fallbackUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
        try {
          new URL(fallbackUrl);
          return fallbackUrl;
        } catch {
          return null;
        }
      }
    }
  
    const trimmed = inputStr.trim();
    const maybeUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  
    try {
      new URL(maybeUrl);
      return maybeUrl;
    } catch {
      return null;
    }
  };

  export default getValidUrl;
  