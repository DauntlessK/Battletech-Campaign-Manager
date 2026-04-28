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
  leftTorso = "leftTorso",
  rightTorso = "rightTorso",
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

export enum locationFullName {
  head = "Head",
  centerTorso = "Center Torso",
  leftTorso = "Left Torso",
  rightTorso = "Right Torso",
  leftArm = "Left Arm",
  rightArm = "Right Arm",
  leftLeg = "Left Leg",
  rightLeg = "Right Leg",
  front = "Front",
  rear = "Rear",
  left = "Left",
  right = "Right",
  turret = "Turret",
  body = "Body"
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

type InternalStructure = {
  head: number;
  ct: number;
  sideTorso: number;
  arm: number;
  leg: number;
};

export const BATTLEMECH_INTERNAL_STRUCTURE: Record<number, InternalStructure> = {
  20:  { head: 3, ct: 6,  sideTorso: 5,  arm: 3,  leg: 4  },
  25:  { head: 3, ct: 8,  sideTorso: 6,  arm: 4,  leg: 6  },
  30:  { head: 3, ct: 10, sideTorso: 7,  arm: 5,  leg: 7  },
  35:  { head: 3, ct: 11, sideTorso: 8,  arm: 6,  leg: 8  },
  40:  { head: 3, ct: 12, sideTorso: 10, arm: 6,  leg: 10 },
  45:  { head: 3, ct: 14, sideTorso: 11, arm: 7,  leg: 11 },
  50:  { head: 3, ct: 16, sideTorso: 12, arm: 8,  leg: 12 },
  55:  { head: 3, ct: 18, sideTorso: 13, arm: 9,  leg: 13 },
  60:  { head: 3, ct: 20, sideTorso: 14, arm: 10, leg: 14 },
  65:  { head: 3, ct: 21, sideTorso: 15, arm: 10, leg: 15 },
  70:  { head: 3, ct: 22, sideTorso: 15, arm: 11, leg: 15 },
  75:  { head: 3, ct: 23, sideTorso: 16, arm: 12, leg: 16 },
  80:  { head: 3, ct: 25, sideTorso: 17, arm: 13, leg: 17 },
  85:  { head: 3, ct: 27, sideTorso: 18, arm: 14, leg: 18 },
  90:  { head: 3, ct: 29, sideTorso: 19, arm: 15, leg: 19 },
  95:  { head: 3, ct: 30, sideTorso: 20, arm: 16, leg: 20 },
  100: { head: 3, ct: 31, sideTorso: 21, arm: 17, leg: 21 },
};