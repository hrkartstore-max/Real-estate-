export const REQUIRED_VERIFICATION_DOCS = [
  "ownershipProof",
  "approvalDocuments",
  "encumbranceCertificate",
  "propertyTaxReceipt"
];

export function isVerifiedListing(property) {
  return property?.verified === true &&
    REQUIRED_VERIFICATION_DOCS.every(id => Array.isArray(property.verificationDocuments) && property.verificationDocuments.includes(id));
}

export function hasVerifiedCoordinates(property) {
  return isVerifiedListing(property) &&
    typeof property.address === "string" && property.address.trim().length > 0 &&
    property.latitude !== null && property.latitude !== "" && property.latitude !== undefined &&
    property.longitude !== null && property.longitude !== "" && property.longitude !== undefined &&
    Number.isFinite(Number(property.latitude)) && Number(property.latitude) >= -90 && Number(property.latitude) <= 90 &&
    Number.isFinite(Number(property.longitude)) && Number(property.longitude) >= -180 && Number(property.longitude) <= 180;
}
