import React from "react";
import type { UnitLocation } from "../types/app";

export type LocationLayoutOptions = {
  head?: boolean;
  tall?: boolean;
};

export default function BattleMechLocationLayout({
  locations,
  renderLocation,
  className = "",
}: {
  locations: UnitLocation[];
  renderLocation: (
    location: UnitLocation,
    options?: LocationLayoutOptions,
  ) => React.ReactNode;
  className?: string;
}) {
  const byName = groupLocationsByName(locations);

  const renderIfPresent = (
    location?: UnitLocation | null,
    options?: LocationLayoutOptions,
  ) => (location ? renderLocation(location, options) : <div className="hidden xl:block" />);

  return (
    <div className={className}>
      <div className="grid gap-3 xl:hidden">
        {locations.map((location) => (
          <React.Fragment key={location.id}>
            {renderLocation(location)}
          </React.Fragment>
        ))}
      </div>

      <div className="hidden min-w-0 w-full max-w-full xl:block">
        <div className="grid min-w-0 w-full max-w-full grid-cols-[minmax(150px,0.85fr)_minmax(190px,1fr)_minmax(210px,1.05fr)_minmax(190px,1fr)_minmax(150px,0.85fr)] items-start gap-3">
          <div className="space-y-3 pt-20 2xl:pt-10">
            {renderIfPresent(byName.leftArm)}
          </div>
          <div className="space-y-3">
            {renderIfPresent(byName.leftTorso, { tall: true })}
            {renderIfPresent(byName.leftLeg)}
          </div>
          <div className="space-y-3">
            {renderIfPresent(byName.head, { head: true })}
            {renderIfPresent(byName.centerTorso, { tall: true })}
          </div>
          <div className="space-y-3">
            {renderIfPresent(byName.rightTorso, { tall: true })}
            {renderIfPresent(byName.rightLeg)}
          </div>
          <div className="space-y-3 pt-20 2xl:pt-10">
            {renderIfPresent(byName.rightArm)}
          </div>
        </div>
      </div>
    </div>
  );
}

function groupLocationsByName(locations: UnitLocation[]) {
  const result: Record<string, UnitLocation | null> = {
    head: null,
    centerTorso: null,
    leftTorso: null,
    rightTorso: null,
    leftArm: null,
    rightArm: null,
    leftLeg: null,
    rightLeg: null,
  };

  for (const location of locations) {
    const name = String(location.name ?? "").toLowerCase();
    if (name === "head") result.head = location;
    else if (name === "center torso") result.centerTorso = location;
    else if (name === "left torso") result.leftTorso = location;
    else if (name === "right torso") result.rightTorso = location;
    else if (name === "left arm") result.leftArm = location;
    else if (name === "right arm") result.rightArm = location;
    else if (name === "left leg") result.leftLeg = location;
    else if (name === "right leg") result.rightLeg = location;
  }

  return result;
}
