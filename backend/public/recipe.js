document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const resultsDiv = document.getElementById('results');
    const queryInput = document.getElementById('queryInput');

    // Функция для получения рецептов по запросу
    async function fetchRecipes(query) {
        try {
            const response = await axios.get(`https://api.spoonacular.com/recipes/search?query=${encodeURIComponent(query)}&number=10&apiKey=9b52ba700f854408bd80787aefe15964`);
            return response.data.results;
        } catch (error) {
            console.error("Ошибка при получении рецептов:", error.message);
            alert('Произошла ошибка при получении рецептов.');
        }
    }

    // Обработчик формы поиска
    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const query = queryInput.value.trim();
        if (!query) return;

        // Очистка предыдущих результатов
        resultsDiv.innerHTML = '';

        // Получение рецептов
        const recipes = await fetchRecipes(query);

        if (recipes && recipes.length > 0) {
            // Отображение рецептов
            recipes.forEach(recipe => {
                const div = document.createElement('div');
                div.className = 'recipe';
                
                const title = document.createElement('p');
                title.className = 'recipe-title';
                title.textContent = recipe.title;

                const detailsButton = document.createElement('button');
                detailsButton.textContent = 'Подробнее';
                detailsButton.onclick = async function() {
                    if (div.classList.contains('show-details')) {
                        div.classList.remove('show-details');
                        detailsButton.textContent = 'Подробнее';
                    } else {
                        const instructions = await getRecipeInstructions(recipe.id);
                        const details = document.createElement('p');
                        details.className = 'recipe-details';
                        details.textContent = instructions;
                        div.appendChild(details);
                        div.classList.add('show-details');
                        detailsButton.textContent = 'Скрыть';
                    }
                };

                div.appendChild(title);
                div.appendChild(detailsButton);
                resultsDiv.appendChild(div);
            });
        } else {
            console.log("Рецептов не найдено.");
            alert("По вашему запросу ничего не найдено.");
        }
    });

    // Реакция на изменение поля ввода
    queryInput.addEventListener('input', async function() {
        const query = this.value.trim();
        if (query.length === 0) {
            resultsDiv.innerHTML = ''; // Очистка результатов, если поле пустое
            return;
        }

        // Получение рецептов
        const recipes = await fetchRecipes(query);

        if (recipes && recipes.length > 0) {
            // Отображение рецептов
            resultsDiv.innerHTML = ''; // Очистка предыдущих результатов перед новым набором
            recipes.forEach(recipe => {
                const div = document.createElement('div');
                div.className = 'recipe';
                
                const title = document.createElement('p');
                title.className = 'recipe-title';
                title.textContent = recipe.title;

                const detailsButton = document.createElement('button');
                detailsButton.textContent = 'Подробнее';
                detailsButton.onclick = async function() {
                    if (div.classList.contains('show-details')) {
                        div.classList.remove('show-details');
                        detailsButton.textContent = 'Подробнее';
                    } else {
                        const instructions = await getRecipeInstructions(recipe.id);
                        const details = document.createElement('p');
                        details.className = 'recipe-details';
                        details.textContent = instructions;
                        div.appendChild(details);
                        div.classList.add('show-details');
                        detailsButton.textContent = 'Скрыть';
                    }
                };

                div.appendChild(title);
                div.appendChild(detailsButton);
                resultsDiv.appendChild(div);
            });
        } else {
            console.log("Рецептов не найдено.");
            alert("По вашему запросу ничего не найдено.");
        }
    });

    // Функция для получения инструкций рецепта
    async function getRecipeInstructions(id) {
        try {
            const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=9b52ba700f854408bd80787aefe15964`);
            return response.data.instructions;
        } catch (error) {
            console.error("Ошибка при получении инструкции рецепта:", error.message);
            alert('Произошла ошибка при получении инструкции рецепта.');
        } 
    }
});