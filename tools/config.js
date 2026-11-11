// CONFIGURATION
// Legacy global entry points are retained for inline HTML event handlers.
// Phase 2: legacy global entry points are bound to oOneWireController below.
var CONFIGPAGE_LEFT, CONFIGPAGE_RIGHT, EXAMPLE0, EXAMPLE1;
var quotesvg, restart_all, importclicked, importjson, exportjson;
var popUp, load_schema, download, import_to_structure, HLCollapseExpand;
var HLDelete, HLAdd, HLInsertBefore, HLInsertAfter, HLInsertChild;
var HLUpdate, HLRedrawTree, HLRedrawTreeHTML, HLRedrawTreeSVG, SVGelement, reset_all;
var bytesToString = function(arr) { for (var i=0, str=""; i < arr.length; i++) str += String.fromCharCode(arr[i]); return str }
var SVG_unpack     = function(pkg) { return btoa(bytesToString(pako.inflateRaw(atob(pkg))))  }

function DiagramSVGAssets()
{
    this.outputSVGDefs = function()
    {

var toRad = function(angle) { return angle * (Math.PI / 180) }
var rn2 = function(val) { return Math.round(val * 100) / 100 }

var output = "<style>.el:hover .dr{ stroke:#ec008c }</style>\n"
+"<defs>\n"
+"<pattern id=VerticalStripe\n"
+"  x=5 y=0 width=5 height=10\n"
+"  patternUnits=userSpaceOnUse >\n"
+"  <line x1=0 y1=0 x2=0 y2=10 stroke=black />\n"
+"</pattern>\n"
+"<g id=ster>\n"
+"  <line x1=0 y1=-5 x2=0 y2=5 style=stroke:black />\n"
+"  <line x1=-4.33 y1=-2.5 x2=4.33 y2=2.5 style=stroke:black />\n"
+"  <line x1=-4.66 y1=2.5 x2=4.33 y2=-2.5 style=stroke:black />\n"
+"</g>\n"
+"<g id=sinus>\n"
+"  <path d='M0,0 C2,-5 8,-5 10,0 S18,5 20,0' style=stroke:black;fill:none />\n"
+"</g>\n"
+"<g id=lamp>\n"
+"<line x1=-10.61 y1=-10.61 x2=10.61 y2=10.61 stroke=black stroke-width=2 />\n"
+"  <line x1=-10.61 y1=10.61 x2=10.61 y2=-10.61 stroke=black stroke-width=2 />\n"
+"</g>\n"
+"<g id=schakelaar_enkel class=el>\n"
+"  <line x1="+rn2(5*Math.cos(toRad(60)))+" y1="+rn2(-5*Math.sin(toRad(60)))+" x2=10 y2=-20 stroke=black class=dr />\n"
+"  <line x1=10 y1=-20 x2=15 y2=-17.5 stroke=black class=dr />\n"
+"  <circle cx=0 cy=0 r=5 fill=white fill-opacity=0 stroke=black class=dr />\n"
+"</g>\n"
+"<g id=schakelaar_dubbel>\n"
//+"  <line x1=0 y1=0 x2=10 y2=-20 stroke=black />\n"
+"  <line x1="+rn2(5*Math.cos(toRad(60)))+" y1="+rn2(-5*Math.sin(toRad(60)))+" x2=10 y2=-20 stroke=black />\n"
+"  <line x1=10 y1=-20 x2=15 y2=-17.5 stroke=black />\n"
+"  <line x1=8 y1=-16 x2=13 y2=-13.5 stroke=black />\n"
+"  <circle cx=0 cy=0 r=5 fill=white fill-opacity=0 stroke=black />\n"
+"</g>\n"
+"<g id=schakelaar_wissel_enkel>\n"
//+"  <line x1=0 y1=0 x2=10 y2=-20 stroke=black />\n"
+"  <line x1="+rn2(5*Math.cos(toRad(60)))+" y1="+rn2(-5*Math.sin(toRad(60)))+" x2=10 y2=-20 stroke=black />\n"
+"  <line x1=10 y1=-20 x2=15 y2=-17.5 stroke=black />\n"
//+"  <line x1=0 y1=0 x2=-10 y2=20 stroke=black />\n"
+"  <line x1="+rn2(-5*Math.cos(toRad(60)))+" y1="+rn2(5*Math.sin(toRad(60)))+" x2=-10 y2=20 stroke=black />\n"
+"  <line x1=-10 y1=20 x2=-15 y2=17.5 stroke=black />\n"
+"  <circle cx=0 cy=0 r=5 fill=white fill-opacity=0 stroke=black />\n"
+"</g>\n"
+"<g id=schakelaar_kruis_enkel>\n"
//+"  <line x1=0 y1=0 x2=10 y2=-20 stroke=black />\n"
+"  <line x1="+rn2(5*Math.cos(toRad(60)))+" y1="+rn2(-5*Math.sin(toRad(60)))+" x2=10 y2=-20 stroke=black />\n"
+"  <line x1=10 y1=-20 x2=15 y2=-17.5 stroke=black />\n"
//+"  <line x1=0 y1=0 x2=-10 y2=20 stroke=black />\n"
+"  <line x1="+rn2(-5*Math.cos(toRad(60)))+" y1="+rn2(5*Math.sin(toRad(60)))+" x2=-10 y2=20 stroke=black />\n"
+"  <line x1=-10 y1=20 x2=-15 y2=17.5 stroke=black />\n"
//+"  <line x1=0 y1=0 x2=-10 y2=-20 stroke=black />\n"
+"  <line x1="+rn2(-5*Math.cos(toRad(60)))+" y1="+rn2(-5*Math.sin(toRad(60)))+" x2=-10 y2=-20 stroke=black />\n"
+"  <line x1=-10 y1=-20 x2=-15 y2=-17.5 stroke=black />\n"
//+"  <line x1=0 y1=0 x2=10 y2=20 stroke=black />\n"
+"  <line x1="+rn2(5*Math.cos(toRad(60)))+" y1="+rn2(5*Math.sin(toRad(60)))+" x2=10 y2=20 stroke=black />\n"
+"  <line x1=10 y1=20 x2=15 y2=17.5 stroke=black />\n"
+"  <circle cx=0 cy=0 r=5 fill=white fill-opacity=0 stroke=black />\n"
+"</g>\n"
+"<g id=schakelaar_wissel_dubbel>\n"
//+"  <line x1=0 y1=0 x2=10 y2=-20 stroke=black />\n"
+"  <line x1="+rn2(5*Math.cos(toRad(60)))+" y1="+rn2(-5*Math.sin(toRad(60)))+" x2=10 y2=-20 stroke=black />\n"
+"  <line x1=10 y1=-20 x2=15 y2=-17.5 stroke=black />\n"
+"  <line x1=8 y1=-16 x2=13 y2=-13.5 stroke=black />\n"
//+"  <line x1=0 y1=0 x2=-10 y2=20 stroke=black />\n"
+"  <line x1="+rn2(-5*Math.cos(toRad(60)))+" y1="+rn2(5*Math.sin(toRad(60)))+" x2=-10 y2=20 stroke=black />\n"
+"  <line x1=-10 y1=20 x2=-15 y2=17.5 stroke=black />\n"
+"  <line x1=-8 y1=16 x2=-13 y2=13.5 stroke=black />\n"
+"  <circle cx=0 cy=0 r=5 fill=white fill-opacity=0 stroke=black />\n"
+"</g>\n"
+"<g id=schakelaar_druk>\n"
+"  <circle cx=0 cy=0 r=10 fill=white fill-opacity=0 stroke=black />\n"
+"  <circle cx=0 cy=0 r=5 fill=white fill-opacity=0 stroke=black />\n"
+"</g>\n"
+"<g id=stopcontact>\n"
+"  <path d='M20 0 A15 15 0 0 1 35 -15' stroke=black fill=white fill-opacity=0 stroke-width=2 />\n"
+"  <path d='M20 0 A15 15 0 0 0 35 15' stroke=black fill=white fill-opacity=0 stroke-width=2 />\n"
+"  <line x1=0 y1=0 x2=20 y2=0 stroke=black />\n"
+"</g>\n"
+"<g id=stopcontact_aarding>\n"
+"  <line x1=20 y1=-15 x2=20 y2=15  stroke=black stroke-width=2 />\n"
+"</g>\n"
+"<g id=stopcontact_kinderveilig>\n"
+"  <line x1=35 y1=-20 x2=35 y2=-14  stroke=black stroke-width=2 />\n"
+"  <line x1=35 y1=20 x2=35 y2=14  stroke=black stroke-width=2 />\n"
+"</g>\n"
+"<g id=\"bel\">\n"
+"  <path d=\"M20 0 A15 15 0 0 1 0 15\" stroke=\"black\" fill=\"white\" fill-opacity=0 stroke-width=\"2\" />\n"
+"  <path d=\"M20 0 A15 15 0 0 0 0 -15\" stroke=\"black\" fill=\"white\" fill-opacity=0 stroke-width=\"2\" />\n"
+"  <line x1=\"0\" y1=\"15\" x2=\"0\" y2=\"-15\" stroke=\"black\" />\n"
+"</g>\n"
+"<g id=boiler>\n"
+"  <circle cx=20 cy=0 r=20 style=stroke:black;fill:url(#VerticalStripe) />\n"
+"</g>\n"
+"<g id=boiler_accu>\n"
+"  <circle cx=20 cy=0 r=20 style=stroke:black;fill:none />\n"
+"  <circle cx=20 cy=0 r=15 style=stroke:black;fill:url(#VerticalStripe) />\n"
+"</g>\n"
+"<g id=vrije_tekst>\n"
+"  <rect x=0 y=-20 width=40 height=40 fill=none style=stroke:black />\n"
+"</g>\n"
+"<g id=diepvriezer>\n"
+"  <rect x=0 y=-20 width=40 height=40 fill=none style=stroke:black />\n"
+"  <use xlink:href=#ster x=10 y=0 />\n"
+"  <use xlink:href=#ster x=20 y=0 />\n"
+"  <use xlink:href=#ster x=30 y=0 />\n"
+"</g>\n"
+"<g id=teleruptor>\n"
+"  <rect x=0 y=-13 width=40 height=26 fill=none style=stroke:black />\n"
+"  <line x1=8 y1=6 x2=16 y2=6  stroke=black />\n"
+"  <line x1=24 y1=6 x2=32 y2=6  stroke=black />\n"
+"  <line x1=16 y1=-6 x2=16 y2=6  stroke=black />\n"
+"  <line x1=24 y1=-6 x2=24 y2=6  stroke=black />\n"
+"</g>\n"
+"<g id=dimmer>\n"
+"  <rect x=0 y=-13 width=40 height=26 fill=none style=stroke:black />\n"
+"  <line x1=10 y1=5 x2=30 y2=5  stroke=black />\n"
+"  <line x1=10 y1=5 x2=10 y2=-5  stroke=black />\n"
+"  <line x1=10 y1=-5 x2=30 y2=5  stroke=black />\n"
+"</g>\n"
+"<g id=relais>\n"
+"  <rect x=0 y=-13 width=40 height=26 fill=none style=stroke:black />\n"
+"  <line x1=10 y1=-13 x2=30 y2=13  stroke=black />\n"
+"</g>\n"
+"<g id=\"bewegingsschakelaar\">\n"
+"  <rect x=\"0\" y=\"-13\" width=\"10\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n"
+"  <rect x=\"10\" y=\"-13\" width=\"30\" height=\"26\" fill=\"none\" style=\"stroke:black\" />\n"
+"  <line x1=\"10\" y1=\"13\" x2=\"40\" y2=\"-13\"  stroke=\"black\" />\n"
+"  <line x1=\"15\" y1=\"-5\" x2=\"20\" y2=\"-5\"  stroke=\"black\" />\n"
+"  <line x1=\"20\" y1=\"-10\" x2=\"20\" y2=\"-5\"  stroke=\"black\" />\n"
+"  <line x1=\"20\" y1=\"-10\" x2=\"25\" y2=\"-10\"  stroke=\"black\" />\n"
+"  <text x='22' y='11' style='text-anchor:left' font-family='Arial, Helvetica, sans-serif' font-weight='bold' font-size='10'>PIR</text>\n"
+"</g>\n"
+"<g id=droogkast>\n"
+"  <rect x=0 y=-20 width=40 height=40 fill=none style=stroke:black />\n"
+"  <circle cx=15 cy=-7.5 r=5 style=stroke:black;fill:none />\n"
+"  <circle cx=25 cy=-7.5 r=5 style=stroke:black;fill:none />\n"
+"  <circle cx=20 cy=7.5 r=3 style=stroke:black;fill:black />\n"
+"</g>\n"
+"<g id=koelkast>\n"
+"  <rect x=0 y=-20 width=40 height=40 fill=none style=stroke:black />\n"
+"  <use xlink:href=#ster x=20 y=0 />\n"
+"</g>\n"
+"<g id=kookfornuis>\n"
+"  <rect x=0 y=-20 width=40 height=40 fill=none style=stroke:black />\n"
+"  <circle cx=10 cy=10 r=3 style=stroke:black;fill:black />\n"
+"  <circle cx=30 cy=10 r=3 style=stroke:black;fill:black />\n"
+"  <circle cx=30 cy=-10 r=3 style=stroke:black;fill:black />\n"
+"</g>\n"
+"<g id=microgolf>\n"
+"  <rect x=0 y=-20 width=40 height=40 fill=none style=stroke:black />\n"
+"  <use xlink:href=#sinus x=10 y=-10 />\n"
+"  <use xlink:href=#sinus x=10 y=0 />\n"
+"  <use xlink:href=#sinus x=10 y=10 />\n"
+"</g>\n"
+"<g id=oven>\n"
+"  <rect x=0 y=-20 width=40 height=40 fill=none style=stroke:black />\n"
+"  <line x1=0 y1=-5 x2=40 y2=-5 stroke=black />\n"
+"  <circle cx=20 cy=7.5 r=3 style=stroke:black;fill:black />\n"
+"</g>\n"
+"<g id=vaatwasmachine>\n"
+"  <rect x=0 y=-20 width=40 height=40 fill=none style=stroke:black />\n"
+"  <line x1=0 y1=-20 x2=40 y2=20 style=stroke:black;fill:none />\n"
+"  <line x1=40 y1=-20 x2=0 y2=20 style=stroke:black;fill:none />\n"
+"  <circle cx=20 cy=0 r=8 style=stroke:black;fill:white />\n"
+"</g>\n"
+"<g id=ventilator>\n"
+"  <rect x=0 y=-15 width=30 height=30 fill=none style=stroke:black />\n"
+"  <circle cx=10 cy=0 r=5 style=stroke:black;fill:none />\n"
+"  <circle cx=20 cy=0 r=5 style=stroke:black;fill:none />\n"
+"</g>\n"
+"<g id=leeg>\n"
+"  <circle cx=5 cy=0 r=5 style=stroke:black;fill:none />\n"
+"</g>\n"
+"<g id=transformator>\n"
+"  <circle cx=8 cy=0 r=8 style=stroke:black;fill:none />\n"
+"  <circle cx=20 cy=0 r=8 style=stroke:black;fill:none />\n"
+"</g>\n"
+"<g id=verwarmingstoestel>\n"
+"  <rect x=0 y=-15 width=50 height=30 fill=url(#VerticalStripe) style=stroke:black />\n"
+"</g>\n"
+"<g id=verwarmingstoestel_accu>\n"
+"  <rect x=0 y=-15 width=50 height=30 fill=none style=stroke:black />\n"
+"  <rect x=5 y=-10 width=40 height=20 fill=url(#VerticalStripe) style=stroke:black />\n"
+"</g>\n"
+"<g id=verwarmingstoestel_accu_ventilator>\n"
+"  <rect x=0 y=-15 width=70 height=30 fill=none style=stroke:black />\n"
+"  <rect x=5 y=-10 width=35 height=20 fill=url(#VerticalStripe) style=stroke:black />\n"
+"  <circle cx=50 cy=0 r=5 style=stroke:black;fill:none />\n"
+"  <circle cx=60 cy=0 r=5 style=stroke:black;fill:none />\n"
+"</g>\n"
+"<g id=wasmachine>\n"
+"  <rect x=0 y=-20 width=40 height=40 fill=none style=stroke:black />\n"
+"  <circle cx=20 cy=0 r=3 style=stroke:black;fill:black />\n"
+"  <circle cx=20 cy=0 r=15 style=stroke:black;fill:none />\n"
+"</g>\n"
+"<g transform=rotate(-20) id=zekering_automatisch>\n"
+"  <line x1=0 y1=-30 x2=0 y2=0  stroke=black />\n"
+"  <rect x=-4 y=-30 width=4 height=10 style=fill:black />\n"
+"</g>\n"
+"<g id=zekering_smelt>\n"
+"  <rect x=-4 y=-30 width=8 height=30 style=stroke:black;fill:none />\n"
+"  <line x1=0 y1=-30 x2=0 y2=0 stroke=black />\n"
+"</g>\n"
+"</defs>\n"
return output;
    };
}
var oDiagramSVGAssets = new DiagramSVGAssets();


