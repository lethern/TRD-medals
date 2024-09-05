let gMaxMedal = 0;
let gMedals = [];
let gMedalsExp = [];
let gContentDiv;
let gInfoPanel;
/*
	name: string
	group: string
	div: HTMLDiv
	label: HTMLSpan
	reqExpanded: boolean
*/
let gBank = {};
/*
	PlayerRank, PlayerXP, Teamkiller
	SuccesfulEvac, SuccesfulEvacXX, TrainingMedalStats
	MOS, MOSvalidator, MOS2, MOC
	PlayerMedals, PlayerMedalsXX, MedalUpgrades
	TrainerTrainer, VetValidator, VetLead
	Special
	'1man', InfernoC

*/  

init();
render();


function bankParser(content){
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(content, 'application/xml'); // text/xml

	const parseError = xmlDoc.getElementsByTagName('parsererror');
	if (parseError.length > 0) {
		alert('Error opening file');
		console.error('Error parsing XML:', parseError[0].textContent);
	} else {
		try{
			const bankData = {};
			const bankElement = xmlDoc.getElementsByTagName('Bank')[0];
			
			const sections = bankElement.getElementsByTagName('Section');
			bankData.sections = {};
			Array.from(sections).forEach(section => {
				let name = section.getAttribute('name');

				let keys = {};
				Array.from(section.getElementsByTagName('Key')).forEach(key => {
					let keyName = key.getAttribute('name');
					let valueElement = key.getElementsByTagName('Value')[0];
					
					let attributeName = valueElement.attributes[0].name;
					let attributeValue = valueElement.getAttribute(attributeName);
					keys[keyName] = isNaN(attributeValue) ? attributeValue : parseInt(attributeValue, 10);
					
//					console.log(keyName +' => '+ keys[keyName]);
				});

				bankData.sections[name] = keys;
			});

			//for(let section in bankData.sections){
			//	console.log(section);
			//	console.log('  ', JSON.stringify(Object.keys(bankData.sections[section])));
			//	//console.log('  ', bankData.sections[section].keys);
			//}
			bankUnpack(bankData);
			render();
			//document.getElementById('fileContent').textContent = JSON.stringify(bankData, null, 2);
		}catch(e){
			alert('Error opening file');
			console.error('Error:', e);
		}
	}
}

function bankUnpack(bank){
	let sections = bank.sections;
	
	gBank.PlayerRank = sections['Stats'].Rank;
	gBank.PlayerXP = sections['Stats'].Experience;
	
	gBank.SuccesfulEvac = sections['Stats'].Evac;
	gBank.SuccesfulEvacXX = [];
	gBank.SuccesfulEvacXX[0] = sections['Stats'].EvacGrunt;
	gBank.SuccesfulEvacXX[1] = sections['Stats'].EvacNM;
	gBank.SuccesfulEvacXX[2] = sections['Stats'].EvacCommander;
	gBank.SuccesfulEvacXX[3] = sections['Stats'].Evacs;
	gBank.SuccesfulEvacXX[4] = sections['Stats'].EvacNMG;

	gBank.TrainingMedalStats = [];
	gBank.TrainingMedalStats[0] = sections['Stats'].Trainer;
	gBank.TrainingMedalStats[1] = sections['Stats'].SuperCommander;
	
	gBank.MOS = [];
	gBank.MOS[1] = sections['MOS'].Demo;
	gBank.MOS[2] = sections['MOS'].Engi;
	gBank.MOS[3] = sections['MOS'].Firebat;
	gBank.MOS[4] = sections['MOS'].Grunt;
	gBank.MOS[5] = sections['MOS'].HS;
	gBank.MOS[6] = sections['MOS'].MM;
	gBank.MOS[7] = sections['MOS'].Medic;
	gBank.MOS[8] = sections['MOS'].Recon;
	gBank.MOS[9] = sections['MOS'].Radio;
	gBank.Teamkiller = sections['Stats'].X;
	
	gBank.PlayerMedals = [];
	for(let i=1; i<=27; ++i)
		gBank.PlayerMedals[i] = sections['Medals'][i];
	
	gBank.TrainerTrainer = sections['Stats'].AdvTrainer;
	gBank.VetValidator = sections['Stats'].Vetval || 0;
	
	gBank.VetLead = sections['Stats'].Vetvar || 0;
	gBank.MOSvalidator = sections['MOS'].MOSval || 0;
	
	gBank.MOS2 = [];
	for(let i=1; i<=9; ++i){
		gBank.MOS2[i] = sections['MOS'][GetMOSXstring(i)] || 0;	
	}
	
	gBank.PlayerMedalsXX = [];
//	gBank.MedalUpgrades = [];
	for(let i=1; i<=6; ++i){
		if(sections['Medals']['t'+i]){
//			gBank.MedalUpgrades[i] = 1;
			gBank.PlayerMedalsXX[i] = 1;
		}
	}
	
	let valm = sections['SignatureX'].valm
	if(valm){
		for(let i=7; i<=21; ++i){
			// MedalValidator += GetMedalValidator(i)
			gBank.PlayerMedalsXX[i] = !isNaN(valm[i-7]) && (valm[i-7] == (i%7));
		}
	}
	
	gBank.Special = [];
	gBank.Special[0] = sections['SignatureX'].vals+'';
	for(let i=1; i<=9; ++i){
		gBank.Special[i] = gBank.Special[0][i-1];
	}
	gBank.Special[10] = sections['SignatureX'].valz+'';
	for(let i=11; i<=15; ++i){
		gBank.Special[i] = gBank.Special[10][i-11];
	}
	
	gBank['1man'] = sections['1man'];
	gBank.InfernoC = sections.Stats.Inferno;
	
	gBank.MOC = [];
	if(sections['MOC']){
		for(let i=1; i<=9; ++i){
			gBank.MOC[i] = sections['MOC'][GetMOCstring(i)] || 0;	
		}
	}	
	//
}
function GetMOSXstring(i){
	return GetMOCstring(i)+'X';
}
function GetMOCstring(i){
	switch(i){
		case 1: return "Demo";
		case 2: return "Engi";
		case 3: return "Firebat";
		case 4: return "Grunt";
		case 5: return "HS";
		case 6: return "MM";
		case 7: return "Medic";
		case 8: return "Recon";
		case 9: return "Radio";
	}
	return '';
}


