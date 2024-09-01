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
	};
	gMedals[3] = {
		name: "Commendation Medal",
	};
	gMedals[4] = {
		name: "Defense Meritorious Service Medal",
	};
	gMedals[5] = {
		name: "Meritorious Service Medal",
	};
	gMedals[6] = {
		name: "Good Conduct Medal",
	};
	gMedals[7] = {
		name: "Purple Heart",
	};
	gMedals[8] = {
		name: "Bronze Star",
	};
	gMedals[9] = {
		name: "Marine Corps Medal",
	};
	gMedals[10] = {
		name: "Legion of Merit",
	};
	gMedals[11] = {
		name: "Defense Superior Service Medal",
	};
	gMedals[12] = {
		name: "Silver Star",
	};
	gMedals[13] = {
		name: "Defense Distinguished Service Medal",
	};
	gMedals[14] = {
		name: "Navy Cross",
	};
	gMedals[15] = {
		name: "Medal of Honor",
		shortname: "MOH",
	};
	gMedals[16] = {
		name: "Drill Instructor",
	};
	gMedals[17] = {
		name: "Superior Drill Instructor",
	};
	gMedals[18] = {
		name: "Platin Star",
	};
	gMedals[19] = {
		name: "Critical Cross",
	};
	gMedals[20] = {
		name: "Medal of Austerity",
	};
	gMedals[21] = {
		name: "Silver Star - Bronze V",
		shortname: "V1",
	};
	gMedals[22] = {
		name: "Defense Distinguished Service Medal - Bronze V",
		shortname: "V2",
	};
	gMedals[23] = {
		name: "Navy Cross - Bronze V",
		shortname: "V3",
	};
	gMedals[24] = {
		name: "Medal of Honor - Bronze V",
		shortname: "V4",
	};
	gMedals[25] = {
		name: "Platin Star - Bronze V",
		shortname: "V5/O1",
	};
	gMedals[26] = {
		name: "Oak Leaf Cluster - Defense Distinguished Service Medal",
		shortname: "O2",
	};
	gMedals[27] = {
		name: "Oak Leaf Cluster - Navy Cross",
		shortname: "O3",
	};
	gMedals[28] = {
		name: "Oak Leaf Cluster - Medal of Honor",
		shortname: "O4",
	};
	gMedals[29] = {
		name: "Oak Leaf Cluster - Critical Cross",
		shortname: "O5",
	};
	gMedals[30] = {
		name: "Oak Leaf Cluster - Platin Star",
		shortname: "O6",
	};
	gMedals[31] = {
		name: "Oak Leaf Cluster - Silver Star",
	};
	gMedals[32] = {
		name: "Critical Cross - Bronze V",
		shortname: "V6",
	};
	gMedals[33] = { //9
		name: "Silver Star - Silver V",
		shortname: "V1s",
		req: [	{ text: "Has @medal 21@", func: ()=>{} }, // PlayerMedals[21]=true
				{ text: "Escaped as Lead 9 times - or - Escaped 3man Grunt mode", func: ()=>{} }, ], // (Special[2]==9 || special[9]==1) 
	};
	gMedals[34] = {
		name: "Defense Distinguished Service Medal - Silver V",
		shortname: "V2s",
		req: [	{ text: "Has @medal 22@", func: ()=>{} }, // PlayerMedals[22]=true
				{ text: "Escaped survival - or - Escaped 3man Grunt mode", func: ()=>{} }, ], // (Special[3]==7 || special[4]==7)
	};
	gMedals[35] = {
		name: "Navy Cross - Silver V",
		shortname: "V3s",
	};
	gMedals[36] = {
		name: "Medal of Honor - Silver V",
		shortname: "V4s",
	};
	gMedals[37] = {
		name: "Critical Cross - Silver V",
		shortname: "V5s",
	};
	gMedals[38] = {
		name: "Platin Star - Silver V",
		shortname: "V6s",
	};
	gMedals[39] = {
		name: "Silver Star - Gold V",
		shortname: "V1g",
	};
	gMedals[40] = {
		name: "Defense Distinguished Service Medal - Gold V",
		shortname: "V2g",
	};
	gMedals[41] = {
		name: "Navy Cross - Gold V",
		shortname: "V3g",
	};
	gMedals[42] = {
		name: "Medal of Honor - Gold V",
		shortname: "V4g",
	};
	gMedals[43] = {
		name: "Critical Cross - Gold V",
		shortname: "V5g",
	};
	gMedals[44] = {
		name: "Platin Star - Gold V",
		shortname: "V6g",
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
}

function render(){
	let div = document.createElement('div');
	document.body.appendChild(div);
	
	let groups = [];
	
	for(let i=0; i<= gMaxMedal; ++i){
		let medal = gMedals[i];
		if(!medal || !medal.name) continue;
		
		if(!groups[medal.group]) createGroup(div, medal.group, groups);
		let groupDiv = groups[medal.group].div;
		let medalDiv = utilCreateDiv(groupDiv);
		let medalBtn = utilCreateBtn(medalDiv, ()=> btnMedalExpand(i), 'medalBtn' );
		let medalLabel = utilCreateSpan(medalDiv, (medal.shortname? medal.shortname + ': ' : '') +medal.name);
		medal.div = medalDiv;
		medal.label = medalLabel;
		if(medal.req){
			let medalReq = utilCreateDiv(medalDiv, '', 'medalReq');
			for(let req of medal.req){
				utilCreateDiv(medalReq, req.text, 'medalReqBullet');
			}
			medal.medalReqDiv = medalReq;
		}
	}
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
