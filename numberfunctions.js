function Get_SeqSpots(impVal) {
	let retArr = []

	if (optArr.Sequences == "off") {return}

	for (let x = 0; x < seqLists[0].length; x++) {
		this_SeqSpot = NumSeq[seqLists[0][x]].indexOf(impVal)
		if (this_SeqSpot > -1) {
			retArr.push([seqLists[0][x], this_SeqSpot + 1])
		}
	}

	if (optArr.Sequences == "all") {
		for (let y = 0; y < seqLists[1].length; y++) {
			this_SeqSpot = NumSeq[seqLists[1][y]].indexOf(impVal)
			if (this_SeqSpot > -1) {
				retArr.push([seqLists[1][y], this_SeqSpot + 1])
			}
		}
	}

	return retArr
}

function Check_Seq() {
	let seqArr, gSpot, newHTML

	for (let x = 0; x < allCiphers.length; x++) {
		thisCipher = allCiphers[x]
		if (thisCipher.isOn == false) {continue}

		thisName = thisCipher.Nickname
		gSpot = document.getElementById("TableValue_" + thisName.replaceAll(" ", "_"))
		thisG = thisCipher.gemTotal
		seqArr = Get_SeqSpots(thisG)

		if (seqArr.length > 0) {
			//jQuery(gSpot).addClass("InSeqList")
			newHTML = '<div id="SeqList_' + thisName + '" class="InSeqList"><a href="javascript:Open_NumberProperties(' + thisG + ')">' + gSpot.innerHTML + '</a>'
				newHTML += '<div id="SeqDrop_' + thisName + '" class="InSeqDetails">'
				for (let y = 0; y < seqArr.length; y++) {
					thisSeq = seqArr[y][0]; thisNumber = Number(seqArr[y][1])
					if (y > 0) {newHTML += '<BR>'}
					newHTML += NumberSuffix(thisNumber) + ' ' + thisSeq.substring(0, thisSeq.length - 1) + " number"
				}
				newHTML += '</div></div>'
		} else {
			newHTML = '<a href="javascript:Open_NumberProperties(' + thisG + ')">' + gSpot.innerHTML + '</a>'
		}

		// gSpot.innerHTML = newHTML
		// document.getElementById("AdamTestNumProp").innerHTML = newHTML;
	}
}

function NumberSuffix(impVal) {
	let sVal = String(impVal)
	let sVal2 = Number(sVal.substring(sVal.length - 2))

	switch (sVal2) {
		case 11:
		case 12:
		case 13:
			return "th"; break;
		default:
			switch (Number(sVal.substring(sVal.length - 1))) {
				case 0:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
					return "th"; break
				case 1:
					return "st"; break
				case 2:
					return "nd"; break
				case 3:
					return "rd"; break
			}
	}
}

function StandardizeSeqItems() {
	for (let x = 0; x < seqItems.length; x++) {
		seqItems[x] = seqItems[x].replaceAll("_", " ")
	}
}

function PrimeFactors() {
	let factArr = [[primeArr[0], 1]], strArr = [], rStr = ""

	for (x = 1; x < primeArr.length; x++) {
		thisFact = primeArr[x]
		if (thisFact == factArr[factArr.length - 1][0]) {
			factArr[factArr.length - 1][1]++
		} else {
			factArr.push([thisFact, 1])
		}
	}

	for (let thisFactor of factArr) {
		if (thisFactor[1] > 1) {
			strArr.push(String(thisFactor[0]) + String(thisFactor[1]).sup())
		} else {
			strArr.push(String(thisFactor[0]))
		}
	}
	
	return strArr.join(" Ã— ")
}

function HighlightLink(impNum) {
	return '<a class="RegularLink" href="javascript:Open_Properties(' + impNum + ')">' + impNum + '</a>'
}

function NavNumber(impNum = document.getElementById("NumberField").value) {
	if (impNum > 0 & impNum < 1000000) {window.location = hostFolder + '?number=' + impNum}
}

function CheckEnter(impEvent) {
	if (impEvent.key == "Enter") {
		NavNumber()
	}
}

function Open_Properties(impNum) {
	let iHTML = ""
    if (impNum > 0 && impNum < 10000000) {
        document.getElementById("NumberField").value = impNum
        NavNumber()
    }
}
