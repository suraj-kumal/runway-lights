import type { LightGroup } from "./RunwayEditor";

export type LightInfo = {
  title: string;
  colorName: string;
  summary: string;
  details: string[];
  note?: string;
};

export const LIGHT_INFO: Record<LightGroup, LightInfo> = {
  edge: {
    title: "Runway edge lights",
    colorName: "White",
    summary:
      "Outline the left and right limits of the runway so pilots can judge width and alignment at night or in low visibility.",
    details: [
      "Placed in two rows running along both sides of the runway.",
      "Normally white. On instrument runways they change to yellow over the last part of the runway (roughly the final 600 m / 2,000 ft) to warn that the runway is running out.",
      "Spacing is regular so the pilot can also judge speed and distance.",
    ],
  },
  mid: {
    title: "Runway centerline lights",
    colorName: "White",
    summary:
      "Run along the middle of the runway and help the pilot keep the aircraft on the centerline during landing roll and takeoff.",
    details: [
      "White along most of the runway.",
      "Near the far end they alternate red and white, then turn all red for the final stretch, warning that the runway is about to end.",
      "Especially important in low visibility, where the edges alone are hard to judge.",
    ],
  },
  threshold: {
    title: "Threshold lights",
    colorName: "Green (start) / Red (end)",
    summary:
      "A bar of lights across the runway that marks where the usable landing surface begins and ends.",
    details: [
      "Green threshold lights face approaching aircraft: this is where you can start to land.",
      "Red runway-end lights face aircraft rolling out or taking off: this is where the runway stops.",
      "Because they cross the full runway width, they are easy to see from the approach.",
    ],
    note: "Simplified for training: the green bar is on the left end and the red bar on the right end.",
  },
  "taxi-center": {
    title: "Taxiway centerline lights",
    colorName: "Green",
    summary:
      "Guide aircraft along the taxiway centerline between the runway and the apron or parking areas.",
    details: [
      "Green, and embedded in the taxiway surface along the painted yellow centerline.",
      "Help pilots stay on the correct route in darkness, fog or heavy rain.",
      "They lead the aircraft off the runway and onto the taxiway.",
    ],
  },
  turn: {
     title: "Turning lights (turn pad)",
     colorName: "Amber (training marker)",
     summary:
       "Outline the turn pad at the end of the runway, a widened area on one side where an aircraft makes a 180° turn and backtracks down the runway.",
     details: [
       "The pad is entered at an angle. A yellow marking line leaves the runway centerline, runs into the pad and loops round a turning circle, then rejoins the centerline pointing the other way.",
       "The lights mark the outer edge of the pavement so the pilot can see how much room there is, especially at night.",
       "The pilot slows down, follows the yellow line and keeps all wheels on the paved surface.",
     ],
     note: "Amber is a training color so trainees can tell these lights apart. At real airports turn pad edges normally use blue edge lights. Confirm the color with your client.",
   },
  "taxi-edge": {
    title: "Taxiway edge lights",
    colorName: "Blue",
    summary:
      "Mark the outer boundaries of the taxiway so pilots know where the paved surface ends.",
    details: [
      "Blue, and visible in all directions.",
      "Blue is only used for taxiways, so a pilot can tell a taxiway from a runway (white) at a glance.",
      "Placed along both sides, including around the curve.",
    ],
  },

};
