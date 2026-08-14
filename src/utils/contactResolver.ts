import { Contact } from '../types';

export interface ContactMatchResult {
  contact?: Contact;
  organizationMatch?: string;
  confidence: number;
  ambiguousContacts?: Contact[];
}

export function matchContactFromSpeech(
  speechText: string,
  contacts: Contact[]
): ContactMatchResult {
  if (!speechText || contacts.length === 0) {
    return { confidence: 0 };
  }

  const text = speechText.toLowerCase();

  // 1. Look for explicit "from [Organization]" or "[Organization] ke/ki" pattern
  // e.g. "Mohsin from Labex Lab", "Mohsin from Labex", "Mohsin of Labex Lab"
  let matchedOrg: string | undefined = undefined;
  let matchedContact: Contact | undefined = undefined;
  const candidates: Contact[] = [];

  // Check each contact
  for (const c of contacts) {
    const nameLower = c.name.toLowerCase();
    const firstNameLower = c.name.split(' ')[0].toLowerCase();
    const orgLower = c.organization.toLowerCase();

    const nameMentioned = text.includes(nameLower) || text.includes(firstNameLower);
    const orgMentioned = orgLower && text.includes(orgLower);

    if (nameMentioned && orgMentioned) {
      // Perfect dual match: Both name and organization are mentioned in speech
      return {
        contact: c,
        organizationMatch: c.organization,
        confidence: 0.98,
      };
    } else if (nameMentioned) {
      candidates.push(c);
    } else if (orgMentioned && !matchedOrg) {
      matchedOrg = c.organization;
    }
  }

  // 2. If single candidate found by name
  if (candidates.length === 1) {
    return {
      contact: candidates[0],
      organizationMatch: candidates[0].organization,
      confidence: 0.85,
    };
  }

  // 3. If multiple candidates with same name (e.g. two Mohsins)
  if (candidates.length > 1) {
    // If organization was also mentioned, pick the matching one
    if (matchedOrg) {
      const best = candidates.find(c => c.organization.toLowerCase() === matchedOrg?.toLowerCase());
      if (best) {
        return {
          contact: best,
          organizationMatch: best.organization,
          confidence: 0.95,
        };
      }
    }
    // Ambiguous result (need user clarification)
    return {
      confidence: 0.5,
      ambiguousContacts: candidates,
    };
  }

  // 4. If only organization mentioned
  if (matchedOrg) {
    const orgContacts = contacts.filter(c => c.organization.toLowerCase() === matchedOrg?.toLowerCase());
    if (orgContacts.length === 1) {
      return {
        contact: orgContacts[0],
        organizationMatch: matchedOrg,
        confidence: 0.75,
      };
    }
  }

  return { confidence: 0 };
}
