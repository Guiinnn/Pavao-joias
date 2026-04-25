let slideIndex = 1;

showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
//Função slide aut.
setInterval(function () {
  plusSlides(1);
}, 6000);
//Função nav bar inv.
window.addEventListener("scroll", function () {
  let navbar = this.document.querySelector(".navbar");
  if (this.window.scrollY > 800) {
    navbar.classList.add("com-cor");
  } else {
    navbar.classList.remove("com-cor");
  }
});
//Função botão bck to top.
window.onscroll = function () {
  var botao = document.querySelector(".back-to-top");
  if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
    botao.style.display = "block";
  } else {
    botao.style.display = "none";
  }
};

// Filtro
document.addEventListener("DOMContentLoaded", function () {
  const productGrid = document.getElementById('productGrid');

  const categories = [
    { id: 'aneis', name: 'Anel Elegance', img: 'imgcat/aneis.png' },
    { id: 'brincos', name: 'Brinco Brilhante', img: 'imgcat/brincos.png' },
    { id: 'colares', name: 'Colar Clássico', img: 'imgcat/colares.png' },
    { id: 'pulseiras', name: 'Pulseira de Prata', img: 'imgcat/pulseiras.png' },
    { id: 'relogios', name: 'Relógio Luxo', img: 'imgcat/relogios.jpg' }
  ];
  //Gerador
  if (productGrid) {
    for (let i = 0; i < 32; i++) {
      const cat = categories[i % categories.length];
      const price = (Math.random() * 500 + 100).toFixed(2).replace('.', ',');
      //Se eu tirar ele quebra
      const productHtml = `
            <div class="product-item" data-category="${cat.id}">
                <img src="${cat.img}" alt="${cat.name}">
                <p>${cat.name} ${i + 1}</p>
                <span>R$ ${price}</span>
                <button class="btn-comprar">Comprar</button>
            </div>
        `;
      productGrid.insertAdjacentHTML('beforeend', productHtml);
    }
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const btnTodos = document.getElementById('btn-todos');
  const productItems = document.querySelectorAll('.product-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); //Impede que recarregue
      const filterValue = this.getAttribute('data-filter');

      productItems.forEach(item => {
        if (item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });
  });

  if (btnTodos) {
    btnTodos.addEventListener('click', function (e) {
      e.preventDefault();
      productItems.forEach(item => {
        item.classList.remove('hidden');
      });
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });
  }
});