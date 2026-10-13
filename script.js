// Pavão Semi Joias: interações do site

const raiz = document.documentElement;
const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)");
const comMovimento = () => !reduzMovimento.matches;

// ==========================================================
// Slideshow da home
// ==========================================================
let slideIndex = 1;
let timerSlides;
const slides = document.querySelectorAll(".mySlides");
const dots = document.querySelectorAll(".dot");
const contadorAtual = document.querySelector(".slides-contador-atual");

function plusSlides(n) {
  showSlides((slideIndex += n));
  reiniciarAutoplay();
}

function currentSlide(n) {
  showSlides((slideIndex = n));
  reiniciarAutoplay();
}

function showSlides(n) {
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  slides.forEach((slide, i) => {
    const ativo = i === slideIndex - 1;
    slide.classList.toggle("ativo", ativo);
    slide.setAttribute("aria-hidden", String(!ativo));
  });

  dots.forEach((dot, i) => {
    const ativo = i === slideIndex - 1;
    dot.classList.toggle("ativo", ativo);
    dot.setAttribute("aria-current", ativo ? "true" : "false");
  });

  if (contadorAtual) {
    contadorAtual.textContent = String(slideIndex).padStart(2, "0");
  }
}

//Função slide aut. (desligada para quem prefere menos movimento)
function reiniciarAutoplay() {
  clearInterval(timerSlides);
  if (comMovimento()) {
    timerSlides = setInterval(() => showSlides((slideIndex += 1)), 6000);
  }
}

document.querySelector(".prev").addEventListener("click", () => plusSlides(-1));
document.querySelector(".next").addEventListener("click", () => plusSlides(1));
dots.forEach((dot) => {
  dot.addEventListener("click", () => currentSlide(Number(dot.dataset.slide)));
});

showSlides(slideIndex);
reiniciarAutoplay();

// ==========================================================
// Rolagem: navbar e botão voltar ao topo (um único listener)
// ==========================================================
const navbar = document.querySelector(".navbar");
const botaoTopo = document.querySelector(".back-to-top");

const linksNav = document.querySelectorAll(".navbar nav a");
const secoesNav = [...linksNav].map((link) => document.querySelector(link.getAttribute("href")));

function aoRolar() {
  const y = window.scrollY;
  navbar.classList.toggle("com-cor", y > 800);
  navbar.classList.toggle("com-veu", y > 40 && y <= 800);
  botaoTopo.classList.toggle("visivel", y > 800);

  // Destaca no menu a seção que está no meio da tela
  const meio = window.innerHeight / 2;
  let atual = 0;
  secoesNav.forEach((secao, i) => {
    if (secao && secao.getBoundingClientRect().top <= meio) atual = i;
  });
  linksNav.forEach((link, i) => link.classList.toggle("link-ativo", i === atual));
}

window.addEventListener("scroll", aoRolar, { passive: true });
aoRolar();

// ==========================================================
// Catálogo: gerador de produtos e filtro
// ==========================================================
const productGrid = document.getElementById("productGrid");

const categories = [
  { id: "aneis", name: "Anel Elegance", img: "imgcat/aneis.png" },
  { id: "brincos", name: "Brinco Brilhante", img: "imgcat/brincos.png" },
  { id: "colares", name: "Colar Clássico", img: "imgcat/colares.png" },
  { id: "pulseiras", name: "Pulseira de Prata", img: "imgcat/pulseiras.png" },
  { id: "relogios", name: "Relógio Luxo", img: "imgcat/relogios.jpg" },
];

//Gerador
if (productGrid) {
  for (let i = 0; i < 32; i++) {
    const cat = categories[i % categories.length];
    const price = (Math.random() * 500 + 100).toFixed(2).replace(".", ",");
    const numero = String(i + 1).padStart(2, "0");
    //Se eu tirar ele quebra
    const productHtml = `
          <article class="product-item surgir" data-category="${cat.id}" style="--d: ${(i % 4) * 0.08}s">
              <span class="produto__num">Nº ${numero}</span>
              <div class="produto__foto">
                  <img src="${cat.img}" alt="${cat.name} ${i + 1}" loading="lazy">
                  <span class="produto__reflexo"></span>
              </div>
              <h3 class="produto__nome">${cat.name} ${i + 1}</h3>
              <span class="produto__preco">R$ ${price}</span>
              <button class="btn-comprar" type="button">Comprar</button>
          </article>
      `;
    productGrid.insertAdjacentHTML("beforeend", productHtml);
  }
}

const filterBtns = document.querySelectorAll(".filter-btn");
const btnTodos = document.getElementById("btn-todos");
const productItems = document.querySelectorAll(".product-item");
const cardsCategoria = document.querySelectorAll(".card-categoria");

function aplicarFiltro(valor) {
  productItems.forEach((item) => {
    const mostrar = valor === "todos" || item.dataset.category === valor;
    const estavaVisivel = !item.classList.contains("hidden");
    item.classList.toggle("hidden", !mostrar);
    // Itens que voltam a aparecer entram com um fade suave
    if (mostrar && !estavaVisivel && comMovimento()) {
      item.classList.remove("aparecendo");
      void item.offsetWidth;
      item.classList.add("aparecendo");
    }
  });

  cardsCategoria.forEach((card) => card.classList.toggle("ativo", card.dataset.filter === valor));
  btnTodos.classList.toggle("ativo", valor === "todos");

  document.getElementById("catalog").scrollIntoView({ behavior: comMovimento() ? "smooth" : "auto" });
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault(); //Impede que recarregue
    aplicarFiltro(this.dataset.filter);
  });
});

