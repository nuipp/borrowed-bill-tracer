const dropdown = document.querySelector('.drpdown');
console.log(dropdown)
dropdown.addEventListener('click', ()=>{
    dropdown.classList.toggle('active')
});