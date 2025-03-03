var propArr = [], divArr = [], primeArr = [], relationArr = [], fromBase = [], toBase = [];
var seqItems = ["Prime", "Composite", "Fibonacci", "Triangular", "Square", "Cube", "Tetrahedral", "Square_Pyramidal", "Star", "Pentagonal"];
var seqArr = [];
const hostFolder = '';
const convArr = [8, 12, 16, 2], nameArr = ["Octal", "Duodecimal", "Hexadecimal", "Binary"]
const urlVars = window.location.search
const urlParams = new URLSearchParams(urlVars)
let thisNum = Number(urlParams.get('number'))
if (thisNum == 0) {thisNum = 55}
const thisNumStr = thisNum + NumberSuffix(thisNum)

function Get_NumberProperties() {
	var resArr, retArr1, retArr2
	//Queries the SQL database for Verse data
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "tools/number-properties/php/getproperties.php?number=" + thisNum);
	xhttp.send();
	xhttp.onreadystatechange = function() {

		//Split the returned string into an an array and use it to set the page's default arrays
		if (this.readyState == 4 && this.status == 200) {
			resArr = xhttp.responseText.split("&&&");
			retArr1 = resArr[0].split("%%")
			retArr2 = resArr[1].split("%%")

			propArr = retArr1.slice(0, seqItems.length)
			divArr = retArr1.slice(seqItems.length, seqItems.length + 4)
			primeArr = retArr1[retArr1.length - 1].split("|")

			relationArr = retArr2
			Build_SeqArr()
		}
	}
}

function Build_SeqArr() {
	//1 is Composites, so don't include those
	for (let x = 0; x < seqItems.length; x++) {
		if (x !== 1 && propArr[x] > 0) {
			seqArr.push([seqItems[x].replaceAll("_", " "), propArr[x]])
		}
	}

	Build_NumberData()
}

function Build_NumberData() {
	let iText = ''
	let hSpot = document.getElementById("HTMLSpot")
	StandardizeSeqItems()

	iText += BuildTopTable()

	//If the number is part of any sequence lists, display them
	if (seqArr.length > 0) {
		iText += BuildSeqTable()
	}

	iText += '<div id="belowSpecials">'

	//Build a table with Divisor details
	if (primeArr[0] !== "Prime") {iText += BuildDivisorTable()} // + '<div id="DivisorDiv">'
	//Build a table with Relational details
	iText += BuildRelationTable() // + '<div>'
	//Build a table with Base Conversions
	iText += '<div id="ConversionsTableDiv"></div>'

	hSpot.innerHTML = iText
	PopulateBaseNumbers()
	addListeners()
}
function addListeners() {
	let numElements = document.querySelectorAll('.Linkable')

	for (let x = 0; x < numElements.length; x++) {
		oldNum = numElements[x].innerHTML
		if (isNaN(Number(oldNum)) == true) {continue}
		numElements[x].innerHTML = '<a href="javascript:Open_Properties(' + oldNum + ')">' + oldNum + '</a>'
	}
}

function PopulateBaseNumbers() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "tools/number-properties/php/conversions.php?number=" + thisNum);
	xhttp.send();
	xhttp.onreadystatechange = function() {

		//Split the returned string into an an array and use it to set the page's default arrays
		if (this.readyState == 4 && this.status == 200) {
			let baseText = xhttp.responseText
			let baseArr = baseText.split("%%")
			fromBase = baseArr[0].split("-")
			toBase = baseArr[1].split("-")
			BuildConversionTable()
			addListeners()
		}
	}
}