var C_SVG =
{"gear.svg":"vVbLbttIEPwVQeceal4ckk6cw+aylz3lAxbKRLCNcG3D8kpOvn6rakjJAXJewKbImZ7ururqJj8eT3eb0+Hl+PD0eLsNXdhuHr7dbj/vn/d/4/7tn/nxeLu9f319vtnt"
+"zudzd07d08vdLnrvdzi7mNy8zQ+P339nGKZp2mkXprdb//y23fxYfk8Ph/MfT1zd+E0exm7waf3dbo6vP+bD7fbwuP86H9zXff1+9/L07+O3m8fDefObEx+Uy83xeV9x"
+"7PnlcDy8nA7bTx/v9Pe8f73fANpfuc9dtDBOXfBhdil1xfXdUF3qehdCl9zoYuyiC1xIsStzmDqsDTAau0yb0YYucGXCqejS2MFTlBUuFf6K/gOcdYOLHoYjYxSE9i7E"
+"LljAWoAb67t+pq/Rgg4HDz89j8GMT5lJjsxnmuUWj7G6yFwy8sUFxrpMyIZ39y7jcOVWj4Cx0Ds90cJoQU+jpVyJJxqxMp4BCkH3hnCD8gIrDZQjVSHgYM/MI2+qAwmE"
+"1HcZToKwwskgPiaLK6TI+JHBiiGdROJMxEVvcWSyPaN6ONfBQHipS4ZsBtUpgqoiTMkInjDsAp6h4kmwvQk3AZugX/bnlOFkrInbxI3AJtyEy1CoBeDCeujADepNu9Gx"
+"UKy3XdOe6JjwkBUzgwsCt5WBqmJbUBWxxGIT40y04KkiP1Y/8cRgEzykIDczvVGYNTI+8QYhWGHo7h5YY20VFkzXAK8amKkheZGqCVm6HgmzSN4zRd1k1wMZYkuOTDVK"
+"l958VYENBaaPYKuY56veW2VVYwCg2pJd+2LtHhLV00yVAQOB4C5NtjRiqdI0gUvSF+CS7km6/syWh0Q82sIHy2Wkzyl0PZ/e9/fPDfqd5McCbrykAe+skBREKhEbXm2g"
+"AJMR3QR3ufE5oi4TZ8PYlMYqoX4jGyBbDtyEPmEO3A0ZfRRZzypYgqvKCgdtwMp5EZTbzFh6hBaegOGXE4BZ+7ZR2GBgTDTrOFSaVuFXl1tpnGhN60TwahaWbGgFiGS7"
+"uLyIMRNwFB+ThFjUeAQ9S+85MnizCOo5CEsI4mW+EK0mEXmLIiHitGtnJ1LqSOXU2lqUthZGosifrTDheEb2hVutWyIOQSs4KF23DfCjGeHVj6OpWVNPdUyMxh1kal5H"
+"+dRzOYu96HzrQyd874a11xpSQwhKg5lllq6Q476S2azplprIPbuHRWUWnPEhNYIDVSGCiRGoenU8eG1DfeIAz4wycIA3JZLTqPuF36bx6hu5ojWv3M/wPbih9ouIJ4Zr"
+"s50xalo7hpzGcZ06qAbog2WR7ClS55spxE/+wGNtS9SNpHxh4kKVl6ogZNV7tIXNKoXiidRTLqJ+JnmsTamNvaA3AGlkc4yksYbUKinu2GTkTizWXuXKRg0VW7Uz871D"
+"CmtrhmQLc7aI717kiTpitdbqEu080P1QucRWz+putKoXfxUjLlhqDdkbXwLwJQYJgS6G1t9q9KXFBJMUkobW2UFaXBq1SoAWpBu99anfd28PrxWEgVvWe50My+jQhwl6"
+"UcVIbXKu86XqoyG1t1ex1uKXuUQO+vbStKmxr2k2c9itHIk4tbgtJOoV+qem5s/t7t2HU0yTBnbpvOfbmu0YPJPKRa3R8sP1yAV7t7As6+qum+3MlziVq2P7JQzmd3tO"
+"KE5hWGaHwIM+ITDp2x0vx8ujXdf0yA27bHyJIyW6eLRf/Avx7q79/28//JL+9B8"

,"example000.svg":"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"

,"example001.svg":"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"

,"import_icon.svg":"vVTLjtswDPwVw2eJ1vuRJjk0l730mmvh9RpJsK5jxKmd7deXolRsF22vRQCKNkfD0VDOdl5O1dLf5st13NUSZF1dXnb1oZ3ar5g/vg3jvKvP9/u0aZp1XWHVcL2dGiWE"
+"aHBvgWwew2V8/RtQxhgbqiJ0V4vpUVdvZV0u/fr5mt5WonICotBlqav5/jb0u7of2+eh589t93q6Xb+PL5uxX6s/8J9Ix2ae2g43Tbd+7m9LX++3p/12au/nCs/0xUSw"
+"TjLpwDjzpCMYu7izFCCl7DQIEZhgFrRBDFhtS64gWL8oB074TmBJK8kVaK2pFPg7LDxJLJuOJzbPBJV4IvM5JdBRYa5MJ3jiUoy4com9o7KwhbvMeTAQQxHvUKcSoK1P"
+"CZFlfRb1Ic4FltEhSWe0P+dnHUAp3bmymUqoNkRZcoIVhQcyV+VeaIeFqH75xz64+aNufjMarbUqMhXRBTRDgEdFgmdTBaiYjiiRSkAIA7b31rEU7RFbOanw1EeNp/fk"
+"kbMuOWU0p9/MdRqCQd1ML6jaRLO4RWpQOpFFGymG1NkGVyJusYanjrk5pfM/RHX4XnrFUiwpjjQ5ZkAZOQTk94xiR/QsR2qSGLxniS2nCMmXC1fp8qo0E3N6tuUZsV1x"
+"iq5f0qqiJBpONLkrz11JFEmTLOdJIKrnpPBgJAicEs5ARbwOgpY8EfZhPjS65kSfyv9Z0v/G/ic="
}


