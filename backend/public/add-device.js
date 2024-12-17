document.addEventListener('DOMContentLoaded', () => {
  const scanButton = document.getElementById('scanButton');
  const deviceList = document.getElementById('deviceList');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const findDeviceButton = document.getElementById('findDeviceButton');

  scanButton.addEventListener('click', () => {
    // Показываем анимацию загрузки
    loadingSpinner.style.display = 'block';

    axios.get('/api/devices')
      .then(response => {
        deviceList.innerHTML = '';
        response.data.forEach(device => {
          const li = document.createElement('li');
          li.className = 'device-item';
          li.innerHTML = `
            <span class="device-name">${device.name}</span>
            <button class="connect-button" onclick="connectDevice('${device.macAddress}')">Подключить</button>
          `;
          deviceList.appendChild(li);
        });

        // Скрываем анимацию загрузки
        loadingSpinner.style.display = 'none';
      })
      .catch(error => {
        alert('Ошибка при поиске устройств');

        // Скрываем анимацию загрузки
        loadingSpinner.style.display = 'none';
      });
  });

  findDeviceButton.addEventListener('click', findDevice);

  async function findDevice() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: [],
      });

      document.getElementById('status').textContent = 'Устройство найдено: ' + device.name;

      const gattServer = await device.gatt.connect();
      const service = await gattServer.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');

      characteristic.addEventListener('characteristicvaluechanged', handleHeartRateChange);
      await characteristic.startNotifications();

      // Отправляем данные на сервер
      fetch('/send-bluetooth-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ deviceId: device.id }),
      });
    } catch (error) {
      console.error('Ошибка подключения устройства:', error);
    }
  }

  function handleHeartRateChange(event) {
    let value = event.target.value;
    let heartRate = value.getUint16(1);
    document.getElementById('status').textContent = 'Текущий пульс: ' + heartRate;
  }

  window.connectDevice = macAddress => {
    axios.put(`/api/devices/${macAddress}/data`)
      .then(response => {
        alert('Устройство успешно подключено');
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          alert('Устройство не найдено');
        } else {
          alert('Ошибка при подключении устройства');
        }
      });
  };
  async function requestBluetoothConnection() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{
          services: ['heart_rate']  // Замените на нужные сервисы
        }],
        optionalServices: []
      });

      const gattServer = await device.gatt.connect();
      const service = await gattServer.getPrimaryService('heart_rate');  // Замените на нужный сервис
      const characteristic = await service.getCharacteristic('heart_rate_measurement');  // Замените на нужную характеристику

      // Добавьте здесь необходимую обработку данных с устройства

      return Promise.resolve();  // Возвращаем успешное выполнение
    } catch (error) {
      console.error('Ошибка подключения устройства:', error);
      throw new Error('Не удалось установить соединение с Bluetooth.');
    }
  }
});
