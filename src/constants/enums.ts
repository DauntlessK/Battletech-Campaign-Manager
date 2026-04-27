/**
 * Central location for all shared enums used across the application
 */

export enum unitType {
  Battlearmor = "Battlearmor",
  Mek = "Mek",
  Infantry = "Infantry",
  Vehicle = "Vehicle"
}

export enum side {
  left = "left",
  right = "right",
  center = "center"
}

export enum loc {
  head = "head",
  centerTorso = "centerTorso",
  leftArm = "leftArm",
  rightArm = "rightArm",
  leftLeg = "leftLeg",
  rightLeg = "rightLeg",
  front = "front",
  rear = "rear",
  left = "left",
  right = "right",
  turret = "turret",
  body = "body"
}

export const MEK_LOCATIONS = {
  centerTorso: "CT",
  leftTorso: "LT",
  rightTorso: "RT",
  leftArm: "LA",
  rightArm: "RA",
  leftLeg: "LL",
  rightLeg: "RL"
} as const;