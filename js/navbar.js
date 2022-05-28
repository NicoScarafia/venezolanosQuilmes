let mobileNavlist = document.querySelector('#mobile_navlist')

let mobileMenu = document.querySelector('#mobileNavMenu')
mobileMenu.addEventListener('click', () => {mobileNavlist.classList.toggle('translateObjActive')})

let closeMobileNav = document.querySelector('#closeMobileNav')
closeMobileNav.addEventListener('click', () => {mobileNavlist.classList.remove('translateObjActive')})

window.onscroll = () => { mobileNavlist.classList.remove('translateObjActive') }