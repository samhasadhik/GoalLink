export default function OpportunityCard({ opportunity }) {
  return (
    <div className="card">
      <h3>{opportunity?.title}</h3>
      <p>{opportunity?.positionNeeded}</p>
    </div>
  );
}