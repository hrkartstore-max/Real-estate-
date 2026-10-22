export default function LocationMap({ city }) {
  const location = [city, "Tamil Nadu", "India"].filter(Boolean).join(", ");
  const query = encodeURIComponent(location);
  return <section className="location-map" aria-labelledby="location-map-title">
    <div className="location-map-heading">
      <div>
        <p className="eyebrow dark">EXPLORE THE AREA</p>
        <h2 id="location-map-title">Around <em>{city}.</em></h2>
        <p>City-level map preview. This sample listing does not include a verified street address or exact property pin.</p>
      </div>
      <a className="button" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer">Open in Google Maps ↗</a>
    </div>
    <div className="location-map-frame">
      <iframe title={`Map of ${location}`} src={`https://maps.google.com/maps?q=${query}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
    <p className="location-map-note">Map shows the surrounding city, not the exact property location. Confirm the address and visit the site before making a decision.</p>
  </section>;
}