CONFIGPAGE_LEFT = "\n<div id=\"needtowrap\">\n<br>\n<font size=\"+1\">\n"+_T("intro")+"\n</i>\n</font>\n</div><br"
+">\n<table border=\"1px\" style=\"border-collapse:collapse\" align=\"center\" width=\"100%\">\n<tr>\n<td width="
+"\"25%\" align=\"center\" bgcolor=\"LightGrey\">\n<b>"+_T("title1")+"</b>\n</td>\n<td width=\"25%\" ali"
+"gn=\"center\" bgcolor=\"LightGrey\">\n<b>"+_T("title2")+"</b>\n</td>\n<td width=\"25%\" align=\"center"
+"\" bgcolor=\"LightGrey\">\n<b>"+_T("title3")+"</b>\n</td>\n<td width=\"25%\" align=\"center\" bgcolor="
+"\"LightGrey\">\n<b>"+_T("title4")+"</b>\n</td>\n</tr>\n<tr>\n<td width=\"25%\" align=\"center\">\n<br>\n"
+"<img src=\"data:image/svg+xml;base64,"+SVG_unpack(C_SVG["example000.svg"])+"\" height=\"300px\">"
+"<br><br>\n"+_T("description1")+"\n<br><br>\n</td>\n<td width=\"25%\" align=\"center\">\n<br>\n"
+"<img src=\"data:image/svg+xml;base64,"+SVG_unpack(C_SVG["example001.svg"])+"\" height=\"300px\">"
+"<br><br>\n"+_T("description2")+"\n<br><br>\n</td>\n<td width=\"25%\" align=\"center\">\n<br>\n"
+"<img src=\"data:image/svg+xml;base64,"+SVG_unpack(C_SVG["gear.svg"])+"\" height=\"100px\"><br><br>\n"



