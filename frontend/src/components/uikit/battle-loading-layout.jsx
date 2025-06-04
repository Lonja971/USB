export function BattleLoadingLayout({teams, playerTeamIndex, modeInfo}) {
    return (
        <div className="waiting">
            <h2>{modeInfo.name}</h2>
            <div className="teams__block">
                {teams.map((team, teamIndex) => (
                    <div key={teamIndex}>
                        <div>
                        Team {teamIndex} {teamIndex === playerTeamIndex ? "(you)" : ""}
                        </div>
                        <ul>
                        {Object.entries(team).map(([playerId, player]) => (
                            <li key={playerId}>
                            Player {playerId}: {player.name}
                            </li>
                        ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}