function onFileInput(event){
	const file = event.target.files[0];
	if(!file) return;

	const reader = new FileReader();
	reader.onload = (e) => bankParser(e.target.result);
	reader.readAsText(file);
}

function init(){
	initBtns();
	initMedals();
	
	gInfoPanel = utilCreateDiv(document.body, '', 'infoPanel');
	gInfoPanel.style.display = 'none';
	gContentDiv = utilCreateDiv(document.body, '', 'medalsPanel');
}

function numberToClass(i){
	switch(i){
		case 1: return 'Demo'
		case 2: return 'Engi'
		case 3: return 'FB'
		case 4: return 'Grunt'
		case 5: return 'HS'
		case 6: return 'Marks'
		case 7: return 'Medic'
		case 8: return 'Recon'
		case 9: return 'Radio'
	}
}

function initBtns(){
	document.getElementById('whereBankBtn').addEventListener('click', ()=> {
		let d = document.getElementById('bankHow').style.display;
		document.getElementById('bankHow').style.display = (d=='none' ? 'block' : 'none')
	});
	document.getElementById('whatIsXp').addEventListener('click', ()=> {
		let d = document.getElementById('serviceXp').style.display;
		document.getElementById('serviceXp').style.display = (d=='none' ? 'block' : 'none')
	});
	document.getElementById('legendBtn').addEventListener('click', ()=> {
		let d = document.getElementById('legend').style.display;
		document.getElementById('legend').style.display = (d=='none' ? 'block' : 'none')
	});
	
	document.getElementById('fileInput').addEventListener('change', onFileInput);
	
	document.getElementById('medalsBtn').addEventListener('click', ()=> {
		let btn = document.getElementById('medalsBtn');
		if(btn.classList.contains('highlightTab')) return;
		btn.classList.add('highlightTab');
		document.getElementById('statsBtn').classList.remove('highlightTab');
		gInfoPanel.style.display = 'none';
		gContentDiv.style.display = 'block';
	});
	document.getElementById('statsBtn').addEventListener('click', ()=> {
		let btn = document.getElementById('statsBtn');
		if(btn.classList.contains('highlightTab')) return;
		btn.classList.add('highlightTab');
		document.getElementById('medalsBtn').classList.remove('highlightTab');
		gInfoPanel.style.display = 'block';
		gContentDiv.style.display = 'none';
	});
}
function initMedals(){
	// gMedalsExp[ServiceXp, BattleXp, TacticalXp]
	// all refer to 3rd index - in form of ServiceXp[2]
	gMedalsExp[2] = [200]
	gMedalsExp[3] = [225]
	gMedalsExp[4] = [250]
	gMedalsExp[5] = [275]
	gMedalsExp[6] = [325,0,175]
	gMedalsExp[7] = [0,300]
	gMedalsExp[8] = [0,350]
	gMedalsExp[9] = [0,400]
	gMedalsExp[10] = [0,450]
	gMedalsExp[11] = [0,500,175]
	gMedalsExp[12] = [225,325]
	gMedalsExp[13] = [250, 375]
	gMedalsExp[14] = [300, 425]
	gMedalsExp[15] = [350, 0, 175]
	gMedalsExp[16] = [0,0,100]
	gMedalsExp[17] = [0,0,110]
	gMedalsExp[18] = [0,0,120]
	gMedalsExp[19] = [0,0,130]
	gMedalsExp[20] = [0,0,140]
	gMedalsExp[21] = [0,0,150]
	gMedalsExp[22] = [0,0,150]
	gMedalsExp[23] = [0,0,150]
	gMedalsExp[24] = [0,0,100]


	
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
		req: [	{ text: "Evac Demo or Engineer or Medic or Recon", func: ()=>{ return gBank.MOS[1] || gBank.MOS[2] || gBank.MOS[7] || gBank.MOS[8]; } }, ], // 
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
		req: [	{ text: "Evac Firebat or Heavy or Marskman", func: ()=>{ return gBank.MOS[3] || gBank.MOS[5] || gBank.MOS[6]} }, ], // 
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
		req: [	{ text: "Evac as Demo or Engi or Medic or Recon", func: ()=>{ return gBank.MOS[1] || gBank.MOS[2] ||gBank.MOS[7] ||gBank.MOS[8] } },  // 
			{ text: "Evac as Firebat or Heavy or Marskman", func: ()=>{ return gBank.MOS[3] || gBank.MOS[5] ||gBank.MOS[6] } }, ], // 
		reward: "+1 damage\n"+"+0.03 speed",
	};
	
	gMedals[15] = {
		name: "Medal of Honor",
		shortname: "MOH",
		req: [	{ text: "Evac as all classes", func: (msgs)=>{
			let missing = [];
			for(let i=1; i<=9; ++i){
				if(!gBank.MOS[i]) missing.push(numberToClass(i));
			}
			if(missing.length){
				msgs.push("Missing class: "+missing.join(', '));
				return false;
			}
			return true;
		} }, ], // MOS
		reward: "+3 damage\n"+"+0.05 speed\n"+"+1 skill point for each class",
	};
	gMedals[16] = {
		name: "Drill Instructor",
		req: [	{ text: "Lead 2 prvts to wave 10, 10 times", func: (msgs)=>{
			if(gBank.TrainingMedalStats[0] < 20)
				msgs.push('Prvts: '+gBank.TrainingMedalStats[0]+' / 20');
			return gBank.TrainingMedalStats[0] >= 20
		} }, ], // TrainingMedalStats[0] >= 20
		reward: "+50 turn speed",
	};
	gMedals[17] = {
		name: "Superior Drill Instructor",
		req: [	{ text: "Lead 5 prvts to evac", func: (msgs)=>{
			if(gBank.TrainingMedalStats[1] < 5)
				msgs.push('Prvts evaced: '+gBank.TrainingMedalStats[1]+' / 5');
			return gBank.TrainingMedalStats[0] >= 5
		} }, ], // TrainingMedalStats[1] >= 5
		reward: "+10 energy\n"+"+10 health",
	};
	gMedals[18] = {
		name: "Platin Star",
		req: [	{ text: "Evac NM", func: ()=>{ return gBank.SuccesfulEvacXX[1] >=1; } }, ], // SuccesfulEvacXX[1] >=1
		reward: "+1 armor",
	};
	gMedals[19] = {
		name: "Critical Cross",
		req: [	{ text: "Lead surv", func: ()=>{ return gBank.SuccesfulEvacXX[2] >=1; } },  // SuccesfulEvacXX[2] >= 1
			{ text: "Lead NM", func: ()=>{return gBank.SuccesfulEvacXX[2] >=2;} },  // SuccesfulEvacXX[2] >= 2
			{ text: "Lead G", func: ()=>{return gBank.SuccesfulEvacXX[2] >=3;} }, ], // SuccesfulEvacXX[2] >= 3 (all: >=4)
		reward: "+1 armor-aura as Leader",
	};
	gMedals[20] = {
		name: "Medal of Austerity",
		req: [	{ text: "Evac G", func: ()=>{return gBank.SuccesfulEvacXX[0] >=1;} }, ], // SuccesfulEvacXX[0] >=1
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
		req: [	{ text: "Has @medal 13@ ", func: (msgs)=>{ return gBank.PlayerMedals[13]} }, // PlayerMedals[13] = true
				{ text: "Evac surv all 2nd evacs", func: ()=>{
					if(gBank.SuccesfulEvacXX[3] < 7){
						switch(gBank.SuccesfulEvacXX[3]){
							case 1: msgs.push('Missing Heli, Boat');
							case 2: msgs.push('Missing Train, Boat');
							case 3: msgs.push('Missing Train, Heli');
							case 4: msgs.push('Missing Boat');
							case 5: msgs.push('Missing Heli');
							case 6: msgs.push('Missing Train');
							default: msgs.push('Missing Train, Boat, Heli');
						}
					}
					return gBank.SuccesfulEvacXX[3] >= 7
				} }, ], // 
		reward: "Grants 10% less energy use for mostly all abilities"
	};
	gMedals[23] = {
		name: "Navy Cross - Bronze V",
		shortname: "V3",
		req: [	{ text: "Has @medal 14@ ", func: ()=>{return gBank.PlayerMedals[14];} }, // PlayerMedals[14] = true
				{ text: "Evac all mission", func: ()=>{} }, ], // 
		reward: "-25% class equip time"
	};
	gMedals[24] = {
		name: "Medal of Honor - Bronze V",
		shortname: "V4",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{return gBank.PlayerMedals[15];} }, // PlayerMedals[15] = true
				{ text: "Evac NM all mission", func: ()=>{} }, ], // 
		reward: "+7.5% attack speed for all weapons"
	};
	gMedals[25] = {
		name: "Critical Cross - Bronze V", // editor: "Platin Star - Bronze V",
		shortname: "V5",
		req: [	{ text: "Has @medal 18@ ", func: ()=>{return gBank.PlayerMedals[18];} }, // PlayerMedals[18]=true 
				{ text: "Evac 4man NM", func: ()=>{} }, ], // 
		reward: "Beretta upgrade gain random attribute:\n"+"- Max of +36 damage\n"+"- Max of +70% critical chance\n"+"- Minimum energy cost of 2\n"+"- Minimum reload duration of 2 seconds\n"+"(Higher level, the higher chance. It may reset to default attribute)"
	};
	gMedals[26] = {
		name: "Oak Leaf Cluster - Defense Distinguished Service Medal",
		shortname: "O2",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{return gBank.PlayerMedals[15];} }, // PlayerMedals[15]=true and PlayerMedals[22]=true and 
				{ text: "Has @medal 22@ ", func: ()=>{return gBank.PlayerMedals[22];} }, 
				{ text: "Lead as all classes", func: (msgs)=>{
					let missing = [];
					for(let i=1; i<=9; ++i){
						if(gBank.MOS2[i] < 4) missing.push(numberToClass(i))
					}
					if(missing.length){
						msgs.push('Missing Lead as: '+missing.join(', '));
						return false;
					}
					return true;
				} }, ], // MOSadvancedCheck(2) == true
		reward: "-75% class kit cooldown",
		order: 47,
	};
	gMedals[27] = {
		name: "Oak Leaf Cluster - Navy Cross",
		shortname: "O3",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{return gBank.PlayerMedals[15];} }, // PlayerMedals[15]=true and PlayerMedals[23]=true and 
				{ text: "Has @medal 23@ ", func: ()=>{return gBank.PlayerMedals[23];} }, 
				{ text: "Get 35 adv. trainer points (help people without Drill instructor to get prvts to w10 and evac, 35 times)", func: (msgs)=>{
					if(gBank.TrainerTrainer < 35)
						msgs.push('Trainer points: '+gBank.TrainerTrainer +' / 35');
					return gBank.TrainerTrainer >= 35
				} }, ], // TrainerTrainer >= 35
		reward: "No more energy usage on interaction and sprinting",
		order: 48,
	};
	gMedals[28] = {
		name: "Oak Leaf Cluster - Medal of Honor",
		shortname: "O4",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{return gBank.PlayerMedals[15];} }, // PlayerMedals[15]=true and PlayerMedals[24]=true and 
				{ text: "Has @medal 24@ ", func: ()=>{return gBank.PlayerMedals[24];} }, 
				{ text: "Evac NM as all classes", func: (msgs)=>{
					let missing = [];
					for(let i=1; i<=9; ++i){
						if(gBank.MOS2[i] < 4) missing.push(numberToClass(i))
					}
					if(missing.length){
						msgs.push('Missing NM evac as: '+missing.join(', '));
						return false;
					}
					return true;
				} }, ], // MOSadvancedCheck(1) == true
		reward: "Random item on start of the game\n"+"Cosmetic unlock (Fruit Hat) command: -@ ",
		order: 49
	};
	gMedals[29] = {
		name: "Oak Leaf Cluster - Critical Cross",
		shortname: "O5",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{return gBank.PlayerMedals[15];} }, // PlayerMedals[15]=true and PlayerMedals[19]=true and 
				{ text: "Has @medal 19@ ", func: ()=>{return gBank.PlayerMedals[19];} }, 
				{ text: "Lead Vet NM", func: (msgs)=>{return gBank.VetLead == 4 || gBank.VetLead == 11; } }, // VetLead == 11,  VetValidator == 49, Game.LeadVetVal == true
				{ text: "Lead Vet GNM", func: ()=>{return gBank.VetLead == 5 || gBank.VetLead == 11; } }, ], 
		reward: "All class gains benefits from Able-Bodied\n"+"- Class Commander Aura: 14 range\n"+"- Demolition: +20% explosion skill damage\n"+"- Engineer: +0.1 energy regeneration\n"+"- Firebat: -15% gain damage\n"+"- Grunt: +10% weapon damage\n"+"- Heavy Support: +10% weapon speed\n"+"- Marksman: +1 weapon range\n"+"- Medic: +1 heath regeneration\n"+"- Reconnaissance: +0.05 movement speed\n"+"- Radio Operator: +2 line of sight",
		order: 50
	};
	gMedals[30] = {
		name: "Oak Leaf Cluster - Platin Star",
		shortname: "O6",
		req: [	{ text: "Has @medal 15@ ", func: ()=>{return gBank.PlayerMedals[15];} }, // PlayerMedals[15]=true 
				{ text: "Evac 4man GNM", func: ()=>{} }, ], // ModusSwitchAdv == 3
		reward: "No longer lose energy regeneration delay on taking damage.",
		order: 51
	};
	gMedals[31] = {
		name: "Oak Leaf Cluster - Silver Star",
		shortname: "O1",
		req: [	{ text: "Has @medal 21@", func: ()=>{return gBank.PlayerMedals[21];} }, // PlayerMedals[21]=true
				{ text: "Evac 2 man surv", func: ()=>{} }, ],
		reward: "-80% secondary weapon cooldown",
		order: 46
	};
	gMedals[32] = {
		name: "Platin Star - Bronze V",// editor: "Critical Cross - Bronze V",
		shortname: "V6",
		req: [	{ text: "Has @medal 18@", func: ()=>{return gBank.PlayerMedals[18];} }, 
				{ text: "Evac 3man NM", func: ()=>{} }, ],
		reward: "-10% cooldown for most skills.",
	};
	gMedals[33] = { //9
		name: "Silver Star - Silver V",
		shortname: "V1s",
		req: [	{ text: "Has @medal 21@", func: ()=>{return gBank.PlayerMedals[21];} },
				{ text: "Lead 3 man surv, 9 times - or - Evac 3 man surv all missions", func: (msgs)=>{
					if(!gBank.PlayerMedals[21]) return false;
					if(gBank.Special[9] != 1 && gBank.Special[2] < 9){
						msgs.push('3man surv lead: '+ gBank.Special[9] +' / 9');
					}
					return gBank.Special[9] == 1 || gBank.Special[2] == 9
				} }, ], // (Special[2]==9 || special[9]==1) 
		reward: "+3 range\n"+"2 more maximum clips\n"+"Shorter cooldown and a transient radius of 210"
	};
	gMedals[34] = {
		name: "Defense Distinguished Service Medal - Silver V",
		shortname: "V2s",
		req: [	{ text: "Has @medal 22@", func: ()=>{return gBank.PlayerMedals[22];} }, // PlayerMedals[22]=true
				{ text: "Lead surv all 2nd evacs - or - Lead NM all 2nd evacs", func: (msgs)=>{
					if(!gBank.PlayerMedals[22]) return false;
					if(gBank.Special[3] < 7 && gBank.Special[4] < 7){
						switch(gBank.Special[3]){
							case 1: msgs.push('Lead surv missing Heli, Boat');
							case 2: msgs.push('Lead surv missing Train, Boat');
							case 3: msgs.push('Lead surv missing Train, Heli');
							case 4: msgs.push('Lead surv missing Boat');
							case 5: msgs.push('Lead surv missing Heli');
							case 6: msgs.push('Lead surv missing Train');
							default:msgs.push('Lead surv missing Train, Boat, Heli');
						}
						switch(gBank.Special[4]){
							case 1: msgs.push('Lead NM missing Heli, Boat');
							case 2: msgs.push('Lead NM missing Train, Boat');
							case 3: msgs.push('Lead NM missing Train, Heli');
							case 4: msgs.push('Lead NM missing Boat');
							case 5: msgs.push('Lead NM missing Heli');
							case 6: msgs.push('Lead NM missing Train');
							default:msgs.push('Lead NM missing Train, Boat, Heli');
						}
					}
					return gBank.Special[3] == 7 || gBank.Special[4] == 7
				} }, ], // (Special[3]==7 || special[4]==7)
		reward: "Grants 20% less energy use for mostly all abilities",
	};
	gMedals[35] = {
		name: "Navy Cross - Silver V",
		shortname: "V3s",
		req: [	{ text: "Has @medal 23@", func: ()=>{return gBank.PlayerMedals[23];} }, // PlayerMedals[23]=true
				{ text: "Lead surv all missions, 9 times - or - Evac Vet all mission", func: (msgs)=>{
					if(!gBank.PlayerMedals[23]) return false;
					if(gBank.Special[5] < 9 && gBank.Special[14]!=1){
						msgs.push('Lead surv all missions: '+gBank.Special[5] +' / 9');
					}
					return gBank.Special[5] == 9 || gBank.Special[14]==1;
				} }, ], // Special[5]==9 || special[14]==1
		reward: "-40% class equip time",
	};
	gMedals[36] = {
		name: "Medal of Honor - Silver V",
		shortname: "V4s",
		req: [	{ text: "Has @medal 24@", func: ()=>{return gBank.PlayerMedals[24];} }, // PlayerMedals[24]=true
				{ text: "Lead NM all missions, 9 times - or - Evac NM Vet all mission", func: (msgs)=>{
					if(!gBank.PlayerMedals[24]) return false;
					if(gBank.Special[6] < 9 && gBank.Special[15]!=1){
						msgs.push('Lead NM all missions: '+gBank.Special[5] +' / 9');
					}
					return gBank.Special[6] == 9 || gBank.Special[15]==1;
				} }, ], // (Special[6]==9 || special[15]==1)
		reward: "+12.5% attack speed for all weapons",
	};
	gMedals[37] = {
		name: "Critical Cross - Silver V",
		shortname: "V5s",
		req: [	{ text: "Has @medal 25@", func: ()=>{return gBank.PlayerMedalsXX[1];} }, // PlayerMedalsXX[1]=true
				{ text: "Lead 4man NM, 6 times - or - Evac 4man NM all mission", func: (msgs)=>{
					if(!gBank.PlayerMedalsXX[1]) return false;
					if(gBank.Special[7] < 6 && gBank.Special[12]!=5){
						msgs.push('Lead 4man NM: '+gBank.Special[7] +' / 6');
					}
					return gBank.Special[7] == 6 || gBank.Special[12] == 5;
				} }, ], // (Special[7]==6 || special[12]==5)
		reward: "Beretta energy cost reduced to 2\n"+"Beretta upgrade gain random attribute:\n"+"- Max of +36 damage\n"+"- Max  of +30% critical chance\n"+"- Minimum reload duration of 2 seconds\n"+"(Higher level, the higher chance It may reset to default attribute)",
	};
	gMedals[38] = {
		name: "Platin Star - Silver V",
		shortname: "V6s",
		req: [	{ text: "Has @medal 32@", func: ()=>{return gBank.PlayerMedalsXX[8];} }, // PlayerMedalsXX[8]=true
				{ text: "Lead 3man NM, 3 times - or - Evac 3man NM all mission", func: (msgs)=>{
					if(!gBank.PlayerMedalsXX[8]) return false;
					if(gBank.Special[8] < 3 && gBank.Special[13]!=5){
						msgs.push('Lead 3man NM: '+gBank.Special[8] +' / 3');
					}
					return gBank.Special[8] == 3 || gBank.Special[13] == 5;
				} }, ], // (Special[8]==3 || special[13]==5)
		reward: "-20% cooldown for most skills",
	};
	gMedals[39] = {
		name: "Silver Star - Gold V",
		shortname: "V1g",
		req: [	{ text: "Has @medal 33@", func: ()=>{return gBank.PlayerMedalsXX[9];} },
				/**33*/
				{ text: "Lead 3 man surv, 9 times", func: (msgs)=>{
					if(gBank.Special[2] < 9){
						msgs.push('3man surv lead: '+ gBank.Special[9] +' / 9');
					}
					return gBank.Special[2] == 9
				} },
				{ text: "Evac 3 man surv all missions", func: (msgs)=>{
					return gBank.Special[9] == 1;
				} },				], // (Special[2]==9 || special[9]==1) 
		reward: "+4 range\n"+"2 more maximum clips\n"+"Shorter cooldown and a transient radius of 240."
	};
	gMedals[40] = {
		name: "Defense Distinguished Service Medal - Gold V",
		shortname: "V2g",
		req: [	{ text: "Has @medal 34@", func: ()=>{return gBank.PlayerMedalsXX[10];} },
				/**34*/
				{ text: "Lead surv all 2nd evacs", func: (msgs)=>{
					if(gBank.Special[3] < 7){
						switch(gBank.Special[3]){
							case 1: msgs.push('Lead surv missing Heli, Boat');
							case 2: msgs.push('Lead surv missing Train, Boat');
							case 3: msgs.push('Lead surv missing Train, Heli');
							case 4: msgs.push('Lead surv missing Boat');
							case 5: msgs.push('Lead surv missing Heli');
							case 6: msgs.push('Lead surv missing Train');
							default:msgs.push('Lead surv missing Train, Boat, Heli');
						}
					}
					return gBank.Special[3] == 7
				} },
				{ text: "Lead NM all 2nd evacs", func: (msgs)=>{
					if(gBank.Special[4] < 7){
						switch(gBank.Special[4]){
							case 1: msgs.push('Lead NM missing Heli, Boat');
							case 2: msgs.push('Lead NM missing Train, Boat');
							case 3: msgs.push('Lead NM missing Train, Heli');
							case 4: msgs.push('Lead NM missing Boat');
							case 5: msgs.push('Lead NM missing Heli');
							case 6: msgs.push('Lead NM missing Train');
							default:msgs.push('Lead NM missing Train, Boat, Heli');
						}
					}
					return gBank.Special[4] == 7
				} },				], // (Special[3]==7 || special[4]==7)
		reward: "Grants 25% less energy use for mostly all abilities.",
	};
	gMedals[41] = {
		name: "Navy Cross - Gold V",
		shortname: "V3g",
		req: [	{ text: "Has @medal 35@", func: ()=>{return gBank.PlayerMedalsXX[11];} }, 
				/**35*/
				{ text: "Lead surv all missions, 9 times", func: (msgs)=>{
					if(gBank.Special[5] < 9){
						msgs.push('Lead surv all missions: '+gBank.Special[5] +' / 9');
					}
					return gBank.Special[5] == 9;
				} },
				{ text: "Evac Vet all mission", func: (msgs)=>{
					return gBank.Special[14]==1;
				} },				], // Special[5]==9 || special[14]==1
		reward: "-50% class equip time.",
	};
	gMedals[42] = {
		name: "Medal of Honor - Gold V",
		shortname: "V4g",
		req: [	{ text: "Has @medal 36@", func: ()=>{return gBank.PlayerMedalsXX[12];} },
				/**36*/
				{ text: "Lead NM all missions, 9 times", func: (msgs)=>{
					if(gBank.Special[6] < 9 ){
						msgs.push('Lead NM all missions: '+gBank.Special[5] +' / 9');
					}
					return gBank.Special[6] == 9 ;
				} },
				{ text: "Evac NM Vet all mission", func: (msgs)=>{
					return gBank.Special[15]==1;
				} },				], // (Special[6]==9 || special[15]==1)
		reward: "+15% attack speed for all weapons",
	};
	gMedals[43] = {
		name: "Critical Cross - Gold V",
		shortname: "V5g",
		req: [	{ text: "Has @medal 37@", func: ()=>{return gBank.PlayerMedalsXX[13];} }, 
				/**37*/
				{ text: "Lead 4man NM, 6 times", func: (msgs)=>{
					if(gBank.Special[7] < 6 ){
						msgs.push('Lead 4man NM: '+gBank.Special[7] +' / 6');
					}
					return gBank.Special[7] == 6 ;
				} }, 
				{ text: "Evac 4man NM all mission", func: (msgs)=>{
					return gBank.Special[12] == 5;
				} },], // (Special[7]==6 || special[12]==5)
		reward: "Beretta energy cost reduced to 2\n"+"Beretta reload duration reduced to 2 seconds\n"+"Beretta upgrades gain random attribute:\n"+"- Max of +36 damage\n"+"- Max of +30% critical chance\n"+"(Higher level, the higher chance It may reset to default attribute)"
	};
	gMedals[44] = {
		name: "Platin Star - Gold V",
		shortname: "V6g",
		req: [	{ text: "Has @medal 38@", func: ()=>{return gBank.PlayerMedalsXX[14];} }, 
				/**38*/
				{ text: "Lead 3man NM, 3 times", func: (msgs)=>{
					if(gBank.Special[8] < 3){
						msgs.push('Lead 3man NM: '+gBank.Special[8] +' / 3');
					}
					return gBank.Special[8] == 3 ;
				} },
				{ text: "Evac 3man NM all mission", func: (msgs)=>{
					return gBank.Special[13] == 5;
				} },				], // (Special[8]==3 || special[13]==5)
		reward: "-25% cooldown for most skills",
	};
	
	gMedals[45] = {
		name: "Able-Bodied Soldier",
		req: [	{ text: "Evac GNM", func: ()=>{return gBank.SuccesfulEvacXX[4];} }, ],
		reward: "+25 health\n"+"+15 energy\n"+"+10% attack speed\n"+"+2.5 seconds duration of Morphine\n"+"+50% attack speed bonus of Morphine\n"+"+5% move speed\n"+"+10% attack damage\n"+"+0.5 splash damage radius ",
		order: 52,
	};
	gMedals[46] = {
		name: "Inferno",
		req: [	{ text: "Evac Inferno", func: ()=>{return gBank.InfernoC;} }, ],
		reward: "+1 line of sight\n"+"+0.09 Energy regen\n"+"-5% ability cooldown",
		order: 53,
	};
	gMedals[47] = {
		name: "1 Man Run",
		req: [	{ text: "Evac 1 man", func: ()=>{return gBank['1man']>=16;} }, ],
		reward: "Custom skin color",
		order: 54,
	};
