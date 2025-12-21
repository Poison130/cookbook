const API = 'https://dummyjson.com/recipes';

const recipesContainer = document.getElementById('recipes');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const tagList = document.getElementById('tagList');

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

const DEFAULT_LIMIT = 0;

async function loadRecipes(url = `${API}?limit=${DEFAULT_LIMIT}`) {
    const res = await fetch(url);
    const data = await res.json();
    renderRecipes(data.recipes || [data]);
}

function renderRecipes(recipes) {
    recipesContainer.innerHTML = '';

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';

        const ingredientsPreview =
            recipe.ingredients.slice(0, 3).join(', ') +
            (recipe.ingredients.length > 3 ? '…' : '');

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <div class="info">
                <h3>${recipe.name}</h3>
                <div class="recipe-row">
                    <span>💪 ${recipe.difficulty}</span>
                    <span>⏱ ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} мин</span>
                </div>
                <div class="recipe-country">
                    🌍 ${recipe.cuisine}
                </div>
                <div class="recipe-ingredients">
                    ${ingredientsPreview}
                </div>
                <div class="recipe-rating">
                    ⭐ ${recipe.rating}
                </div>
            </div>
        `;

        card.onclick = () => openRecipe(recipe.id);
        recipesContainer.appendChild(card);
    });
}

async function openRecipe(id) {
    const res = await fetch(`${API}/${id}`);
    const recipe = await res.json();

        modalBody.innerHTML = `
        <h2>${recipe.name}</h2>

        <img src="${recipe.image}" class="modal-image">

        <div class="recipe-badges">
            <div class="badge badge-country">🌍 ${recipe.cuisine}</div>
            <div class="badge badge-difficulty">💪 ${recipe.difficulty}</div>
            <div class="badge badge-time">⏱ ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} мин</div>
            <div class="badge badge-rating">⭐ ${recipe.rating}</div>
        </div>

        <div class="section-box">
            <h3>Ingredients</h3>
            <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>

        <div class="section-box">
            <h3>Instructions</h3>
            <ol>${recipe.instructions.map(s => `<li>${s}</li>`).join('')}</ol>
        </div>
    `;


    modal.classList.remove('hidden');
}

searchBtn.onclick = () => {
    const q = searchInput.value.trim();
    loadRecipes(
        q
            ? `${API}/search?q=${q}&limit=${DEFAULT_LIMIT}`
            : `${API}?limit=${DEFAULT_LIMIT}`
    );

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

async function loadTags() {
    const allLi = document.createElement('li');
    allLi.textContent = 'All';
    allLi.classList.add('active');

    allLi.onclick = () => {
        document.querySelectorAll('.categories li').forEach(t => t.classList.remove('active'));
        allLi.classList.add('active');
        loadRecipes(`${API}?limit=${DEFAULT_LIMIT}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    tagList.appendChild(allLi);

    const res = await fetch(`${API}/tags`);
    const tags = await res.json();

    tags.forEach(tag => {
        const li = document.createElement('li');
        li.textContent = tag;

        li.onclick = () => {
            document.querySelectorAll('.categories li').forEach(t => t.classList.remove('active'));
            li.classList.add('active');
            loadRecipes(`${API}/tag/${tag}?limit=${DEFAULT_LIMIT}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        tagList.appendChild(li);
    });
}

closeModal.onclick = () => modal.classList.add('hidden');
modal.onclick = e => e.target === modal && modal.classList.add('hidden');

loadRecipes();
loadTags();
