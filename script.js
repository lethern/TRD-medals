let gMaxMedal = 0;
let gMedals = [];

/*
	name: string
	group: string
	div: HTMLDiv
	label: HTMLSpan
	reqExpanded: boolean
*/


init();
render();


function init(){
	gMedals[2] = {
		name: "Achievement Medal",
		//req: [	{ text: "", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.04 energy regeneration",
	};
	gMedals[3] = {
		name: "Commendation Medal",
		//req: [	{ text: "", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.04 energy regeneration",
	};
	gMedals[4] = {
		name: "Defense Meritorious Service Medal",
		//req: [	{ text: "", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.04 energy regeneration",
	};
	gMedals[5] = {
		name: "Meritorious Service Medal",
		//req: [	{ text: "", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.04 energy regeneration",
	};
	gMedals[6] = {
		name: "Good Conduct Medal",
		req: [	{ text: "Evac Demo or Engineer or Medic or Recon", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.06 energy regeneration\n"+"+5 energy\n"+"+0.03 speed",
	};
	gMedals[7] = {
		name: "Purple Heart",
		//req: [	{ text: "", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.06 health regeneration",
	};
	gMedals[8] = {
		name: "Bronze Star",
		//req: [	{ text: "", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.06 health regeneration",
	};
	gMedals[9] = {
		name: "Marine Corps Medal",
		//req: [	{ text: "", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.06 health regeneration",
	};
	gMedals[10] = {
		name: "Legion of Merit",
		//req: [	{ text: "", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.06 health regeneration",
	};
	gMedals[11] = {
		name: "Defense Superior Service Medal",
		req: [	{ text: "Evac Firebat or Heavy or Marskman", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+5 health\n"+"+0.03 speed",
	};
	gMedals[12] = {
		name: "Silver Star",
		//req: [	{ text: "", func: ()=>{} }, ], // 
		reward: "+1 damage\n+0.03 speed",
	};
	gMedals[13] = {
		name: "Defense Distinguished Service Medal",
		//req: [	{ text: "", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.03 speed",
	};
	gMedals[14] = {
		name: "Navy Cross",
		req: [	{ text: "Evac as Demo or Engi or Medic or Recon", func: ()=>{} },  // 
			{ text: "Evac as Firebat or Heavy or Marskman", func: ()=>{} }, ], // 
		reward: "+1 damage\n"+"+0.03 speed",
	};
	gMedals[15] = {
		name: "Medal of Honor",
		shortname: "MOH",
		req: [	{ text: "Evac as all classes", func: ()=>{} }, ], // MOS
		reward: "+3 damage\n"+"+0.05 speed\n"+"+1 skill point for each class",
	};
	gMedals[16] = {
		name: "Drill Instructor",
		req: [	{ text: "Lead 2 prvts to wave 10, 10 times", func: ()=>{} }, ], // TrainingMedalStats[0] >= 20
		reward: "+50 turn speed",
	};
	gMedals[17] = {
		name: "Superior Drill Instructor",
		req: [	{ text: "Lead 5 prvts to evac", func: ()=>{} }, ], // TrainingMedalStats[1] >= 5
		reward: "+10 energy\n"+"+10 health",
	};
	gMedals[18] = {
		name: "Platin Star",
		req: [	{ text: "Evac NM", func: ()=>{} }, ], // SuccesfulEvacXX[1] >=1
		reward: "+1 armor",
	};
	gMedals[19] = {
		name: "Critical Cross",
		req: [	{ text: "Lead surv", func: ()=>{} },  // SuccesfulEvacXX[2] >= 1
			{ text: "Lead NM", func: ()=>{} },  // SuccesfulEvacXX[2] >= 2
			{ text: "Lead GNM", func: ()=>{} }, ], // SuccesfulEvacXX[2] >= 3 (all: >=4)
		reward: "+1 armor-aura as Leader",
	};
	gMedals[20] = {
		name: "Medal of Austerity",
		req: [	{ text: "Evac G", func: ()=>{} }, ], // SuccesfulEvacXX[0] >=1
		reward: "+1 range for ranged abilities",
	};
	gMedals[21] = {
		name: "Silver Star - Bronze V",
		shortname: "V1",
		req: [	{ text: "Evac 3man", func: ()=>{} }, ], // 
		reward: "Adds 2 range, 2 more maximum clips, a shorter cooldown and a transient radius of 180"
	};
	gMedals[22] = {
		name: "Defense Distinguished Service Medal - Bronze V",
		shortname: "V2",
		req: [	{ text: "Has @medal 13@ ", func: ()=>{} }, // PlayerMedals[13] = true
				{ text: "Evac surv all 2nd evacs", func: ()=>{} }, ], // 
		reward: "Grants 10% less energy use for mostly all abilities"
	};
	gMedals[23] = {
		name: "Navy Cross - Bronze V",
		shortname: "V3",
		req: [	{ text: "Has @medal 14@ ", func: ()=>{} }, // PlayerMedals[14] = true
				{ text: "Evac all mission", func: ()=>{} }, ], // 
		reward: "-25% class equip time"
	};
	gMedals[24] = {
		name: "Medal of Honor - Bronze V",
		shortname: "V4",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{} }, // PlayerMedals[15] = true
				{ text: "Evac NM all mission", func: ()=>{} }, ], // 
		reward: "+7.5% attack speed for all weapons"
	};
	gMedals[25] = {
		name: "Critical Cross - Bronze V", // editor: "Platin Star - Bronze V",
		shortname: "V5",
		req: [	{ text: "Has @medal 18@ ", func: ()=>{} }, // PlayerMedals[18]=true 
				{ text: "Evac 4man NM", func: ()=>{} }, ], // 
		reward: "Beretta upgrade gain random attribute:\n"+"- Max of +36 damage\n"+"- Max of +70% critical chance\n"+"- Minimum energy cost of 2\n"+"- Minimum reload duration of 2 seconds\n"+"(Higher level, the higher chance. It may reset to default attribute)"
	};
	gMedals[26] = {
		name: "Oak Leaf Cluster - Defense Distinguished Service Medal",
		shortname: "O2",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{} }, // PlayerMedals[15]=true and PlayerMedals[22]=true and 
				{ text: "Has @medal 22@ ", func: ()=>{} }, 
				{ text: "Lead as all classes", func: ()=>{} }, ], // MOSadvancedCheck(2) == true
		reward: "-75% class kit cooldown"
	};
	gMedals[27] = {
		name: "Oak Leaf Cluster - Navy Cross",
		shortname: "O3",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{} }, // PlayerMedals[15]=true and PlayerMedals[23]=true and 
				{ text: "Has @medal 23@ ", func: ()=>{} }, 
				{ text: "Get 35 adv. trainer points (help people without Drill instructor to get prvts to w10 and evac, 35 times)", func: ()=>{} }, ], // TrainerTrainer >= 35
		reward: "No more energy usage on interaction and sprinting"
	};
	gMedals[28] = {
		name: "Oak Leaf Cluster - Medal of Honor",
		shortname: "O4",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{} }, // PlayerMedals[15]=true and PlayerMedals[24]=true and 
				{ text: "Has @medal 24@ ", func: ()=>{} }, 
				{ text: "Lead NM as all classes", func: ()=>{} }, ], // MOSadvancedCheck(1) == true
		reward: "Random item on start of the game\n"+"Cosmetic unlock (Fruit Hat) command: -@ "
	};
	gMedals[29] = {
		name: "Oak Leaf Cluster - Critical Cross",
		shortname: "O5",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{} }, // PlayerMedals[15]=true and PlayerMedals[19]=true and 
				{ text: "Has @medal 19@ ", func: ()=>{} }, 
				{ text: "Lead Vet NM", func: ()=>{} }, // VetLead == 11,  VetValidator == 49, Game.LeadVetVal == true
				{ text: "Lead Vet GNM", func: ()=>{} }, ], 
		reward: "All class gains benefits from Able-Bodied\n"+"- Class Commander Aura: 14 range\n"+"- Demolition: +20% explosion skill damage\n"+"- Engineer: +0.1 energy regeneration\n"+"- Firebat: -15% gain damage\n"+"- Grunt: +10% weapon damage\n"+"- Heavy Support: +10% weapon speed\n"+"- Marksman: +1 weapon range\n"+"- Medic: +1 heath regeneration\n"+"- Reconnaissance: +0.05 movement speed\n"+"- Radio Operator: +2 line of sight"
	};
	gMedals[30] = {
		name: "Oak Leaf Cluster - Platin Star",
		shortname: "O6",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{} }, // PlayerMedals[15]=true 
				{ text: "Evac 4man GNM", func: ()=>{} }, ], // ModusSwitchAdv == 3
		reward: "No longer lose energy regeneration delay on taking damage.",
	};
	gMedals[31] = {
		name: "Oak Leaf Cluster - Silver Star",
		shortname: "O1",
		req: [	{ text: "Has @medal 21@", func: ()=>{} }, // PlayerMedals[21]=true
				{ text: "Evac 2 man surv", func: ()=>{} }, ],
		reward: "-80% secondary weapon cooldown",
		order: 25.5,
	};
	gMedals[32] = {
		name: "Platin Star - Bronze V",// editor: "Critical Cross - Bronze V",
		shortname: "V6",
		req: [	{ text: "Has @medal 18@", func: ()=>{} }, 
				{ text: "Evac 3man NM", func: ()=>{} }, ],
		reward: "-10% cooldown for most skills.",
	};
	gMedals[33] = { //9
		name: "Silver Star - Silver V",
		shortname: "V1s",
		req: [	{ text: "Has @medal 21@", func: ()=>{} },
				{ text: "Lead 3 man surv, 9 times - or - Evac 3 man surv all missions", func: ()=>{} }, ], // (Special[2]==9 || special[9]==1) 
		reward: "+3 range\n"+"2 more maximum clips\n"+"Shorter cooldown and a transient radius of 210"
	};
	gMedals[34] = {
		name: "Defense Distinguished Service Medal - Silver V",
		shortname: "V2s",
		req: [	{ text: "Has @medal 22@", func: ()=>{} }, // PlayerMedals[22]=true
				{ text: "Lead surv all 2nd evacs - or - Lead NM all 2nd evacs", func: ()=>{} }, ], // (Special[3]==7 || special[4]==7)
		reward: "Grants 20% less energy use for mostly all abilities",
	};
	gMedals[35] = {
		name: "Navy Cross - Silver V",
		shortname: "V3s",
		req: [	{ text: "Has @medal 23@", func: ()=>{} }, // PlayerMedals[23]=true
				{ text: "Lead surv all 2nd evacs, 9 times - or - Evac Vet all mission", func: ()=>{} }, ], // Special[5]==9 || special[14]==1
		reward: "-40% class equip time",
	};
	gMedals[36] = {
		name: "Medal of Honor - Silver V",
		shortname: "V4s",
		req: [	{ text: "Has @medal 24@", func: ()=>{} }, // PlayerMedals[24]=true
				{ text: "Lead NM all 2nd evacs, 9 times - or - Evac NM Vet all mission", func: ()=>{} }, ], // (Special[6]==9 || special[15]==1)
		reward: "+12.5% attack speed for all weapons",
	};
	gMedals[37] = {
		name: "Critical Cross - Silver V",
		shortname: "V5s",
		req: [	{ text: "Has @medal 25@", func: ()=>{} }, // PlayerMedalsXX[1]=true
				{ text: "Lead 4man NM, 6 times - or - Evac 4man NM all mission", func: ()=>{} }, ], // (Special[7]==6 || special[12]==5)
		reward: "- Beretta energy cost reduced to 2\n"+"Beretta upgrade gain random attribute:\n"+"- Max of +36 damage\n"+"- Max  of +30% critical chance\n"+"- Minimum reload duration of 2 seconds\n"+"(Higher level, the higher chance It may reset to default attribute)",
	};
	gMedals[38] = {
		name: "Platin Star - Silver V",
		shortname: "V6s",
		req: [	{ text: "Has @medal 32@", func: ()=>{} }, // PlayerMedalsXX[8]=true
				{ text: "Lead 3man NM, 3 times - or - Evac 3man NM all mission", func: ()=>{} }, ], // (Special[8]==3 || special[13]==5)
		reward: "-20% cooldown for most skills",
	};
	gMedals[39] = {
		name: "Silver Star - Gold V",
		shortname: "V1g",
		req: [	{ text: "Has @medal 33@", func: ()=>{} },
				{ text: "Lead 3 man surv, 9 times - or - Evac 3 man surv all missions", func: ()=>{ /**33*/ } }, ],
		reward: "+4 range\n"+"2 more maximum clips\n"+"Shorter cooldown and a transient radius of 240."
	};
	gMedals[40] = {
		name: "Defense Distinguished Service Medal - Gold V",
		shortname: "V2g",
		req: [	{ text: "Has @medal 34@", func: ()=>{} },
				{ text: "Lead surv all 2nd evacs - or - Lead NM all 2nd evacs", func: ()=>{/**34*/ } }, ],
		reward: "Grants 25% less energy use for mostly all abilities.",
	};
	gMedals[41] = {
		name: "Navy Cross - Gold V",
		shortname: "V3g",
		req: [	{ text: "Has @medal 35@", func: ()=>{} }, 
				{ text: "Lead surv all 2nd evacs, 9 times - or - Evac Vet all mission", func: ()=>{/**35*/} }, ], 
		reward: "-50% class equip time.",
	};
	gMedals[42] = {
		name: "Medal of Honor - Gold V",
		shortname: "V4g",
		req: [	{ text: "Has @medal 36@", func: ()=>{} },
				{ text: "Lead NM all 2nd evacs, 9 times - or - Evac NM Vet all mission", func: ()=>{} }, ],
		reward: "+15% attack speed for all weapons",
	};
	gMedals[43] = {
		name: "Critical Cross - Gold V",
		shortname: "V5g",
		req: [	{ text: "Has @medal 37@", func: ()=>{} }, 
				{ text: "Lead 4man NM, 6 times - or - Evac 4man NM all mission", func: ()=>{} }, ], 
		reward: "- Beretta energy cost reduced to 2\n"+"- Beretta reload duration reduced to 2 seconds\n"+"Beretta upgrades gain random attribute:\n"+"- Max of +36 damage\n"+"- Max of +30% critical chance\n"+"(Higher level, the higher chance It may reset to default attribute)"
	};
	gMedals[44] = {
		name: "Platin Star - Gold V",
		shortname: "V6g",
		req: [	{ text: "Has @medal 38@", func: ()=>{} }, 
				{ text: "Lead 3man NM, 3 times - or - Evac 3man NM all mission", func: ()=>{} }, ],
		reward: "-25% cooldown for most skills",
	};
	gMedals[45] = {
		name: "National Defense Service Medal",
	};
	gMaxMedal=45;
	
	// groups
	for(let i=2; i<=24; ++i) gMedals[i].group = "Medals";
	for(let i=26; i<=31; ++i) gMedals[i].group = "Oaks";
	for(let i=21; i<=25; ++i) gMedals[i].group = "Valors";
	for(let i=32; i<=45; ++i) gMedals[i].group = "Valors";
	// order
	for(let i=0; i<=gMaxMedal; ++i) if(gMedals[i] && !gMedals[i].order) gMedals[i].order = i;
}

