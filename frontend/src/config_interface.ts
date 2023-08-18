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
}
// {
//   "application": {
//     "logLevel": "info",
//     "port": 25566,
//     "host": "127.0.0.1"
//   },
//   "team_data": {
//     "teamOneName": "Devin",
//     "teamTwoName": "Zach",
//     "teamOneLogo": "logoOne.png",
//     "teamTwoLogo": "logoTwo.jpg",
//     "teamOneStartingSide": "CT",
//     "bombTime": 40
//   }
// }
