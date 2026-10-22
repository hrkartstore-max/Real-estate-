export const properties = [
  { id: "coimbatore-saravanampatti-3bhk", title: "3 BHK Apartment, Saravanampatti", city: "Coimbatore", type: "Apartment", price: 78, area: 1480, beds: 3, baths: 3, blurb: "A contemporary apartment concept near Coimbatore’s technology corridor, with space for daily life and entertaining." },
  { id: "coimbatore-villa-vadavalli", title: "4 BHK Independent Villa, Vadavalli", city: "Coimbatore", type: "Villa", price: 215, area: 3200, beds: 4, baths: 4, blurb: "A spacious independent villa concept with a private garden, home-office space and a rooftop terrace." },
  { id: "chennai-omr-2bhk", title: "2 BHK Apartment, OMR", city: "Chennai", type: "Apartment", price: 92, area: 1120, beds: 2, baths: 2, blurb: "A practical apartment concept around the OMR corridor, planned for connected city living." },
  { id: "chennai-ecr-villa", title: "3 BHK Villa, ECR", city: "Chennai", type: "Villa", price: 340, area: 2600, beds: 3, baths: 3, blurb: "A coastal-inspired villa concept in a landscaped gated community setting." },
  { id: "madurai-plot-ring-road", title: "Residential Plot, Madurai Ring Road", city: "Madurai", type: "Plot", price: 36, area: 1800, beds: 0, baths: 0, blurb: "A sample residential land listing to help demonstrate plot discovery and property enquiry." },
  { id: "trichy-thillai-nagar-house", title: "3 BHK Independent House, Thillai Nagar", city: "Trichy", type: "House", price: 125, area: 2100, beds: 3, baths: 3, blurb: "An independent-home concept with family living spaces and convenient access to city amenities." },
  { id: "salem-plot-yercaud-road", title: "Residential Plot, Yercaud Road", city: "Salem", type: "Plot", price: 28, area: 2400, beds: 0, baths: 0, blurb: "A sample land listing for buyers exploring a future home or long-term property plans." },
  { id: "erode-2bhk-perundurai", title: "2 BHK Apartment, Perundurai Road", city: "Erode", type: "Apartment", price: 49, area: 1050, beds: 2, baths: 2, blurb: "A compact apartment concept designed around practical, low-maintenance everyday living." }
];

export const cities = ["All", ...new Set(properties.map((p) => p.city))];
export const types = ["All", ...new Set(properties.map((p) => p.type))];