function render(){
	let div = document.createElement('div');
	document.body.appendChild(div);
	
	let groups = [];
	let sorted = gMedals.sort( (a, b) => a.order - b.order);
	
	for(let i=0; i<= gMaxMedal; ++i){
		let medal = sorted[i];
		if(!medal || !medal.name) continue;
		
		if(!groups[medal.group]) createGroup(div, medal.group, groups);
		let groupDiv = groups[medal.group].div;
		let medalDiv = utilCreateDiv(groupDiv, '', 'medalDiv');
//		let medalBtn = utilCreateBtn(medalDiv, ()=> btnMedalExpand(i), 'medalBtn' );
		let medalLabel = utilCreateSpan(medalDiv, (medal.shortname? medal.shortname + ': ' : '') +medal.name);
		medal.div = medalDiv;
		medal.label = medalLabel;
		if(medal.req){
			let medalReq = utilCreateDiv(medalDiv, '', 'medalReq');
			for(let req of medal.req){
				let reqDiv = utilCreateDiv(medalReq, '', 'medalReqBullet');
				reqTextBuilder(reqDiv, req.text)
			}
			medal.medalReqDiv = medalReq;
		}
		if(medal.reward){
			let reqDiv = utilCreateDiv(medalDiv, medal.reward, 'medalRewardBullet');
		}
	}
}

