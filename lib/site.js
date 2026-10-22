export const SITE = {
  name: "Hepra Realty",
  whatsapp: "918124262289",
  email: "hrkartstore@gmail.com",
  region: "Tamil Nadu"
};

export const fmt = (lakh) =>
  lakh >= 100
    ? `₹${(lakh / 100).toFixed(2).replace(/\.?0+$/, "")} Cr`
    : `₹${lakh} L`;