//	gMedals[45] = {
//		name: "National Defense Service Medal",
//	};
	gMaxMedal=47;
	
	for(let i=2; i<=gMaxMedal; ++i) gMedals[i].index = i;
	
	// groups
	for(let i=2; i<=6; ++i) gMedals[i].group = "Service Medals";
	for(let i=7; i<=11; ++i) gMedals[i].group = "Battle Medals";
	for(let i=12; i<=15; ++i) gMedals[i].group = "Combo Medals";
	for(let i=16; i<=24; ++i) gMedals[i].group = "Special Medals";
	
	for(let i=26; i<=31; ++i) gMedals[i].group = "Oaks";
	for(let i=21; i<=25; ++i) gMedals[i].group = "Valors";
	for(let i=32; i<=44; ++i) gMedals[i].group = "Valors";
	for(let i=33; i<=38; ++i) gMedals[i].group = "Silver Valors";
	for(let i=39; i<=44; ++i) gMedals[i].group = "Gold Valors";
	for(let i=45; i<=47; ++i) gMedals[i].group = "Additional Medals";
	// order
	for(let i=0; i<=gMaxMedal; ++i) if(gMedals[i] && !gMedals[i].order) gMedals[i].order = i;
}

function renderInfoPanel(){
	gInfoPanel.innerHTML = '';
	
	if(!gBank.PlayerRank) {
		gInfoPanel.textContent = 'First, Load Bank'
		return;
	}
	
	utilCreateDiv(gInfoPanel, 'PlayerRank: '+rankToString(gBank.PlayerRank));
	utilCreateDiv(gInfoPanel, 'PlayerXP: '+gBank.PlayerXP);
	let next = rankExp(+gBank.PlayerRank+1);
	let missing = next-gBank.PlayerXP;
	console.log(gBank.PlayerRank, gBank.PlayerRank+1, next)
	if(next >= 1000) next = (next / 1000).toFixed(0)+ 'k';
	
	if(missing >= 1000) missing = (missing / 1000).toFixed(0)+ 'k';
	console.log(next, missing)
	utilCreateDiv(gInfoPanel, 'Next rank exp:  '+ next + ', missing: '+ missing);
	
	utilCreateDiv(gInfoPanel, 'Evacs', 'infoPanelHeader');
	utilCreateDiv(gInfoPanel, 'Surv Evacs: '+gBank.SuccesfulEvac);
	
	
	utilCreateDiv(gInfoPanel, 'NM Evacs: '+gBank.SuccesfulEvacXX[1]);
	utilCreateDiv(gInfoPanel, 'Grunt Evacs: '+gBank.SuccesfulEvacXX[0]);
	utilCreateDiv(gInfoPanel, 'GNM Evacs: '+gBank.SuccesfulEvacXX[4]);
	let lead = gBank.SuccesfulEvacXX[2];
	utilCreateDiv(gInfoPanel, 'Lead Surv Evac: '+ (lead>=1 ? 'Yes' : 'No'));
	utilCreateDiv(gInfoPanel, 'Lead NM Evac: '+ (lead==2 || lead==4 ? 'Yes' : 'No'));
	utilCreateDiv(gInfoPanel, 'Lead Grunt Evac: '+ (lead>=3 ? 'Yes' : 'No'));
	
	utilCreateDiv(gInfoPanel, 'Class evacs', 'infoPanelHeader');
	for(let i=1; i<=9; ++i){
		//
		utilCreateDiv(gInfoPanel, numberToClass(i)+': '+(gBank.MOC[i] || 0));
		utilCreateDiv(gInfoPanel, numberToClass(i)+' best: '+MOSspecialConvert(gBank.MOS2[i]));
	}
	
	utilCreateDiv(gInfoPanel, 'Trainer', 'infoPanelHeader');
	utilCreateDiv(gInfoPanel, 'Privates lead to wave 10: '+gBank.TrainingMedalStats[0]);
	utilCreateDiv(gInfoPanel, '5 Privates lead to evac: '+gBank.TrainingMedalStats[1]);
	utilCreateDiv(gInfoPanel, 'Adv. trainer points: '+ (gBank.TrainerTrainer || 0));
	
	utilCreateDiv(gInfoPanel, 'Other', 'infoPanelHeader');
	utilCreateDiv(gInfoPanel, 'Vet Lead: '+ printVetLead(gBank.VetLead) );
	
	utilCreateDiv(gInfoPanel, '1man: '+ (gBank['1man'] ? gBank['1man'] : 'No'));
	utilCreateDiv(gInfoPanel, 'Inferno: '+ (gBank.InfernoC?'Yes':'No') );
}
function print2ndEvac(e){
	switch(e){
		case 1: return 'Train';
		case 2: return 'Heli';
		case 3: return 'Boat';
		case 4: return 'Train + Heli';
		case 5: return 'Train + Boat';
		case 6: return 'Heli + Boat';
		case 7: return 'All';
		default: return '?';
	}
}
function printVetLead(v){
	switch(v){
		case 4: return 'NM';
		case 5: return 'GNM';
		case 11: return 'NM + GNM';
		default: return '?';
	}
}
function MOSspecialConvert(i){
	switch(i){
		case 1: return 'None';
		case 2: return 'None';
		case 3: return 'Evac NM';
		case 4: return 'Lead Surv';
		case 5: return 'Lead NM';
		case 6: return 'Lead Surv, Evac NM';
		case 7: return 'Lead NM, Evac NM';
		case 8: return 'Lead NM, Lead Surv';
		case 9: return 'Lead NM, Lead Surv, Evac NM';
		default: return 'None';
	}
}
function rankToString(i){
	let Ranks = ['Pvt', 'PFC', 'LCpl', 'Cpl', 'Sgt', 'Ssgt', 'GySgt', 'MSgt', 'SgtMaj',
'2ndLt', '1stLt', 'Capt', 'Maj', 'LtCol', 'Col', 'BGen', 'MajGen', 'LtGen', 'Gen', 'IvanX'];
	return Ranks[i];
}
function rankExp(i){
	let exp = [0, 200, 800, 1600, 2400, 4000, 7000, 12000, 19000, 28000, 
		40000, 70000, 120000, 190000, 280000, 400000, 600000, 800000, 1000000, 10000000];
	return exp[i];
}

