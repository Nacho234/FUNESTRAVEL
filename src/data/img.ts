// Central image registry. Every visual asset in the demo comes from here so a
// broken URL can be swapped in one place.
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export const IMG = {
  // Destinations
  bariloche: u("1551632811-561732d1e306"),
  ushuaia: u("1506905925346-21bda4d32df4"),
  mendoza: u("1504279577054-acfeccf8fc52"),
  salta: u("1464822759023-fed622ff2c3b"),
  iguazu: u("1432405972618-c60b0225b8f9"),
  rio: u("1483729558449-99ef09a8c325"),
  buzios: u("1519046904884-53103b34b206"),
  florianopolis: u("1507525428034-b723cf961d3e"),
  puntacana: u("1468413253725-0d5181091126"),
  cancun: u("1552074284-5e88ef1aef18"),
  nuevayork: u("1496442226666-8d4d0e62e6e9"),
  miami: u("1506966953602-c20cc11f75e3"),
  madrid: u("1539037116277-4db20889f2d4"),
  paris: u("1502602898657-3e91760cbb34"),
  roma: u("1552832230-c0197dd311b5"),
  grecia: u("1570077188670-e3a8d69ac5ff"),
  turquia: u("1541432901042-2d8bd64b4a9b"),

  // Editorial / experiences
  couple: u("1519741497674-611481863552"),
  family: u("1602002418082-a4443e081dd1"),
  friends: u("1539635278303-d4002c07eae3"),
  food: u("1414235077428-338989a2e8c0"),
  ski: u("1551698618-1dfe5d97d256"),
  trek: u("1501554728187-ce583db33af7"),
  culture: u("1526392060635-9d6019884377"),
  cruise: u("1548574505-5e239809ee19"),
  cityeurope: u("1467269204594-9661b134dd2b"),
  timessquare: u("1534430480872-3498386e7856"),
  relax: u("1544161515-4ab6ce6db874"),

  // Hotels
  hotelPool: u("1566073771259-6a8506099945"),
  hotelRoom: u("1590490360182-c33d57733427"),
  hotelLobby: u("1564501049412-61c2a3083791"),
  hotelBeach: u("1520250497591-112f2f40a3f4"),
  hotelMountain: u("1601918774946-25832a4be0d6"),

  // Curated destinations (home)
  barilocheWinter: u("1491002052546-bf38f186af56"),

  // Experience finder (home) — one editorial scene per travel style
  expCouple: u("1523906834658-6e24ef2386f9"),
  expFamily: u("1511895426328-dc8714191300"),
  expFriends: u("1539635278303-d4002c07eae3"),
  expAdventure: u("1476514525535-07fb3b4ae5f1"),
  expFood: u("1530062845289-9109b2c9c868"),
  expBeach: u("1506929562872-bb421503ef21"),

  // Promotions showcase (home)
  caribeExperience: u("1544550581-5f7ceaf7f992"),

  // Curated destinations background (home)
  cloudSea: "/images/cloud-sea.jpg",

  // Human-touch hero (home)
  humanScene: u("1527631746610-bca00a040d60"),

  // Takeoff scroll scene (home)
  takeoffAirport: u("1542296332-2e4473faf563"),
  takeoffRunway: u("1556388158-158ea5ccacbd"),
  takeoffFlight: "/images/takeoff-flight.jpg",

  // Misc
  planning: u("1488646953014-85cb44e25828"),
  passport: u("1544716278-ca5e3f4abd8c"),
  luggage: u("1565026057447-bc90a3dceb87"),
  map: u("1524661135-423995f22d0b"),
  santorini: u("1533105079780-92b9be482077"),
  amsterdam: u("1512470876302-972faa2aa9a4"),
  sunsetbeach: u("1507290439931-a861b5a38200"),
} as const;

export function avatar(seed: number): string {
  return `https://i.pravatar.cc/160?img=${seed}`;
}
