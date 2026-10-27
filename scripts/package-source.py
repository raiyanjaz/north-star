"""Create a judge source archive from an explicit allowlist. Never packages env/state."""
from pathlib import Path
import zipfile
root=Path(__file__).resolve().parent.parent
files=[]
files.extend(root/name for name in ['launch.py','Start ARC.command','Start ARC.bat'])
for name in ['cities.py','station_locations.py','assignment_lifecycle.py','app.py','simulation.py','decision.py','integrations.py','agent.py','public_context.py','network.py','incident_intake.py','coordination.py','agent_control.py','meterless_client.py','zetaris_client.py','run.sh','README.md','.env.example','.gitignore']:
 files.append(root/name)
for folder in ['scripts','web','tests','vendor','fixtures','docs']:
 files.extend(p for p in (root/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
files.extend(p for p in (root/'artifacts').glob('*') if p.is_file() and p.suffix in ['.txt','.json','.pptx'])
output=root/'artifacts/arc-source.zip'
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(set(files)):z.write(p,'arc/'+str(p.relative_to(root)))
print('Prepared',output.name,'with',len(files),'files; no private environment or state')
