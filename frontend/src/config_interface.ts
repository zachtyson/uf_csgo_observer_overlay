export interface TeamData {
    teamOneLogo: any;
    teamOneName: string;
    teamTwoLogo: any;
    teamTwoName: string;
    teamOneStartingSide: string;
    bombTime: number;
    halfLength: number;
    overtimeHalfLength: number;
    maxRounds: number;
}

interface ApplicationData {
    logLevel: string;
    port: number;
    host: string;
}
export interface ConfigData {
    application_data: ApplicationData;
    team_data: TeamData;
    ui_visual_data: UIVisualData;
}

export interface UIVisualData {
    tColor: string;
    ctColor: string;
    backgroundOpacity: string;
    backgroundSolid: string;
    backgroundOpacity2: string;
    overlayFont: string;
}