if (btnTodos) {
  btnTodos.addEventListener("click", function (e) {
    e.preventDefault();
    aplicarFiltro("todos");
  });
}

// ==========================================================
// Revelação dos textos: títulos letra a letra e blocos com fade
// ==========================================================
function dividirLetras(titulo) {
  titulo.setAttribute("aria-label", titulo.textContent.replace(/\s+/g, " ").trim());
  const linhas = titulo.querySelectorAll(".linha");
  const partes = linhas.length ? linhas : [titulo];
  let indice = 0;

  partes.forEach((parte) => {
    const palavras = parte.textContent.trim().split(/\s+/);
    parte.textContent = "";
    palavras.forEach((palavra, p) => {
      const spanPalavra = document.createElement("span");
      spanPalavra.className = "palavra";
      spanPalavra.setAttribute("aria-hidden", "true");
      for (const caractere of palavra) {
        const spanLetra = document.createElement("span");
        spanLetra.className = "letra";
        spanLetra.textContent = caractere;
        spanLetra.style.setProperty("--i", indice++);
        spanPalavra.appendChild(spanLetra);
      }
      parte.appendChild(spanPalavra);
      if (p < palavras.length - 1) parte.appendChild(document.createTextNode(" "));
    });
  });
}

const revelaveis = document.querySelectorAll("[data-letras], [data-linha], .surgir");

if (comMovimento() && "IntersectionObserver" in window) {
  document.querySelectorAll("[data-letras]").forEach(dividirLetras);
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("revelado");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  revelaveis.forEach((el) => observador.observe(el));
} else {
  raiz.classList.remove("movimento");
  revelaveis.forEach((el) => el.classList.add("revelado"));
}

// ==========================================================
// Cursor (só com mouse): brilho no fundo de penas
// ==========================================================
if (temMouse.matches && comMovimento()) {
  raiz.classList.add("cursor-fino");

  const brilho = document.querySelector(".fundo__brilho");
  const brilhoPadrao = document.querySelector(".fundo__brilho-padrao");
  const RAIO = 220;

  const alvo = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const atual = { x: alvo.x, y: alvo.y };
  let rodando = false;

  // Interpolação lenta: o brilho "alcança" o mouse com calma
  function quadro() {
    atual.x += (alvo.x - atual.x) * 0.09;
    atual.y += (alvo.y - atual.y) * 0.09;

    brilho.style.transform = `translate3d(${atual.x - RAIO}px, ${atual.y - RAIO}px, 0)`;
    brilhoPadrao.style.transform = `translate3d(${RAIO - atual.x}px, ${RAIO - atual.y}px, 0)`;

    if (Math.abs(alvo.x - atual.x) + Math.abs(alvo.y - atual.y) > 0.2) {
      requestAnimationFrame(quadro);
    } else {
      rodando = false;
    }
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      alvo.x = e.clientX;
      alvo.y = e.clientY;
      brilho.classList.add("ligado");
      if (!rodando) {
        rodando = true;
        requestAnimationFrame(quadro);
      }
    },
    { passive: true }
  );

  raiz.addEventListener("mouseleave", () => brilho.classList.remove("ligado"));
}

// ==========================================================
// Peça em destaque: a foto fixa troca conforme o card no meio da tela
// ==========================================================
const secaoDetalhes = document.querySelector(".detalhes");
const fotosVitrine = document.querySelectorAll(".vitrine-fixa__foto");
const cardsAtributo = document.querySelectorAll(".atributo");
const numeroVitrine = document.querySelector(".vitrine-fixa__atual");
const progressoVitrine = document.querySelector(".vitrine-fixa__progresso");

function mostrarFoto(n) {
  fotosVitrine.forEach((foto) => foto.classList.toggle("ativo", foto.dataset.foto === n));
  cardsAtributo.forEach((card) => card.classList.toggle("ativo", card.dataset.foto === n));
  numeroVitrine.textContent = n.padStart(2, "0");
  progressoVitrine.style.transform = `scaleX(${Number(n) / cardsAtributo.length})`;
}

if (secaoDetalhes && "IntersectionObserver" in window) {
  secaoDetalhes.classList.add("historia");
  mostrarFoto("1");
  const narrador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) mostrarFoto(entrada.target.dataset.foto);
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  cardsAtributo.forEach((card) => narrador.observe(card));
}

// Reflexo de luz seguindo o mouse sobre a foto (só com mouse)
const molduraVitrine = document.querySelector(".vitrine-fixa__moldura");
const reflexoVitrine = document.querySelector(".vitrine-fixa__reflexo");

if (molduraVitrine && temMouse.matches && comMovimento()) {
  molduraVitrine.addEventListener("pointermove", (e) => {
    const r = molduraVitrine.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    reflexoVitrine.style.transform = `translate3d(${nx * 60}%, ${ny * 60}%, 0)`;
  });
}
