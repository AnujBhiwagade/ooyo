const ipRecords = new Map();

function shouldEnforceIpBan() {
  return process.env.NODE_ENV === "production";
}

// ============================
// GET / CREATE IP RECORD
// ============================

function getIpRecord(ip) {
  if (!ipRecords.has(ip)) {
    ipRecords.set(ip, {
      reports: [],
      strikes: 0,
      bannedUntil: null,
    });
  }

  return ipRecords.get(ip);
}

// ============================
// ADD REPORT
// ============================

function addReport(ip) {
  const record = getIpRecord(ip);

  record.reports.push(Date.now());

  return record;
}

// ============================
// ADD STRIKE
// ============================

function addStrike(ip) {
  const record = getIpRecord(ip);

  record.strikes += 1;

  return record.strikes;
}

// ============================
// BAN IP
// ============================

function banIp(ip, durationMs) {
  const record = getIpRecord(ip);

  record.bannedUntil =
    Date.now() + durationMs;

  return record;
}

// ============================
// CHECK IP BAN
// ============================

function isIpBanned(ip) {
  const record = ipRecords.get(ip);

  if (!record || !record.bannedUntil) {
    return false;
  }

  // ============================
  // BAN EXPIRED
  // ============================

  if (Date.now() >= record.bannedUntil) {
    record.bannedUntil = null;

    // Reports belong to the temporary
    // moderation period.
    record.reports = [];

    return false;
  }

  return true;
}

// ============================
// REMAINING BAN TIME
// ============================

function getRemainingBanTime(ip) {
  const record = ipRecords.get(ip);

  if (!record || !record.bannedUntil) {
    return 0;
  }

  return Math.max(
    0,
    record.bannedUntil - Date.now(),
  );
}

// ============================
// BAN DURATION
// ============================

function getBanDuration(strikes) {
  // Strike 1 → 1 hour
  if (strikes === 1) {
    return 60 * 60 * 1000;
  }

  // Strike 2 → 24 hours
  if (strikes === 2) {
    return 24 * 60 * 60 * 1000;
  }

  // Strike 3 → 7 days
  if (strikes === 3) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  // Strike 4+ → 30 days
  return 30 * 24 * 60 * 60 * 1000;
}

// ============================
// EXPORTS
// ============================

module.exports = {
  getIpRecord,
  addReport,
  addStrike,
  getBanDuration,
  banIp,
  isIpBanned,
  getRemainingBanTime,
  shouldEnforceIpBan,
};