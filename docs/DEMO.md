# ARC demonstration

Target length: 3 minutes, within verified 1–4 minute limit.
Keep OrbStack/Zetaris and Nightshift running. Hide all Console token fields.
Run ./run.sh and open http://127.0.0.1:4317. Use a wide browser (1440×900 ideal).
Reset simulation. The route fixtures make the predefined scenarios repeatable
within their stated 7-day validity. Refresh cache before recording if expired.

## Recording sequence and narration

| Time | Screen action | Narration |
| --- | --- | --- |
| 0:00–0:20 | Show incident desk and Toronto map | “ARC helps a Toronto dispatcher compare a unit, an appropriate destination, and a route. This is a decision-support simulation, with clearly labelled synthetic operational data.” |
| 0:20–0:45 | Select Queen & University. Assess response plan. Show loading stages. | “Nemotron chooses evidence tools. Zetaris combines fleet availability, hospital operations and road conditions. Explicit rules check equipment, service requirements and receiving status. OSRM supplies road-network driving estimates.” |
| 0:45–1:10 | Show response ETA, destination transport ETA and evidence age. Expand alternatives. | “Each recommendation includes the calculated travel time and concrete reasons alternatives were excluded. The model composes an explanation using verified evidence IDs. It cannot invent a distance or a hospital capability.” |
| 1:10–1:25 | Open Scenario controls; click Close approach road | “Now conditions change. A simulated closure crosses the current destination approach. The previous approval is immediately invalid.” |
| 1:25–1:55 | Reassess. Show changed destination and What changed | “ARC checks the routes again and recalls prior resource state through the actual Meterless World Model. It explains the revised assignment and requires fresh dispatcher approval.” |
| 1:55–2:15 | Approve assignment. Show reserved fleet and incident | “Approval atomically reserves the ambulance and a receiving slot. Another incident cannot take this unavailable unit.” |
| 2:15–2:45 | Open System details. Show SQL, Nemotron receipt and World Model events | “These are product requests, not separate connection tests. Zetaris federates three REST sources. Nightshift receipts identify NVIDIA Nemotron. Meterless’s pinned World Model reference supplies persistent entities, provenance and history. Its upstream conformance suite passes eight checks.” |
| 2:45–3:00 | Return to map | “ARC also blocks stale data, missing destinations and integration failures. The next step is validating the workflow with dispatchers and connecting authorized operational feeds.” |

Allow real inference to complete. If a model request runs long, trim waiting from
recording and label the edit; do not present a fabricated instant response. Never
claim the driving estimates are real ambulance ETAs or show synthetic values as live.

## Alternate reliable scenario
Use Hospital unavailable after baseline assessment. Reassess and show that the
selected destination changes with a concrete acceptance-status reason. This also
shows a prior/current hospital state comparison from World Model.

## Failure demonstrations (optional)
Reset between independent cases:
- More test conditions → Stale feed → Assess: no feasible assignment, stale reason.
- More test conditions → No destination → Assess: all hospitals excluded.
- Data failure / AI failure → Assess: explicit service failure, no silent fallback.
- Unit becomes busy → Assess: exclude the unit, choose the remaining eligible one.
- Reject: no unit or slot is reserved. Reassess for a new proposal.

## Recording status
Final status is recorded in docs/HANDOFF.md. A recording must show actual browser
interaction. If no recording artifact is produced, this exact sequence remains the
manual recording step. Do not submit a storyboard as a completed demo video.