function reqTextBuilder(div, text){
	let index = -1;

	text = "<span>"+text;
	while(true){
		let res = findOneOfArray(text, ['@medal', '- or -'], index);
		index = res.index;
		let found = res.found;
		if(index == -1) break;
		
		if(found == '@medal') {
			let index2 = text.indexOf('@', index+1);
			let value = text.substring(index + "@medal ".length, index2)
			
			//utilCreateSpan(div, text.substring(0, index));
			//utilCreateSpan(div, gMedals[value]?.shortname + (gMedals[value]?.shortname? ': ' : '') + gMedals[value]?.name || "Unknown medal", 'medalReqHighlight');
			//utilCreateSpan(div, text.substring(index2+1));
			let name =  (gMedals[value]?.shortname? gMedals[value]?.shortname +': ' : '') + gMedals[value]?.name || "Unknown medal"
			let nameText = "</span><span class='medalReqHighlight'>"
				+ name+"</span><span>"
			text = text.substring(0, index) 
				+ nameText
				+ text.substring(index2+1);
			index = index+nameText.length-1;
		}
		if(found == '- or -') {
			let newOr = "</span><span class='reqOr'>- or -</span><span>";
			text = text.substring(0, index) 
				+ newOr
				+ text.substring(index+'- or -'.length);
			index = index+newOr.length-1;
		}
		
	}
	text = text+"</span>";
	div.innerHTML = text;
    return text;
}