CONFIGPAGE_RIGHT = "\n<br><br>\n</td>\n<td width=\"25%\" align=\"center\">\n<br>\n<img src=\"data:image/svg+xml;base64,"+SVG_unpack(C_SVG["import_icon.svg"])+"\" height=\"100px\">"
+"<br><br>\n"+_T("import_notice")+"\n<br><br>\n</td>\n</tr>\n<tr>\n<td width=\"25%\" align=\"center\">\n<br>\n"
+"<button onclick=\"load_schema(0)\">"+_T("continue_option")+"</button>\n<br><br>\n</td>\n<td width=\"25%\" align=\"center\">\n<br>\n"
+"<button onclick=\"load_schema(1)\">"+_T("continue_option")+"</button>\n<br><br>\n</td>\n<td width=\"25%\" align=\"center\">\n<br>\n"
+"<button onclick=\"load_schema(2)\">"+_T("continue_option")+"</button>\n<br><br>\n</td>\n<td width=\"25%\" align=\"center\">\n<br>\n"
+"<button onclick=\"load_schema(3)\">"+_T("continue_option")+"</button>\n<br><br>\n</td>\n</tr>\n</table>\n"


var C_EXAMPLE0 = "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"

//var EXAMPLE0 = bytesToString(pako.inflateRaw(atob(C_EXAMPLE0)))

