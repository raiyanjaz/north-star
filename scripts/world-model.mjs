import {WorldModel, externalId} from '../vendor/world-model/src/index.ts';
import readline from 'node:readline';
const world = new WorldModel({namespace:'arc',storage:'local',directory:process.env.ARC_DATA_DIR || 'data'});
for await (const line of readline.createInterface({input:process.stdin})) {
  try {
    const req=JSON.parse(line); const source={kind:'api',by:'arc',at:req.at || new Date().toISOString(),runId:req.runId};
    let result;
    if(req.action==='record') {
      const prior={};
      for(const item of req.items){
        const id=externalId(item.type,'arc',item.id);
        const old=world.view('graph').entity(id);
        prior[item.id]=old ? structuredClone(old.attrs) : null;
        if(JSON.stringify(old?.attrs)!==JSON.stringify(item.attrs)){
          await world.upsertEntity({type:item.type,externalKey:{system:'arc',id:item.id},name:item.name,attrs:item.attrs,source});
        }
      }
      if(req.assignment){
        const a=req.assignment;
        const incident=externalId('incident','arc',a.incident);
        const rec=await world.upsertEntity({type:'recommendation',externalKey:{system:'arc',id:a.id},attrs:a,source});
        await world.relate({from:incident,to:rec.id,type:'proposed',source});
        for(const [type,id] of [['ambulance',a.ambulance],['hospital',a.hospital]]) if(id)
          await world.relate({from:rec.id,to:externalId(type,'arc',id),type:'uses',source});
      }
      result={prior,events:world.events().length};
    } else if(req.action==='inspect') {
      result={engine:'Meterless World Model reference',entities:world.view('graph').query({}),events:world.events().slice(-35),audit:world.audit().slice(-20)};
    } else throw Error('Unknown engine action');
    console.log(JSON.stringify({ok:true,result}));
  } catch(e) { console.log(JSON.stringify({ok:false,error:'World Model operation failed'})); }
}
