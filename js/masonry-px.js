/*
a =  TamRealW - 300 			// 1620 = 1920 - 300 
v = TamRealW * 0,0001 	// 0,162  1620 * 0.0001
TamFinalH = v * TamRealH


*/



	const ColectIMG = []

function msr (containerSelector, itemsSelector, GRheight) {
	const items = document.querySelectorAll(itemsSelector),
		  container = document.querySelector(containerSelector),
		  imgItems = [...document.querySelectorAll('.masonry-item img')]

	for (let i = 0; i < items.length; i++) {

		const H = imgItems[i].height 
		const W = imgItems[i].width 
		const newIMG = document.createElement("img")
		newIMG.src = imgItems[i].src
		ColectIMG.push(newIMG)

		console.log(H,Math.round((H) / GRheight),Math.round( ((H / 2) / GRheight) ),W,items[i])


		if(H<500){
			// items[i].classList.add(`mi-row-${Math.round((H) / GRheight)}`)
			items[i].style.gridRowEnd = 'span ' + Math.round(H / GRheight);
			items[i].style.position = 'relative'
		}

		else if(H>500 && H<1000){
			console.log("yes")
			// items[i].classList.add(`mi-row-${Math.round((H / 2) / GRheight)}`)
			items[i].style.gridRowEnd = 'span ' + Math.round( ((H / 2) / GRheight) );
			items[i].style.position = 'relative'
		}else{
			console.log("yes 2")
			// items[i].classList.add(`mi-row-${Math.round((H / 2) / GRheight)}`)
			items[i].style.gridRowEnd = 'span ' + Math.round( ((H / 3) / GRheight) );
			items[i].style.position = 'relative'
		}

		// ColectIMG.forEach(el=>{
		// 	console.log((el.height / 2),el.height, Math.round((el.height / 2) / 100) ) 
		// })



		/* switch (Math.round(H / GRheight)) {
			case 1:
				items[i].style.gridRowEnd = 'span 1';
				break;


			case 2:
				items[i].style.gridRowEnd = 'span 2';
				break;


			case 3:
				items[i].style.gridRowEnd = 'span 3';
				break;


			case 4:
				items[i].style.gridRowEnd = 'span 4';
				break;


			case 5:
				items[i].style.gridRowEnd = 'span 5';
				break;


			case 6:
				items[i].style.gridRowEnd = 'span 6';
				break;

		
			default:
				break;
		} */

		// console.log(imgItems[i].height)
	}

	// container.classList.add('masonry-layout')
}

console.log('HEY')

addEventListener("load", ev => {
	msr('.masonry-layout', '.masonry-item', 100)
	console.log("Inicia")
})	




// function msr (containerSelector, itemsSelector, numColumns, gap) {
// 	const items = document.querySelectorAll(itemsSelector),
// 		  container = document.querySelector(containerSelector),
// 		  imgItems = [...document.querySelectorAll('.masonry-item img')]

// 	for (let i = 0, posX = 0; i < items.length; i++) {
// 		items[i].style.width = ( parseInt(imgItems[i].width) / numColumns ) - ( gap*2 ) + 'px';

// 		items[i].style.left = `calc((100% / ${numColumns}) * ${posX})`
		
// 		if(posX < numColumns){
// 			posX++
// 		}else
// 			posX = 0
		
// 		const H = imgItems[i].height

// 		console.log(H, imgItems[i])
		
// 		// console.log(items[i].style.width, ( parseInt(imgItems[i].width) / numColumns ) - ( gap*2 ) + 'px')
// 	}
// }

// console.log('HEY')

// addEventListener("load", ev => {
// 	msr('.masonry-layout', '.masonry-item', 3, 10)
// })	













































/* 
function masonry (container,Elems, columns) {
	container.classList.add("masonry-layout", `columns-${columns}`)
	const colColect = []


	for(let i = 0; i < columns; i++){ //columna 0 => i=0
		const container = document.createDocumentFragment()


		//items = 0				|  < 23 / 3 = 4  0 1 2 3 
		console.log("antes del For Interno")
		console.log("columna -> ",i)
		
		for(let items = i, c = 0; c < Math.ceil(Elems.length / columns); items+=(columns), c++){
			console.log(Elems[items], c)
			container.appendChild(Elems[items])
		}
		
		console.log("justo despues del For Interno")
		
		const cItems = document.createElement('div')
		cItems.appendChild(container)
		colColect.push(cItems)
		
		console.log("despues del For Interno")
	}

	console.log(colColect);

	colColect.forEach( el => {
		container.appendChild(el)
	});

	// for (let i = 0; i <= columns; i++) {
	// 	let Col = document.createElement('div')
	// 	Col.classList.add("masonry-columns", `column-${$i}`)
	// 	container.appendChild(Col)
	// 	colColect.push(Col);
	// }

	// for (var i = .length - 1; i >= 0; i--) {
	// 	[i]
	// }
}


const c = document.querySelector('.masonry-layout ')
const el = document.querySelectorAll('.masonry-item')


addEventListener("load",()=>{
	masonry(c,el,4);
})
 */