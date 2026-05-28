const fs=require("fs");
const vistorias=JSON.parse(fs.readFileSync("/home/claude/build/vistorias_data.json","utf8"));
let jsx=fs.readFileSync("App.jsx","utf8");

// 1. Adicionar VISTORIAS no início do arquivo (depois dos imports)
const importsEnd=jsx.indexOf("const MONTHLY = [");
if(importsEnd>0){
  const beforeMonthly=jsx.slice(0,importsEnd);
  const afterMonthly=jsx.slice(importsEnd);
  const vistoriaConst=`const VISTORIAS = ${JSON.stringify(vistorias)};\n`;
  jsx=beforeMonthly+vistoriaConst+afterMonthly;
  console.log("✅ VISTORIAS adicionado");
}

// 2. Adicionar VistoriaView função (bem antes de ReportsView)
const reportsIdx=jsx.indexOf("function ReportsView()");
if(reportsIdx>0){
  const vistoriaFunc=`
function VistoriaView(){
  const[sel,setS]=useState(null);
  return React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:18}},
    React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:12}},
      VISTORIAS.map((v,i)=>React.createElement("div",{key:i,onClick:()=>setS(i),style:{background:sel===i?x.surface3:x.surface2,border:"1px solid "+(sel===i?x.accent:x.border),borderRadius:12,padding:14,cursor:"pointer"}},
        React.createElement("div",null,
          React.createElement("div",{style:{fontSize:13,color:x.text,fontWeight:600}},v.placa+" • "+v.motorista),
          React.createElement("div",{style:{fontSize:11,color:x.textFaint,marginTop:4}},new Date(v.data).toLocaleDateString("pt-BR")+" • "+v.unidade)
        )
      ))
    ),
    sel!==null&&React.createElement("div",{style:{background:x.surface,border:"1px solid "+x.border,borderRadius:12,padding:20,marginTop:14}},
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}},
        React.createElement("div",{style:{background:x.surface3,borderRadius:10,padding:10}},React.createElement("div",{style:{fontSize:11,color:x.textFaint}},"Placa"),React.createElement("div",{style:{fontSize:12,color:x.text,fontWeight:600,marginTop:4}},VISTORIAS[sel].placa)),
        React.createElement("div",{style:{background:x.surface3,borderRadius:10,padding:10}},React.createElement("div",{style:{fontSize:11,color:x.textFaint}},"Motorista"),React.createElement("div",{style:{fontSize:12,color:x.text,fontWeight:600,marginTop:4}},VISTORIAS[sel].motorista)),
        React.createElement("div",{style:{background:x.surface3,borderRadius:10,padding:10}},React.createElement("div",{style:{fontSize:11,color:x.textFaint}},"KM"),React.createElement("div",{style:{fontSize:12,color:x.text,fontWeight:600,marginTop:4}},VISTORIAS[sel].km)),
        React.createElement("div",{style:{background:x.surface3,borderRadius:10,padding:10}},React.createElement("div",{style:{fontSize:11,color:x.textFaint}},"Unidade"),React.createElement("div",{style:{fontSize:12,color:x.text,fontWeight:600,marginTop:4}},VISTORIAS[sel].unidade))
      ),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}},
        React.createElement("a",{href:VISTORIAS[sel].fotos.frontal,target:"_blank",rel:"noopener",style:{background:x.surface3,borderRadius:8,padding:10,textAlign:"center",borderBottom:"2px solid "+x.accent,textDecoration:"none",color:x.accent,fontSize:11}},"📸 Frontal"),
        React.createElement("a",{href:VISTORIAS[sel].fotos.lateral_motorista,target:"_blank",rel:"noopener",style:{background:x.surface3,borderRadius:8,padding:10,textAlign:"center",borderBottom:"2px solid "+x.accent,textDecoration:"none",color:x.accent,fontSize:11}},"📸 Lateral"),
        React.createElement("a",{href:VISTORIAS[sel].fotos.traseira,target:"_blank",rel:"noopener",style:{background:x.surface3,borderRadius:8,padding:10,textAlign:"center",borderBottom:"2px solid "+x.accent,textDecoration:"none",color:x.accent,fontSize:11}},"📸 Traseira"),
        React.createElement("a",{href:VISTORIAS[sel].fotos.lateral_carona,target:"_blank",rel:"noopener",style:{background:x.surface3,borderRadius:8,padding:10,textAlign:"center",borderBottom:"2px solid "+x.accent,textDecoration:"none",color:x.accent,fontSize:11}},"📸 Carona")
      )
    )
  );
}

`;
  jsx=jsx.slice(0,reportsIdx)+vistoriaFunc+"\n"+jsx.slice(reportsIdx);
  console.log("✅ VistoriaView adicionada");
}

// 3. Adicionar ao menu
jsx=jsx.replace(
  /\{k:"reports",l:"Relatórios"/,
  '{k:"vistoria",l:"Vistoria",icon:CheckCircle2,grp:"Operações"},\n  {k:"reports",l:"Relatórios"'
);

// 4. Adicionar à renderização
jsx=jsx.replace(
  /{view==="reports"&&<ReportsView/,
  '{view==="vistoria"&&<VistoriaView/>}{view==="reports"&&<ReportsView'
);

fs.writeFileSync("App.jsx",jsx);
console.log("✅ Vistoria integrada ao App.jsx");