function findOneOfArray(str, args, startIndex) {
	let index = str.length;
	let found = '';
	for(let a of args){
		let i = str.indexOf(a, startIndex);
		if(i==-1) continue
		if(i < index){
			index = i;
			found = a;
		}
	}
	return index == str.length ? { index: -1 } : { index, found};
}

function btnMedalExpand(medal_i){
	let medal = gMedals[medal_i];
	medal.reqExpanded = !medal.reqExpanded;
	if(medal.reqExpanded){
		medal.medalReqDiv.style.display = 'block';
	}else{
		medal.medalReqDiv.style.display = 'none';
	}
}



function createGroup(parent, groupName, groups){
	let wrapper = utilCreateDiv(parent);
	utilCreateDiv(wrapper, groupName, 'groupHeader');
	let content = utilCreateDiv(wrapper);
	groups[groupName] = { div: content };
}
function utilCreateDiv(parent, text, css){
	let element = document.createElement('div');
	parent.appendChild(element);
	element.textContent = text;
	if(css) element.classList.add(css);
	return element;
}
function utilCreateSpan(parent, text, css){
	let element = document.createElement('span');
	parent.appendChild(element);
	element.textContent = text;
	if(css) element.classList.add(css);
	return element;
}
function utilCreateBtn(parent, callback, css){
	let element = document.createElement('div');
	parent.appendChild(element);
	element.textContent = '(+)';
	if(css) element.classList.add(css);
	element.addEventListener('click', callback, false);
	return element;
}
