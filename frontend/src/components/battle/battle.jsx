export function Battle({ navigateTo }) {
  return (
    <div>
      <div>
        <p>BattleId</p>
        <button
          onClick={() => navigateTo("home")}
        >To the Home</button>
      </div>
    </div>
  );
}