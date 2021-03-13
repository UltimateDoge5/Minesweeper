type difficulty = "Easy" | "Medium" | "Hard";

interface SettingsType{
    "columnsX":number,
    "rowsY":number,
    "mines":number,
}

type SettingsList = {
    [x in difficulty]: SettingType
}
