function go(page){

document.querySelectorAll('.page').forEach(p=>{
p.classList.remove('on')
})

document.getElementById('pg-'+page).classList.add('on')

window.scrollTo({
top:0,
behavior:'smooth'
})

}

function mobMenu(){

document.getElementById('nav').classList.toggle('open')

}

window.addEventListener('scroll',function(){

document.getElementById('nav').classList.toggle(
's',
window.scrollY>30
)

})
