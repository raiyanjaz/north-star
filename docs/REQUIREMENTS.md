# Verified hackathon requirements

Checked October 22, 2026 Toronto.

- Event and official rules: https://hackathon.genai.works/event/open-agent-hackathon-2026
- Setup guide, updated October 21: https://docs.google.com/document/d/1_d3osxbXZRpp4Ln80w6Obc5xx06SmkIMrgp6BOj0Ofc/edit
- Engine entrypoint: https://meterless.ai/engines.html
- Sponsor source: https://github.com/Meterless/Meterless
- Resources entrypoint: https://hackathon.genai.works/resources
  (public HTML was reachable but exposed no sponsor setup details; the participant guide supplied the actionable requirements).

Submission deadline October 27, 2026 at 23:45 UTC / 7:45 p.m. Toronto.
Primary track: The Agent That Can Explain Why.
Video: 1–4 minutes. Slides: problem/users, solution, workflow/architecture, stack,
sponsor integrations, unique sponsor use, product visuals, future enhancements.
GitHub source with setup/usage/dependencies README. Integration explanation includes
Zetaris, Meterless, NVIDIA contribution, and how Cursor was used.

Required sponsor functions: Zetaris for organizational data; at least one Meterless
Engine powering a working feature; Nightshift as primary runtime provider. NVIDIA
award requires a useful Nemotron feature through Nightshift and runtime evidence.

## Unresolved Cursor contradiction
Event rule 5: "teams must use Cursor for development."
Participant guide Build rule: "Cursor is recommended ... but it isn’t required."
The guide also retains older Cursor-required checklist wording. Therefore do not
claim full compliance. Human next step: ask organizer through HackOS help desk
which rule governs. If Cursor remains mandatory, do meaningful development/review
work in Cursor, keep evidence of that work and describe it truthfully. Opening a
folder alone is not evidence that Cursor was used for development.

## Prior work disclosure
Team discussed this idea before kickoff. Existing project code at implementation
start consisted of zetaris_client.py and meterless_client.py connectivity helpers,
README/configuration and no Git repository. Product implementation and sponsor
World Model integration were added during the build window. Declare the helpers
and upstream libraries. Do not claim all source was written from scratch.
