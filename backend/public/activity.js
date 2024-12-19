let usedDates = [];
let activeCanvas; // Переменная для хранения активного холста

// Функция для открытия модального окна
function openModal(event) {
    const modal = document.getElementById('modal');
    modal.style.display = 'block'; // Показываем модальное окно

    // Закрытие модального окна при нажатии на крестик
    const closeButton = document.querySelector('.close-button');
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    // Закрытие модального окна при нажатии вне его области
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Запоминаем активный холст
    activeCanvas = event.currentTarget.parentNode;
}

// Функция для обработки нажатия на кнопку "Создать"
function handleCreateClick() {
    const selectedDate = document.getElementById('datePicker').value;

    if (!usedDates.includes(selectedDate)) {
        addCanvas(selectedDate);
        usedDates.push(selectedDate); // Сохраняем использованную дату
    } else {
        alert("Холст с этой датой уже создан!");
    }
}

// Функция для добавления нового холста
function addCanvas(date) {
    const canvasesContainer = document.getElementById('canvasesContainer');

    // Преобразуем строку даты в объект Date
    const dateObj = new Date(date);

    // Находим индекс для вставки нового холста
    let insertIndex = 0;
    while (
        insertIndex < usedDates.length &&
        new Date(usedDates[insertIndex]) >= dateObj
    ) {
        insertIndex++;
    }

    // Создаем новый холст
    const newCanvasContainer = document.createElement('div');
    newCanvasContainer.classList.add('canvasContainer');
    newCanvasContainer.setAttribute('data-date', date); // Добавляем атрибут data-date

    const heading = document.createElement('h2');
    heading.textContent = `${date}`;

    const addButton = document.createElement('button');
    addButton.classList.add('addExerciseButton');
    addButton.textContent = '+';

    const removeButton = document.createElement('button');
    removeButton.classList.add('removeButton');
    removeButton.textContent = '×';
    removeButton.dataset.date = date; // Сохраняем дату для удаления

    newCanvasContainer.appendChild(heading);
    newCanvasContainer.appendChild(addButton);
    newCanvasContainer.appendChild(removeButton);

    // Вставляем новый холст в нужное место
    if (insertIndex === 0) {
        canvasesContainer.prepend(newCanvasContainer);
    } else {
        canvasesContainer.insertBefore(
            newCanvasContainer,
            canvasesContainer.children[insertIndex]
        );
    }

    // Обработчик для кнопки удаления
    removeButton.addEventListener('click', function () {
        const dateToRemove = this.dataset.date;
        const index = usedDates.indexOf(dateToRemove);
        if (index > -1) {
            usedDates.splice(index, 1); // Удаляем дату из массива
        }
        newCanvasContainer.remove(); // Удаляем холст из документа
    });

    // Обработчик для кнопки добавления упражнения
    addButton.addEventListener('click', openModal);
}

document.addEventListener('DOMContentLoaded', function () {
    const datePicker = document.getElementById('datePicker');
    const createButton = document.getElementById('createButton');

    // Проверяем значение даты при каждом изменении
    datePicker.addEventListener('change', function () {
        if (this.value !== '' && !usedDates.includes(this.value)) {
            createButton.disabled = false;
        } else {
            createButton.disabled = true;
        }
    });

    // Обработчик клика на кнопку "Создать"
    createButton.addEventListener('click', handleCreateClick);

    // Обработка отправки формы в модальном окне
    document.getElementById('exerciseForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const exerciseName = document.getElementById('exerciseName').value;
        const reps = document.getElementById('reps').value;

        // Создаём элемент списка с упражнением
        const exerciseItem = document.createElement('li');
        exerciseItem.textContent = `${exerciseName}: ${reps}повторений`;

        // Если активный холст существует, добавляем в него упражнение
        if (activeCanvas) {
            const exercisesList = activeCanvas.querySelector('ul') || document.createElement('ul'); // создаем список если его нет
            
            // Проверяем, есть ли уже такое упражнение в списке
            const existingItems = Array.from(exercisesList.querySelectorAll('li'));
            const isDuplicate = existingItems.some(item => item.textContent.startsWith(`${exerciseName}`));

            if (!isDuplicate) {
                exercisesList.append(exerciseItem);
                activeCanvas.append(exercisesList);
            } else {
                alert('Такое упражнение уже добавлено!');
            }
        }

        // Скрыть модальное окно после сохранения
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    });
});