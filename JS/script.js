const menuLinks = document.querySelectorAll('.nav a');
console.log(menuLinks);

menuLinks.forEach((link) = function (){
    link.addEventListener('click', scrollToSection);
})
function scrollToSection(event){
     event.preventDefault;
     
}



