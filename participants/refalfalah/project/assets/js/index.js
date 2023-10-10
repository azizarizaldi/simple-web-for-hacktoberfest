const menuToggle = document.querySelector('input');

menuToggle.addEventListener('click', function() {

    let nav = document.getElementById("navbar");
    const isChecked = menuToggle.checked;
    
    if (isChecked) {
        if (nav.classList.contains("toggle")) {
            return;
        }else {
            nav.classList.add("toggle");
        }
    }else {
        if (nav.classList.contains("toggle")) {
            nav.classList.remove("toggle");
        }else {
            return;
        }
    }
});

const ul = document.querySelector('ul');
const a = document.querySelectorAll('a');

ul.addEventListener('click', function (e) {

    a.forEach(function (a) {
        a.className = 'link';
    });

    if(e.target.classList.contains('link')) {
        e.target.classList.add('aktif');
    }
});