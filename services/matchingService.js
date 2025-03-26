const Matching = require("../models/matching");

// Calculate match score based on various criteria
const calculateMatchScore = (counselor, preferences) => {
  let score = 0;

  // Specialty matching (40% weight)
  const specialtyMatch = counselor.specialties.filter((s) =>
    preferences.specialties.includes(s)
  ).length;
  score += (specialtyMatch * 40) / preferences.specialties.length;

  // Availability matching (30% weight)
  if (preferences.availability) {
    const availabilityMatch = counselor.availability.filter((a) =>
      preferences.availability.includes(a.day)
    ).length;
    score += (availabilityMatch * 30) / preferences.availability.length;
  }

  // Rating consideration (20% weight)
  score += (counselor.rating / 5) * 20;

  // Language matching (10% weight)
  if (preferences.languages) {
    const languageMatch = counselor.languages.filter((l) =>
      preferences.languages.includes(l)
    ).length;
    score += (languageMatch * 10) / preferences.languages.length;
  }

  return Math.min(Math.round(score), 100);
};

// Match counselors based on client preferences and save results
const matchAndSave = async (clientId, preferences) => {
  const counselors = await Counselor.find({
    "license.verification.status": "verified",
    specialties: { $in: preferences.specialties },
  });

  const matches = await Promise.all(
    counselors.map(async (counselor) => {
      const score = calculateMatchScore(counselor, preferences);

      await Matching.findOneAndUpdate(
        { clientId, counselorId: counselor._id },
        {
          score,
          matchingCriteria: {
            specialties: preferences.specialties,
            availability: preferences.availability,
            languages: preferences.languages,
          },
        },
        { upsert: true, new: true }
      );

      return {
        counselorId: counselor._id,
        name: counselor.name,
        specialties: counselor.specialties,
        score,
      };
    })
  );

  return matches.sort((a, b) => b.score - a.score);
};

module.exports = { matchAndSave };
