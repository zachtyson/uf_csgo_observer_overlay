export interface Weapon {
    name: string;
    paintkit: string;
    type: string;
    ammo_clip?: number;
    ammo_clip_max?: number;
    ammo_reserve?: number;
    state: string;
}

export interface PlayerState {
    health: number;
    armor: number;
    helmet: boolean;
    flashed: number;
    smoked: number;
    burning: number;
    money: number;
    round_kills: number;
    round_killhs: number;
    round_totaldmg: number;
    equip_value: number;
}

export interface PlayerStats {
    kills: number;
    assists: number;
    deaths: number;
    mvps: number;
    score: number;
}

export interface TeamStats {
    score: number;
    consecutive_round_losses: number;
    timeouts_remaining: number;
    matches_won_this_series: number;
}

export interface RoundWins {
    [key: string]: string;
}

export interface Map {
    mode: string;
    name: string;
    phase: string;
    round: number;
    team_ct: TeamStats;
    team_t: TeamStats;
    num_matches_to_win_series: number;
    current_spectators: number;
    souvenirs_total: number;
    round_wins: RoundWins;
}

export interface Round {
    phase: string;
    bomb?: string;
}

export interface Provider {
    name: string;
    appid: number;
    version: number;
    steamid: string;
    timestamp: number;
}

export interface Player {
    steamid: string;
    clan?: string;
    name: string;
    observer_slot: number;
    team: string;
    activity?: string;
    state: PlayerState;
    match_stats: PlayerStats;
    weapons: { [key: string]: Weapon };
    spectarget?: string;
    position: string;
    forward: string;
}

export interface AllPlayers {
    [steamid: string]: Player;
}

export interface RootObject {
    provider: Provider;
    player: Player;
    map: Map;
    round: Round;
    allplayers: AllPlayers;
}
