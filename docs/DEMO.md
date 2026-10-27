# ARC demonstration and recording guide

Target an edited video of roughly three minutes, within the 1–4 minute submission
limit. Use the current React workspace and real sponsor services. Recording media
is kept locally and distributed separately from the source repository.

## Prepare Toronto

1. Start Zetaris and Nightshift, then launch ARC with the documented launcher.
2. Open http://127.0.0.1:4317/?city=toronto.
3. Choose the Queen & University general-service response case with a ready plan.
   The original case is INC-1042; the prepared duplicate is DEMO-203. Choose a
   ready proposal rather than an untriaged public report or a case waiting for a unit.
4. In Workspace controls, set Exercise journey speed to 30× before approving.
5. Wait for fresh evidence before recording the approval. Keep provider settings,
   credentials and unrelated notifications out of the capture.

A city reset clears that city's exercise state. Reset only before preparing a
fresh take, not during the recorded workflow. Existing operational data need not
be reset to inspect the app.

## Walkthrough

| Approximate time | Screen action | Point to explain |
| --- | --- | --- |
| 0:00–0:25 | Show Toronto map and inbox | Dispatcher decision support; real integrations and exercise operational data. |
| 0:25–0:45 | Select Queen & University; show inbox groups | ARC prepares/refreshes confirmed cases automatically; public reports require explicit response requirements. |
| 0:45–1:10 | Show unit, destination, estimates, Why this plan and Compare options | Eligibility, grounded evidence, exclusions, and separate ordinary-driving estimates. |
| 1:10–1:40 | Workspace controls → Hospital unavailable; return to Selected case | The old plan becomes unapprovable; ARC reassesses and explains a replacement. Pause narration during inference. |
| 1:40–2:00 | Approve a fresh revised plan; show Journey progress | Human approval atomically reserves resources. Journey movement is simulated at the explicitly selected 30× clock. |
| 2:00–2:40 | Open System details and show each sponsor section | Actual Zetaris query, Nightshift/NVIDIA model receipt, and actual Meterless World Model entities/history. |
| 2:40–3:15 | Return to the completed journey and Resources | Unit and receiving slot released; next steps are dispatcher validation and authorized operational feeds. |

Times exclude inference waiting. If waits are shortened, label the edit instead
of implying an instant response. Unit, destination and travel estimates can change;
describe what is actually shown rather than promising fixed values.

## Real and exercise boundaries

- Real integrations: public incident/source information, TomTom traffic/routing
  when configured, Zetaris queries, Nightshift/Nemotron inference and Meterless
  World Model execution.
- Exercise data/actions: fleet availability and movement, hospital receiving
  operations, prepared response requirements, controlled disruptions and local
  reservations. No real crews or hospitals receive dispatch instructions.
- Public hospital wait readings do not establish acceptance or receiving slots.
- Ordinary-driving estimates exclude emergency privileges, scene time and handover.

See [SIMULATION-NOTES.md](SIMULATION-NOTES.md) for the detailed boundaries and
[VALIDATION.md](VALIDATION.md) for verification evidence. Source setup, usage and
dependencies are documented in [README.md](../README.md).

## Submission status

The code repository is public. A video, slides and the final submission still
need to be attached through the team's submission workflow; publishing the source
repository alone does not submit an entry. Local raw takes, framing tests and
superseded generated edits are not included in the source checkout.