var C_EXAMPLE1 = "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"

function OneWireController()
{
    this.quoteSVG = function(_str)
{
    var newhtml = null;
    while(_str != newhtml){
       if(newhtml)
            _str = newhtml;
       newhtml = _str.replace(/(<[^>]+?=)([^"'\s>][^\s>]*)/,"$1'$2'");
    }
		//alert(newhtml)
    return _str;
}


////////// GUI EVENT HANDLERS - MAIN MENU AREA //////////

// menu item 'NEW'
    this.restartAll = function() {

    var strleft = CONFIGPAGE_LEFT;

    strleft +=
        "\n    "+_T("description3")+"  ";

    for (var i = 1; i < 51; i++) {
        if (i == 7) {
            strleft = strleft + "<option selected=selected value=" + i + ">" + i + "</option>";
        }
        else {
            strleft = strleft + "<option value=" + i + ">" + i + "</option>";
        }
    }
    strleft += "\n    </select>\n    <br>\n    "+_T("circuits_wet")+"\n    <select id=\"aantal_natte_kringen\">\n  ";
    for (var i = 1; i < 21; i++) {
        if (i == 3) {
            strleft = strleft + "<option selected=selected value=" + i + ">" + i + "</option>";
        }
        else {
            strleft = strleft + "<option value=" + i + ">" + i + "</option>";
        }
    }
    strleft += "\n    </select><br><br>\n"+_T("phases_wet")+"<select id=\"aantal_fazen_nat\"><option value=\"2\">2p</option><option value=\"3\">3p</option>"
    +"<option value=\"4\">4p (3p+n)</option></select><br>\n"+_T("differential_wet")+"<input id=\"differentieel_nat\" type=\"text\" size=\"5\" maxlength=\"5\" value=\"30\"><br>\n";

    var strright = "<br><br><br><br>\nDeze tool tekent een &eacute;&eacute;ndraadschema.\nDe tool is in volle ontwikkeling en laat thans toe meer co"
    +"mplexe\nschakelingen met gesplitste kringen en horizontale aaneenschakelingen\nvan gebruikers (bvb koelkast achter een stopconta"
    +"ct) uit te voeren.\n<br><br>\nEveneens kunnen de schemas worden opgeslagen en weer ingeladen\nvoor latere aanpassing (zie knoppe"
    +"n \"export\" en \"bladeren\").\n<br><br>\nOp basis van een screenshot-tool (bvb snipping-tool in Windows) kan het gegenereerde\n"
    +"&eacute;&eacute;ndraadschema verder verwerkt worden in een meer complete schets.\nEen andere mogelijkheid is het eendraadschema "
    +"te exporteren (SVG-vector-graphics) en verder te verwerken\nmet een professionele tool zoals Inkscape (open source optie).\n<br>"
    +"<br>\n Nuttige tips:\n<ul>\n<li>Kies \"meerdere gebruikers\" om horizontale ketens te bouwen, bijvoorbeeld een koelkast na een s"
    +"topcontact.</li>\n<li>Een schakelbaar stopcontact kan gemaakt worden door onder \"meerdere gebruikers\" eerst een lichtcircuit m"
    +"et \"0\" lampen gevolgd door een stopcontact te voorzien.</li>\n</ul>\n"


    strleft += CONFIGPAGE_RIGHT;
    document.getElementById("configsection").innerHTML = strleft;
    document.getElementById("left_col_inner").innerHTML = "";
    document.getElementById("right_col_inner").innerHTML = "";
}

// menu item 'IMPORT'
    this.importClicked = function() {
    document.getElementById('importfile').click();  // file requester triggers importjson
    document.getElementById('importfile').value = "";
}

    this.importJSON = function (event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        import_to_structure(text);
    };
    reader.readAsText(input.files[0]);
}

// menu item 'EXPORT'
    this.exportJSON = function() {
    var filename;
    filename = "eendraadschema.eds";
    var text = JSON.stringify(oHierarchicalList);
    var element = document.createElement('a');
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// menu item 'INFO/CONTACT'
    this.popUp = function(URL)
{
    var id = 17993;
    var w = 800;
    var h = 500;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var features = "toolbar=no, location=no, directories=no, status=no, menubar=no, " +
        "scrollbars=no, resizable=no, copyhistory=no, width=" + w +
        ", height=" + h + ", top=" + top + ", left=" + left;
    window["page" + id] = window.open(URL, String(id), features);
};

// schema pre-load buttons
    this.loadSchema = function(nr) {
    switch (nr) {
        case 0:
						EXAMPLE0 = bytesToString(pako.inflateRaw(atob(C_EXAMPLE0)));
            EXAMPLE0 = EXAMPLE0.replace(/\\"/g, '"').replace(/\\n/g, String.fromCharCode(10));
            import_to_structure(EXAMPLE0);
            break;
        case 1:
						EXAMPLE1 = bytesToString(pako.inflateRaw(atob(C_EXAMPLE1)));
            EXAMPLE1 = EXAMPLE1.replace(/\\"/g, '"').replace(/\\n/g, String.fromCharCode(10));
            import_to_structure(EXAMPLE1);
            break;
        case 2:
            CONF_aantal_droge_kringen = parseInt(document.getElementById("aantal_droge_kringen").value);
            CONF_aantal_natte_kringen = parseInt(document.getElementById("aantal_natte_kringen").value);
            CONF_aantal_fazen_droog = parseInt(document.getElementById("aantal_fazen_droog").value);
            CONF_aantal_fazen_nat = parseInt(document.getElementById("aantal_fazen_nat").value);
            CONF_hoofdzekering = parseInt(document.getElementById("hoofdzekering").value);
            CONF_differentieel_droog = parseInt(document.getElementById("differentieel_droog").value);
            CONF_differentieel_nat = parseInt(document.getElementById("differentieel_nat").value);
            reset_all();
            break;
        case 3:
        		importclicked();
            break;
    }
}

////////// GUI EVENT HANDLERS - DRAWING AREA //////////

// download buttons
    this.download = function(type) {
    var filename;
    switch (type) {
        case "html": {
            filename = "eendraadschema.html";
            break;
        }
        case "svg": {
            filename = "eendraadschema.svg";
            break;
        }
    }
    var text = oHierarchicalList.toSVG(0, "horizontal").data;
    var element = document.createElement('a');
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

//////////////////////////////////////////////



    this.importToStructure = function(text) {
    var mystructure = new HierarchicalList();
    oHierarchicalList = structure = new HierarchicalList();
    var obj = JSON.parse(text);
    Object.assign(mystructure, obj);
    for (var i = 0; i < mystructure.length; i++) {
        if (mystructure.data[i].parent == 0) {
            oHierarchicalList.addItem(new ElectroItem());
            oHierarchicalList.data[i].parent = 0;
        }
        else {
            oHierarchicalList.addItem(new ElectroItem(oHierarchicalList.data[oHierarchicalList.getOrdinalById(mystructure.data[i].parent)]));
            oHierarchicalList.data[i].parent = mystructure.data[i].parent;
        }
        oHierarchicalList.active[i] = mystructure.active[i];
        oHierarchicalList.id[i] = mystructure.id[i];
        for (var j = 0; j < mystructure.data[i].keys.length; j++) {
            oHierarchicalList.data[i].keys[j] = mystructure.data[i].keys[j];
        }
        oHierarchicalList.data[i].id = mystructure.data[i].id;
        oHierarchicalList.data[i].indent = mystructure.data[i].indent;
        oHierarchicalList.data[i].collapsed = mystructure.data[i].collapsed;
        //Parent_Item: List_Item;
    }
    HLRedrawTree();
}


    this.collapseExpand = function(my_id, state) {
    var ordinal;
    ordinal = oHierarchicalList.getOrdinalById(my_id);
    if (state == undefined) {
        oHierarchicalList.data[ordinal].collapsed = !oHierarchicalList.data[ordinal].collapsed;
    }
    else {
        oHierarchicalList.data[ordinal].collapsed = state;
    }
    HLRedrawTree();
}

    this.deleteItem = function(my_id) {
    oHierarchicalList.deleteById(my_id);
    HLRedrawTree();
}
    this.addItem = function(my_id) {
    oHierarchicalList.addItem(new ElectroItem());
    HLRedrawTree();
}
    this.insertBefore = function(my_id) {
    oHierarchicalList.insertItemBeforeId(new ElectroItem(), my_id);
    HLRedrawTree();
}
    this.insertAfter = function(my_id) {
    oHierarchicalList.insertItemAfterId(new ElectroItem(), my_id);
    HLRedrawTree();
}
    this.insertChild = function(my_id) {
    oHierarchicalList.insertChildAfterId(new ElectroItem(), my_id);
    HLCollapseExpand(my_id, false);
    //No need to call HLRedrawTree as HLCollapseExpand already does that
}

    this.updateItem = function (my_id, key, type, docId) {
    switch (type) {
        case "SELECT":
            var setvalueselect = document.getElementById(docId).value;
            oHierarchicalList.data[oHierarchicalList.getOrdinalById(my_id)].setKey(key, setvalueselect);
            HLRedrawTreeHTML();
            break;
        case "STRING":
            var setvaluestr = document.getElementById(docId).value;
            oHierarchicalList.data[oHierarchicalList.getOrdinalById(my_id)].setKey(key, setvaluestr);
            break;
        case "BOOLEAN":
            var setvaluebool = document.getElementById(docId).checked;
            oHierarchicalList.data[oHierarchicalList.getOrdinalById(my_id)].setKey(key, setvaluebool);
            HLRedrawTreeHTML();
            break;
    }
    HLRedrawTreeSVG();
}

    this.redrawTree = function() {
    HLRedrawTreeHTML();
    HLRedrawTreeSVG();
}

    this.redrawTreeHTML = function () {
    document.getElementById("configsection").innerHTML = "";
    document.getElementById("left_col_inner").innerHTML = oHierarchicalList.toHTML(0);
}
    this.redrawTreeSVG = function () {
    document.getElementById("right_col_inner").innerHTML = "<b>"+_T("drawing","cap")+": </b><button onclick=download(\"html\")>"+_T("download_html","cap")+"</button>";
    document.getElementById("right_col_inner").innerHTML += "&nbsp;<button onclick=download(\"svg\")>"+_T("download_svg","cap")+"</button><br><br>";
    document.getElementById("right_col_inner").innerHTML += oHierarchicalList.toSVG(0, "horizontal").data;
    document.getElementById("right_col_inner").innerHTML += "\n<h2>"
    +_T("legend","cap")+":</h2>\n<button style=\"background-color:"+_T("_COL").insert_item+";\">&#9650;</button> "
    +_T("insert_above")+"<br>\n<button style=\"background-color:"+_T("_COL").insert_item+";\">&#9660;</button> "
    +_T("insert_below")+"<br>\n<button style=\"background-color:"+_T("_COL").insert_item+";\">&#9654;</button> "
    +_T("insert_child")+"<br>\n<button style=\"background-color:"+_T("_COL").delete_item+";\">&#9851;</button>"+_T("delete_item")+"<br>\n";
    document.getElementById("right_col_inner").innerHTML += "<i><br><small>"+_T("version","cap")+": " + CONF_builddate + "</small></i><br><br>";
}

    // Primary instance and legacy alias always refer to the same diagram.
    this.resetAll = function()
    {
        oHierarchicalList = structure = new HierarchicalList();
        buildNewStructure(oHierarchicalList);
        HLRedrawTree();
    };
}

function DiagramSVG()
{
    this.data = "";
    this.xleft = 0;
    this.xright = 0;
    this.xrightmin = 0;
    this.yup = 0;
    this.ydown = 0;
    return this;
}

// Existing inline handlers and integrations retain their original API.
var oOneWireController = new OneWireController();
SVGelement = DiagramSVG; // Legacy SVG constructor alias.
// Compatibility delegates, without duplicating method implementations.
quotesvg = oOneWireController.quoteSVG.bind(oOneWireController);
restart_all = oOneWireController.restartAll.bind(oOneWireController);
importclicked = oOneWireController.importClicked.bind(oOneWireController);
importjson = oOneWireController.importJSON.bind(oOneWireController);
exportjson = oOneWireController.exportJSON.bind(oOneWireController);
popUp = oOneWireController.popUp.bind(oOneWireController);
load_schema = oOneWireController.loadSchema.bind(oOneWireController);
download = oOneWireController.download.bind(oOneWireController);
import_to_structure = oOneWireController.importToStructure.bind(oOneWireController);
HLCollapseExpand = oOneWireController.collapseExpand.bind(oOneWireController);
HLDelete = oOneWireController.deleteItem.bind(oOneWireController);
HLAdd = oOneWireController.addItem.bind(oOneWireController);
HLInsertBefore = oOneWireController.insertBefore.bind(oOneWireController);
HLInsertAfter = oOneWireController.insertAfter.bind(oOneWireController);
HLInsertChild = oOneWireController.insertChild.bind(oOneWireController);
HLUpdate = oOneWireController.updateItem.bind(oOneWireController);
HLRedrawTree = oOneWireController.redrawTree.bind(oOneWireController);
HLRedrawTreeHTML = oOneWireController.redrawTreeHTML.bind(oOneWireController);
HLRedrawTreeSVG = oOneWireController.redrawTreeSVG.bind(oOneWireController);
reset_all = oOneWireController.resetAll.bind(oOneWireController);
