import { flsModules } from "./modules.js";
import { InertiaPlugin } from "gsap/InertiaPlugin.js";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";
import { Draggable } from "gsap/Draggable.js";
import { gsap } from "gsap";


export function isWebp() {

	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});
}

export let isMobile = {
	Android: function () { return navigator.userAgent.match(/Android/i); },
	BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
	iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
	Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
	Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

export function addTouchClass() {

	if (isMobile.any()) document.documentElement.classList.add('touch');
}

export let bodyLockStatus = true;
export let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
}
export let bodyUnlock = (delay = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			document.documentElement.classList.remove("lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}
export let bodyLock = (delay = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		document.documentElement.classList.add("lock");

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}


let open = false;





window.addEventListener("resize", updateSize);







let draggableInstance = { kill() { } } // создаем пустышку, чтобы не было ошибки если ширина экрана больше 768 изначально

function updateSize() {
	// console.log("resize")
	if (window.innerWidth >= 768) {
		gsap.set(".menu__body", { left: 0 }) // для ресайза, если размер окна был мобильным, а потом больше 768 то нужно обнулить left
		draggableInstance.kill() // для ресайза, если размер был мобильным, а потом больше 768 то нужно удалить событие draggable
	} else {
		menuClose()
		reloadDraggable()
		menuToggleDrag(close = true)
		open = false
	}
}


// let boundsBox



gsap.registerPlugin(InertiaPlugin);
// gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(Draggable);

if (window.innerWidth >= 768) {
} else {
	reloadDraggable()
}

function reloadDraggable() {

	let boundsBox = { minX: -(window.innerWidth), maxX: 0 }

	gsap.set(".menu__body", { left: -(window.innerWidth) }) // after resize new position left

	draggableInstance = Draggable.create(".menu__body", {
		type: "left", edgeResistance: 1, trigger: [".wrapper", ".menu__body"], bounds: boundsBox, inertia: true, throwProps: true,
		snap:
			function (value) {

				const directionDrag = this.getDirection()
				const offset = window.innerWidth / 100 * 30 // 30 - it's percents offset from center
				// console.log(offset)
				switch (directionDrag) {

					case "right":
						// console.log(directionDrag)
						value = value + offset
						break
					case "left":
						// console.log(directionDrag)
						value = value - offset
						break

				}

				// console.log(Math.round(value / window.innerWidth) * window.innerWidth)
				return Math.round(value / window.innerWidth) * window.innerWidth;
			}
		, onThrowUpdate: function () {
			// console.log(this.x)
			let percentDrag = (this.x / window.innerWidth * 100) + 100
			// console.log(percentDrag)
			// console.log(percentDrag * (0.45))
			gsap.set(".icon-menu__before", { rotation: percentDrag * (0.45), y: percentDrag * 0.07 });
			gsap.set(".icon-menu__center", { opacity: 1 - percentDrag / 100 });
			gsap.set(".icon-menu__after", { rotation: percentDrag * (-0.45), y: percentDrag * -0.07 });
		}
		, onThrowComplete: function () {
			// console.log("endX ", this.endX)
			// open = !(this.endX);// switch state "open" if menu was opened with draggable
			// console.log("open ", open);
		}
		, onDragStart: function () {
			// console.log("start")
		},
		onMove: function () {

			let percentDrag = (this.x / window.innerWidth * 100) + 100

			gsap.set(".icon-menu__before", { rotation: percentDrag * (0.45), y: percentDrag * 0.07 });
			gsap.set(".icon-menu__center", { opacity: 1 - percentDrag / 100 });
			gsap.set(".icon-menu__after", { rotation: percentDrag * (-0.45), y: percentDrag * -0.07 });


		},
		onDragEnd: function (e) {
			// console.log("end")
			// console.log(this.tween)
			if (!(this.endX)) { // if draggable menu open
				menuOpen()
				console.log("menuOpen ", open)
				open = true
			} else {
				menuClose()
				console.log("menuClose ", open)
				open = false
			}

		},
		update: function () {
			// console.log("update")
			// console.log(this.x)

		},
	})[0];
}











export function menuToggleInit() {

	if (document.querySelector(".icon-menu")) {
		document.addEventListener("click", function (e) {
			if (bodyLockStatus && e.target.closest('.icon-menu')) {
				bodyLockToggle();
				document.documentElement.classList.toggle("menu-open");
				menuToggleDrag();
			}
		});
	};
}

const menuToggleDrag = (function () {

	// let open = false;
	return function (close) {
		console.log("menuToggleDrag ", open)
		if (!open && !close) {
			open = !open;
			gsap.to(".menu__body", {
				duration: 1,
				ease: "ease",
				left: 0
			})

			gsap.to(".icon-menu__before", { rotation: 45, y: 7 })
			gsap.to(".icon-menu__center", { opacity: 0 })
			gsap.to(".icon-menu__after", { rotation: -45, y: -7 })

		} else if (close) {
			gsap.set(".menu__body", {
				duration: 1,
				ease: "ease",
				left: -(window.innerWidth)
			})

			gsap.to(".icon-menu__before", { rotation: 0, y: 0 })
			gsap.to(".icon-menu__center", { opacity: 1 })
			gsap.to(".icon-menu__after", { rotation: 0, y: 0 })
		} else {
			open = !open;
			gsap.to(".menu__body", {
				duration: 1,
				ease: "ease",
				left: -(window.innerWidth)
			})

			gsap.to(".icon-menu__before", { rotation: 0, y: 0 })
			gsap.to(".icon-menu__center", { opacity: 1 })
			gsap.to(".icon-menu__after", { rotation: 0, y: 0 })
		}

	}

})();


export function menuOpen() {
	bodyLock();
	document.documentElement.classList.add("menu-open");

}
export function menuClose() {
	bodyUnlock();
	document.documentElement.classList.remove("menu-open");
}