function render(){
	renderInfoPanel();
	gContentDiv.innerHTML = '';
	
	let div = gContentDiv;
	let groups = [];
	let sorted = [...gMedals].sort( (a, b) => a.order - b.order);
	
	for(let _i=0; _i<= gMaxMedal; ++_i){
		let medal = sorted[_i];
		if(!medal || !medal.name) continue;
		let i = medal.index;
		
		if(!groups[medal.group]) createGroup(div, medal.group, groups);
		let groupDiv = groups[medal.group].div;
		let medalDiv = utilCreateDiv(groupDiv, '', 'medalDiv');
//		let medalBtn = utilCreateBtn(medalDiv, ()=> btnMedalExpand(i), 'medalBtn' );
		let medalLabel = utilCreateSpan(medalDiv, (medal.shortname? medal.shortname + ': ' : '') +medal.name);
		medal.div = medalDiv;
		medal.label = medalLabel;
		
		let contentWrap = utilCreateDiv(medalDiv, '', 'medalContent');
		content = utilCreateDiv(contentWrap, '', 'medalContentInline');
		
		let medalReq = utilCreateDiv(content, '', 'medalReq');
		let medalProgress = utilCreateDiv(content, '', 'medalProgress');
		
		
//		if(gMedalsExp[i] !== undefined){
//			let reqDiv = utilCreateDiv(medalReq, '', 'medalReqBullet');
//		}

		if(gMedalsExp[i] && (gMedalsExp[i][0] || gMedalsExp[i][1] || gMedalsExp[i][2])){
			let ServiceXp2 = gMedalsExp[i][0];
			let BattleXp2 = gMedalsExp[i][1];
			let TacticalXp2 = gMedalsExp[i][2];
			let ServiceXp = Math.ceil(ServiceXp2*8.75)
			let TacticalXp = TacticalXp2*10;
			let BattleXp = BattleXp2*5;
			if(ServiceXp) utilCreateDiv(medalReq, 'Required ServiceXp: '+ServiceXp, 'medalReqBullet');
			if(TacticalXp) utilCreateDiv(medalReq, 'Required TacticalXp: '+TacticalXp, 'medalReqBullet');
			if(BattleXp) utilCreateDiv(medalReq, 'Required BattleXp: '+BattleXp, 'medalReqBullet');
		}
		
		if(medal.req){
			let unlocked = false;
			if(gBank.PlayerRank){
				unlocked = isMedalUnlocked(i);
			}
			if(unlocked){
				medalReq.classList.add('reqUnlocked');
			}
					
			for(let req of medal.req){
				let reqDiv;
				if(req.text){
					reqDiv = utilCreateDiv(medalReq, '', 'medalReqBullet');
					reqTextBuilder(reqDiv, req.text);
				}
				
				
				if(req.func && gBank.PlayerRank){
					let unlocked = isMedalUnlocked(i);
					let msgs = [];
					let pass = req.func(msgs);
					if(pass && reqDiv) reqDiv.classList.add('reqPass');
					if(msgs.length){
						msgs.forEach(m=>{
							utilCreateDiv(medalProgress, m, 'medalReqBullet');
						});
					}
				}
			}
			medal.medalReqDiv = medalReq;
		}
		
		let medalReward = utilCreateDiv(content, '', 'medalReward');
		if(medal.reward){
			let rewardSplit = medal.reward.split('\n');
			rewardSplit.forEach(r => utilCreateDiv(medalReward, r, 'medalRewardBullet'));
		}
		
		if(gBank.PlayerRank){
			renderMedalState(i, medal);
		}
	}
}

