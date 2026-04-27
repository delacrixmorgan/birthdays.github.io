import VCard from 'vcf';
import { Birthday } from './calendar';

export function parseVCF(content: string): Birthday[] {
  if (!content || !content.trim()) return [];

  // Remove BOM and normalize line endings
  let cleaned = content.replace(/^\uFEFF/, '').trim();
  cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  try {
    const cards = VCard.parse(cleaned);
    const birthdays: Birthday[] = [];

    // The library can return a single card or an array
    const cardArray = Array.isArray(cards) ? cards : [cards];

    cardArray.forEach((card) => {
      const fn = card.get('fn');
      const bday = card.get('bday');

      if (fn && bday) {
        const name = Array.isArray(fn) ? fn[0].valueOf() : fn.valueOf();
        const bdayStr = Array.isArray(bday) ? bday[0].valueOf() : bday.valueOf();

        const date = parseBDAY(String(bdayStr));
        if (date) {
          birthdays.push({
            name: String(name),
            date: date.date,
            originalYear: date.year,
          });
        }
      }
    });

    if (birthdays.length > 0) return birthdays;
    
    // If library found no birthdays but didn't throw, try fallback
    return fallbackRegexParse(cleaned);
  } catch (e) {
    console.warn('VCF library failed, attempting fallback regex parsing...', e);
    return fallbackRegexParse(cleaned);
  }
}

/**
 * A highly robust regex-based fallback for VCF files that fail strict parsing.
 * Specifically handles common fields like FN and BDAY even in malformed files.
 */
function fallbackRegexParse(content: string): Birthday[] {
  const birthdays: Birthday[] = [];
  // Split into blocks by BEGIN:VCARD
  const blocks = content.split(/BEGIN:VCARD/i);
  
  for (const block of blocks) {
    if (!block.trim()) continue;
    
    // Search for Full Name (FN)
    const fnMatch = block.match(/^FN(?:;[^:]*)?:(.*)$/im);
    // Search for Birthday (BDAY)
    const bdayMatch = block.match(/^BDAY(?:;[^:]*)?:(.*)$/im);
    
    if (fnMatch && bdayMatch) {
      const name = fnMatch[1].trim();
      const bdayStr = bdayMatch[1].trim();
      const date = parseBDAY(bdayStr);
      
      if (date) {
        birthdays.push({
          name,
          date: date.date,
          originalYear: date.year
        });
      }
    }
  }
  
  return birthdays;
}

function parseBDAY(str: string): { date: Date; year?: number } | null {
  // Clean string
  const clean = str.replace(/[-:]/g, '');
  
  // Format: YYYYMMDD
  if (clean.length === 8) {
    const year = parseInt(clean.substring(0, 4));
    const month = parseInt(clean.substring(4, 6)) - 1;
    const day = parseInt(clean.substring(6, 8));
    return { date: new Date(year, month, day), year };
  }
  
  // Format: MMDD (no year usually starts with --)
  if (clean.length === 4) {
    const month = parseInt(clean.substring(0, 2)) - 1;
    const day = parseInt(clean.substring(2, 4));
    return { date: new Date(2000, month, day) }; // Default year for internal handling
  }

  // Fallback for YYYY-MM-DD
  const parts = str.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    return { date: new Date(year, month, day), year };
  }

  return null;
}