function BuildTopTable() {
	let rText = ""
	
	rText += '<table id="TopTable"><tr><td>'
		if (thisNum > 1) {
			rText += HighlightLink(thisNum - 1)
		}
	rText += '</td>'

	rText += '<td id="TopNumber">' + thisNum + '</td><td>'

	rText += HighlightLink(thisNum + 1) + '</td></tr>'

	//Show Prime factorization
	if (primeArr[0] !== "Prime") {
		rText += '<tr><td id="PrimeString" colspan="3">' + PrimeFactors() + '</td></tr>'
	}

	rText += '</table>'
	return rText
}
function BuildSeqTable() {
	let rText = '<div id=""><table id="SeqTable">'

	if (divArr[0] == (thisNum * 2)) {
		rText += '<tr><td class="NavSeq"></td><td class="SeqPlace"><div class="SeqNum">PERFECT Number!</div></td><td class="NavSeq"></td></tr>'
	}

	for (let y = 0; y < seqArr.length; y++) {
		rText += '<tr><td class="NavSeq">'

		if (seqArr[y][1] > 1) {
			rText += '<a class="RegularLink" href="' + hostFolder + 'tools/number-properties/php/navsequence.php?number=' + thisNum + '&type=back&sequence=' + seqArr[y][0].replaceAll(" ", "_") + '">Prev</a>'
		}

		rText += '</td><td class="SeqPlace"><div class="SeqNum"><b class="Linkable">' + seqArr[y][1] + '</b>' + NumberSuffix(seqArr[y][1]) + '</div>' + ' ' + seqArr[y][0] + '!</td>'

		rText += '<td class="NavSeq">'
		rText += '<a class="RegularLink" href="' + hostFolder + 'tools/number-properties/php/navsequence.php?number=' + thisNum + '&type=next&sequence=' + seqArr[y][0].replaceAll(" ", "_") + '">Next</a>'
		rText += '</td></tr>'

	}

	rText += '</table>'
	return rText
}
function BuildDivisorTable() {
	let rText = '<div id="DivisorTableDiv"><table id="DivisorTable">'
	rText += '<tr><span class="titles">Divisors</span></tr>'
	rText += '<tr><td>Count:</td><td>List:</td><td>Sum:</td></tr>'
	//Modified
	rText += '<tr><td style="vertical-align: top"><b class="Linkable">' + divArr[1] + '</b></td>'

	rText += '<td id="FullDivisorList">' + BuildAllDivisors() + '</td>'

	if (divArr[0] == (thisNum * 2)) {
		rText += '<td  style="vertical-align: top" class="SeqNum"><b class="Linkable">' + divArr[0] + '</b></td></tr>'
	} else {
		//Modified
		rText += '<td style="vertical-align: top"><b class="Linkable">' + divArr[0] + '</b></td></tr>'
	}

	rText += '</table></div>'

	return rText
}
function BuildAllDivisors(impBool = false) {
	const capLength = 8
	let allDivs = []
	let divCap, rText = ""
	
	if (divArr.length > 2) {allDivs = divArr[2].split("|")}

	if (allDivs.length > 0) {

		if (impBool == true) {
			divCap = allDivs.length
		} else {
			if (allDivs.length > capLength) {divCap = capLength} else {divCap = allDivs.length}
		}

		for (let x = 0; x < divCap; x++) {
			if (x > 0) {rText += ', '}
			rText += '<b class="Linkable">' + allDivs[x] + '</b>'
		}

		if (impBool == false && allDivs.length > capLength) {
			rText += ', <a class="RegularLink" href="javascript:BuildAllDivisors(true)">See All</a>'
		}

		//Added code
		rText += '<br><b class="Linkable">' + propArr[1] + '</b>' + NumberSuffix(propArr[1]) + ' Composite #'
	}

	if (impBool == true) {
		document.getElementById("FullDivisorList").innerHTML = rText
		addListeners()
	} else {
		return rText
	}
}
function BuildRelationTable() {
	let rText = '<div id="RelationTableDiv"><h2>' + thisNumStr + '...</h2><table id="RelationTable">'
	for (let z = 0; z < seqItems.length; z++) {
		if (relationArr[z] !== "0") {
			rText += '<tr><td class="RelativeClass"> ' + seqItems[z] + ' #: &nbsp;</td>'
			rText += '<td class="RelativeNum"><b class="Linkable">' + relationArr[z] + '</b></td></tr>'
		}
	}
	rText += '</table></div>'
	return rText
}
function BuildConversionTable() {
	let rText = '<span class="titles">Conversions</span><table id="ConversionTable">'
	rText += '<tr><td>From:</td><td class="conversionMiddle">Numeral system:</td><td>To:</td></tr>'

	for (let x = 0; x < convArr.length; x++) {
		rText += '<tr>'
		if (fromBase[x] !== "0") {rText += '<td><b class="Linkable">' + fromBase[x] + '</b></td>'} else {rText += '<td>-</td>'}
		rText += '<td>' + nameArr[x] + '</td>'
		rText += '<td><b class="Linkable">' + toBase[x] + '</b></td>'
		rText += '</tr>'
	}
	rText += '</table>'
	
	document.getElementById("ConversionsTableDiv").innerHTML = rText
}

window.addEventListener('load', (event) => Get_NumberProperties());
