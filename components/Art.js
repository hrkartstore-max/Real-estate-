const images = {
  Apartment: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
  Villa: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
  House: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
  Plot: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85"
};

export default function Art({ type = "House", tall = false }) {
  return <div className={`art ${tall ? "art-tall" : ""}`}>
    <img src={images[type] || images.House} alt={`${type} property concept`} loading={tall ? "eager" : "lazy"} />
    <span className="art-shade" />
  </div>;
}