function isMedalUnlocked(i){
	if(i <= 24){
		return gBank.PlayerMedals[i];
	}
	if(i > 24){
		return gBank.PlayerMedalsXX[i-24];
	}
}
function renderMedalState(i, medal){
	let unlocked = isMedalUnlocked(i);
	let icon;
	if(unlocked){
		icon = utilCreateIcon(null, 'img/32px-tick.png', 'medalIconState');
	}else{
		icon = utilCreateIcon(null, 'img/32px-no.png', 'medalIconState');
	}
	medal.div.insertBefore(icon, medal.label);
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

function checkReqs(reqNr, errors){
	let xp_check = checkReqXp(reqNr, errors);
	
}
function checkReqs(reqNr, userWarnings){
	let ok = true;
	if(reqNr <= 24){
		if(gMedalsExp[reqNr][0] && gMedalsExp[reqNr][0] > ServiceXp[2]){
			ok = false;
			userWarnings.push("ServiceXp: "+ServiceXp[2]+" / "+gMedalsExp[reqNr][0]);
		}
		if(gMedalsExp[reqNr][1] && gMedalsExp[reqNr][1] > BattleXp[2]){
			ok = false;
			userWarnings.push("BattleXp: "+BattleXp[2]+" / "+gMedalsExp[reqNr][1]);
		}
		if(gMedalsExp[reqNr][2] && gMedalsExp[reqNr][2] > TacticalXp[2]){
			ok = false;
			userWarnings.push("TacticalXp: "+TacticalXp[2]+" / "+gMedalsExp[reqNr][2]);
		}
	}
	return ok;
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
function utilCreateIcon(parent, src, css){
	let element = document.createElement('img');
	if(parent) parent.appendChild(element);
	element.src = src;
	if(css) element.classList.add(css);
	return element;
}
