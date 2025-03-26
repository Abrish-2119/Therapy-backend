// services/licenseVerificationService.js
const verifyLicense = async (licenseNumber) => {
  // Integrate with your state's license API here
  const mockApiResponse = {
    isValid: true,
    expiry: "2025-12-31",
  };

  return {
    status: mockApiResponse.isValid ? "verified" : "rejected",
    expiry: mockApiResponse.expiry,
  };
};

module.exports = { verifyLicense };
