export const getAvatarSource = (avatarId: string) => {
  const avatarMap = {
    '1': require("../assets/images/avatar-1.png"),
    '2': require("../assets/images/avatar-2.png"),
    '3': require("../assets/images/avatar-3.png"),
    '4': require("../assets/images/avatar-4.png"),
    '5': require("../assets/images/avatar-5.png"),
    // Add more mappings as needed
  };
  return avatarMap[avatarId];
}; 