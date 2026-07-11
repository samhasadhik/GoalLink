export default function PlayerCard({ player }) {
  return (
    <div className="card">
      <h3>{player?.firstName} {player?.lastName}</h3>
      <p>{player?.primaryPosition}</p>
    </div>
  );
}