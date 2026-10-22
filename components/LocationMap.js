export default function LocationMap({ city, address, latitude, longitude, verified }) {
  const hasExactPin = verified === true && Boolean(String(address || "").trim()) &&
    Number.isFinite(Number(latitude)) && Number(latitude) >= -90 && Number(latitude) <= 90 &&
    Number.isFinite(Number(longitude)) && Number(longitude) >= -180 && Number(longitude) <= 180 &&
    latitude !== null && latitude !== "" && longitude !== null && longitude !== "";
  const location = hasExactPin ? `${Number(latitude)},${Number(longitude)}` : [city, "Tamil Nadu", "India"].filter(Boolean).join(", ");
  const query = encodeURIComponent(location);
  const mapLabel = hasExactPin ? address : `${city}, Tamil Nadu`;
  return <section className="location-map" aria-labelledby="location-map-title">
    <div className="location-map-heading">
      <div>
        <p className="eyebrow dark">{hasExactPin ? "VERIFIED PROPERTY LOCATION" : "EXPLORE THE AREA"}</p>
        <h2 id="location-map-title">Around <em>{city}.</em></h2>
        <p>{hasExactPin ? `Exact pin shown for the address marked as verified by the listing administrator: ${address}.` : "City-level map preview only. An exact pin is hidden until the listing is marked verified and has a verified address with valid coordinates."}</p>
      </div>
      <a className="button" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer">Open in Google Maps ↗</a>
    </div>
    <div className="location-map-frame">
      <iframe title={`Map of ${mapLabel}`} src={`https://maps.google.com/maps?q=${query}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
    <p className="location-map-note">{hasExactPin ? "Location details are provided by the listing administrator. Independently confirm the property address and boundary on site." : "This map shows the surrounding city, not the exact property location. Do not rely on it to identify a specific plot or building."}</p>
  </section>;
}
