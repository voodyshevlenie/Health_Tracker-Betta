document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bmi-form');
    const resultsDiv = document.getElementById('results');
    const chartCanvas = document.getElementById('chart').getContext('2d');

    // Получаем сохранённые данные из localStorage
    let bmis = JSON.parse(localStorage.getItem('bmis')) || [];
    let dates = JSON.parse(localStorage.getItem('dates')) || [];

    // Функция для получения текущей даты
    function getCurrentDate() {
        const today = new Date();
        return `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    }

    // Функция для обновления графика
    function updateChart() {
        if (bmis.length === 0 || dates.length === 0) return;

        const chart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Индекс Массы Тела (ИМТ)',
                    data: bmis,
                    fill: false,
                    borderColor: '#007BFF'
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    // Обработчик отправки формы
    form.addEventListener('submit', event => {
        event.preventDefault(); // Отменяем стандартное поведение формы

        const weight = Number(document.getElementById('weight').value);
        const height = Number(document.getElementById('height').value);

        // Вычисление ИМТ
        const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

        // Добавляем значение ИМТ и текущую дату в массивы
        bmis.push(bmi);
        dates.push(getCurrentDate());

        // Сохраняем данные в localStorage
        localStorage.setItem('bmis', JSON.stringify(bmis));
        localStorage.setItem('dates', JSON.stringify(dates));

        // Выводим результат
        resultsDiv.innerHTML = `<p>Ваш Индекс Массы Тела (ИМТ): ${bmi}</p>`;

        // Обновляем график
        updateChart();
    });

    // Первоначальная отрисовка графика при загрузке страницы
    updateChart();
});