/* Clase padre Animal que contiene los datos de nombre, edad, imagen, comentarios y el sonido */
class Animal {
    constructor(nombre, edad, img, comentarios, sonido) {
        this._nombre = nombre;
        this._edad = edad;
        this._img = img;
        this._comentarios = comentarios;
        this._sonido = sonido;
    }

    get Nombre() {
        return this._nombre;
    }

    get Edad() {
        return this._edad;
    }

    get Img() {
        return this._img;
    }

    get Comentarios() {
        return this._comentarios;
    }

    get Sonido() {
        return this._sonido;
    }
}

/* Clases hijas de Animal que llaman todos sus atributos y tienen un método para acceder al sonido específico del animal (león, lobo, oso, serpiente y águila*/
class Leon extends Animal {
    constructor(nombre, edad, img, comentarios, sonido) {
        super(nombre, edad, img, comentarios, sonido);
    }

    rugir() {
        return this._sonido;
    }
}

class Lobo extends Animal {
    constructor(nombre, edad, img, comentarios, sonido) {
        super(nombre, edad, img, comentarios, sonido);
    }

    aullar() {
        return this._sonido;
    }
}

class Oso extends Animal {
    constructor(nombre, edad, img, comentarios, sonido) {
        super(nombre, edad, img, comentarios, sonido);
    }

    grunir() {
        return this._sonido;
    }
}

class Serpiente extends Animal {
    constructor(nombre, edad, img, comentarios, sonido) {
        super(nombre, edad, img, comentarios, sonido);
    }

    sisear() {
        return this._sonido;
    }
}

class Aguila extends Animal {
    constructor(nombre, edad, img, comentarios, sonido) {
        super(nombre, edad, img, comentarios, sonido);
    }

    chillar() {
        return this._sonido;
    }
}

/* Función para cargar los datos al documento */
async function cargarDatos() {
    try {
        const response = await fetch('../animales.json');
        const data = await response.json();

        /* Obtener datos del fomulario */
        const animalSelect = document.getElementById('animal');
        const edadSelect = document.getElementById('edad');
        const comentariosTextarea = document.getElementById('comentarios');
        const tablaAnimales = document.getElementById('Animales');
        const imagenPrevia = document.getElementById('preview');

        /* Evento para seleccionar el nombre del animal */
        animalSelect.addEventListener('change', async function () {
            const nombreAnimal = animalSelect.value;

            /* Acceder al archivo .json con los datos  */
            const animalData = data.animales.find(animal => animal.name === nombreAnimal);
            if (!animalData) {
                console.error('Animal no encontrado en los datos del JSON');
                return;
            }

            try {
                /* Obtener imagen preview del animal elegido en formulario */
                const imgUrl = `assets/imgs/${animalData.imagen}`;

                imagenPrevia.innerHTML = '';
                const imgPreview = document.createElement('img');
                imgPreview.src = imgUrl;
                imgPreview.classList.add('img-fluid');
                imgPreview.style.width = '14rem';
                imgPreview.style.height = '14rem';
                imgPreview.style.objectFit = 'cover';
                imgPreview.style.margin = 'auto';
                imgPreview.style.display = 'block';
                imagenPrevia.appendChild(imgPreview);
            } catch (error) {
                console.error('Error al cargar la imagen previa:', error.message);
            }
        });


        /* Agregar al animal en la tabla */
        function agregarAnimalATabla(animal) {
            const nuevoElemento = document.createElement('div');
            nuevoElemento.innerHTML = `
                <div class="card m-1 bg-secondary">
                    <img src="${animal.Img}" style="width: 8rem; height: 10rem;" class="animal-img">
                    <button class="btn reproducir-audio" data-audio="${animal.sonido}">
                        <i class="fas fa-volume-up text-white fa-lg" ></i>
                    </button>
                </div>
            `;
            tablaAnimales.appendChild(nuevoElemento);

            const btnReproducir = nuevoElemento.querySelector('.reproducir-audio');
            btnReproducir.addEventListener('click', function () {
                reproducirSonido(animal.Sonido);
            });
        }

        /* Función para reproducir el sonido del animal */
        function reproducirSonido(urlSonido) {
            const audio = new Audio(urlSonido);
            audio.play();
        }

        /* Evento para el botón agregar del formulario */
        document.getElementById('btnRegistrar').addEventListener('click', async function () {
            const nombreAnimal = animalSelect.value;
            const edadAnimal = edadSelect.value;
            const comentariosAnimal = comentariosTextarea.value;

            const animalData = data.animales.find(animal => animal.name === nombreAnimal);
            if (!animalData) {
                console.error('Animal no encontrado en los datos del JSON');
                return;
            }

            const nuevaInstancia = new Animal(
                animalData.name,
                edadAnimal,
                `assets/imgs/${animalData.imagen}`,
                comentariosAnimal,
                `assets/sounds/${animalData.sonido}`
            );

            agregarAnimalATabla(nuevaInstancia);
        });
    } catch (error) {
        console.error('Error al cargar los datos del archivo JSON:', error.message);
    }
}

/* Función para mostrar modal con detalles requeridos */
function mostrarModal(edad, comentarios, imgUrl) {
    const modalBody = document.querySelector('#exampleModal .modal-body');

    modalBody.innerHTML = `
        <div class="text-center">
            <img src="${imgUrl}" style="width: 20rem; height: auto;" class="mx-auto d-block">
            <p class="pt-4">${edad}</p>
            <p class="pb-4"><strong>Comentarios</strong></p>
            <p>${comentarios}</p>
        </div>
    `;

    $('#exampleModal').modal('show');
}

/* Función autoejecutable IIFE, es el evento para mostrar el modal al hacer click en la imgen */

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('click', function (event) {
            if (event.target.classList.contains('animal-img')) {
                // Obtener los valores del formulario
                const nombreAnimal = document.getElementById('animal').value;
                const edadAnimal = document.getElementById('edad').value;
                const comentariosAnimal = document.getElementById('comentarios').value;

                // Obtener los valores de la imagen del animal
                const edad = event.target.getAttribute('data-edad');
                const comentarios = event.target.getAttribute('data-comentarios');
                const imgUrl = event.target.getAttribute('src');

                // Mostrar el modal con los detalles del animal
                mostrarModal(edad || edadAnimal, comentarios || comentariosAnimal, imgUrl);
            }
        });

        cargarDatos();
    });
})();
