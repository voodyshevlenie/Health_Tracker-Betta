const to_create = document.getElementById('to-create');
const modal = document.getElementById('myModal');
const closeBtn = document.getElementsByClassName("close")[0];
const alarmList = document.getElementById('alarmList');
const repeatOptions = document.querySelectorAll('input[name="repeat"]');
const daysOfWeek = document.getElementById('daysOfWeek');

to_create.onclick = () => {
    modal.style.display = "block";
}

closeBtn.onclick = () => {
    modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

repeatOptions.forEach(option => {
    option.onclick = () => {
        if (option.value === 'weekly') {
            daysOfWeek.style.display = "block";
        } else {
            daysOfWeek.style.display = "none";
        }
    };
});

document.getElementById('setAlarm').addEventListener('click', () => {
    const time = document.getElementById('time').value;
    const repeatChoice = document.querySelector('input[name="repeat"]:checked').value;
    let days = Array.from(document.querySelectorAll('#daysOfWeek input:checked')).map(input => input.value).join(', ');
    const nazvanie = document.getElementById('nazvanie').value;

    if (!time) {
        alert("Пожалуйста, выберите время!");
        return;
    }

    if (repeatChoice === 'weekly' && !days.length) {
        alert("Пожалуйста, выберите хотя бы один день недели!");
        return;
    }

    const alarmItem = document.createElement('div');
    alarmItem.classList.add('alarm-item');

    const deleteButton = document.createElement('button'); // Создаем кнопку удаления
    deleteButton.classList.add('delete');
    deleteButton.textContent = 'Удалить';

    if (repeatChoice === 'once') {
        alarmItem.textContent = `${nazvanie} ${time} Один раз`;
    } else {
        alarmItem.textContent = `${nazvanie} ${time} Каждый: ${days}`;
    }

    alarmItem.appendChild(deleteButton); // Добавляем кнопку в .alarm-item

    // Обработчик события для кнопки удаления
    deleteButton.addEventListener('click', () => {
        alarmItem.remove(); // Удаление элемента .alarm-item
    });

    alarmList.appendChild(alarmItem);

    modal.style.display = "none";

    document.getElementById('time').value = "";
    document.querySelectorAll('#daysOfWeek input').forEach(input => input.checked = false);
});