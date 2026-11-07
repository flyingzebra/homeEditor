# IEC 60364 preliminary electrical design review

Home Editor replaces the former NF C 15-100 room-by-room electrical point-count tests with an **IEC 60364 evidence checklist**.

## Why the former rules were removed

The old report asserted mandatory numbers of switches, lighting points, sockets, and 20 A / 32 A outlets for certain room types, often with a green check mark. Those counts reflected French NF C 15-100 guidance and must not be presented as normative IEC 60364 requirements. A plan containing electrical symbols cannot establish electrical installation conformity.

## What the report now does

- Keeps the plan-derived counts of switches, socket outlets and lighting points as observations (not pass/fail results).
- Identifies missing information for IEC 60364 topics: shock protection (4-41); thermal effects (4-42); overcurrent (4-43); wiring systems (5-52); protective/switching devices (5-53); earthing and bonding (5-54); and inspection and testing (6).
- When a room label suggests a permanent bath or shower, raises a specific review item for **IEC 60364-7-701**. This is *not* an automatic zone or RCD assessment.
- Explicitly reports **Not verified**: no automatic compliance approval is possible with current model data.
- Labels the existing wattage summary as an assumption, not verified capacity.
- Makes no claim about the adopted national rules; applicable national regulations and amendments must also be checked.

## Information needed for actual conformity checks

Add a circuit/electrical model recording supply and earthing arrangements, rated and design currents, circuit assignments, supply voltage, protective devices and settings (including applicable RCDs), cable types, cross-sections and installation methods, fault characteristics, protective bonding, special-location geometry and fixture placement, and inspection/test results. Clause-by-clause automated checks must then use the applicable edition and national adoption of IEC 60364, with review by a competent electrical professional.

## Official scope references

- IEC 60364-1:2025, principles: https://webstore.iec.ch/en/publication/63699
- IEC 60364-4-41, electric shock: https://webstore.iec.ch/en/publication/1867
- IEC 60364-4-43:2023, overcurrent: https://webstore.iec.ch/en/publication/28432
- IEC 60364-5-52, wiring systems: https://webstore.iec.ch/en/publication/103734
- IEC 60364-5-53, protective devices: https://webstore.iec.ch/en/publication/63543
- IEC 60364-5-54, earthing: https://webstore.iec.ch/en/publication/68865
- IEC 60364-6, verification: https://webstore.iec.ch/en/publication/24656
- IEC 60364-7-701:2019, locations containing baths/showers: https://webstore.iec.ch/en/publication/28906

## Offline test

Open `test/index.html` directly. It includes tests for IEC 60364 review classification, rendering, room counts, and conservative status handling. No Node.js, Python, CDN, or web server is required.
