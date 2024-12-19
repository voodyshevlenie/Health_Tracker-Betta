require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const noble = require('@abandonware/noble');
const axios = require('axios');
const { google } = require('googleapis');

const connectDb = require('./db');
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();

// Настройка логгера запросов
app.use(morgan('dev'));

// Разрешение CORS
app.use(cors());

// Парсер JSON-запросов
app.use(bodyParser.json());

// Обработка статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/devices', deviceRoutes);

// Подключение к MongoDB
connectDb();

// Маршрут для страницы рецептов
app.get('/recipes.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recipe.html'));
});

// Маршрут для страницы добавления устройства
app.get('/add-device.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-device.html'));
});
 
// Обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});

// Функция для поиска и подключения к устройствам
const startBleScan = async () => {
  noble.on('stateChange', async (state) => {
    if (state === 'poweredOn') {
      console.log('Bluetooth включено, начинаем сканирование...');
      noble.startScanning();
    } else {
      console.log('Bluetooth выключено, останавливаем сканирование...');
      noble.stopScanning();
    }
  });

  noble.on('discover', async (peripheral) => {
    console.log(`Найдено устройство: ${peripheral.advertisement.localName}`);

    if (peripheral.advertisement.localName.includes('Fitbit')) {
      console.log('Подключаемся к Fitbit...');
      await peripheral.connect();

      // Определение сервисов и характеристик
      await peripheral.discoverSomeServicesAndCharacteristics(['180d'], ['2a37']);

      const service = peripheral.services[0];
      const characteristic = service.characteristics[0];

      // Чтение данных
      characteristic.read((error, data) => {
        if (error) {
          console.error(error);
          return;
        }

        const steps = parseInt(data.toString('hex'), 16);
        console.log(`Шаги: ${steps}`);

        // Обновление данных устройства в базе данных
        updateDeviceData(peripheral.address, steps);
      });

      // Отключение после завершения чтения данных
      setTimeout(() => {
        peripheral.disconnect();
      }, 2000);
    }
  });
};

// Функция обновления данных устройства
const updateDeviceData = async (macAddress, steps) => {
  try {
    const device = await Device.findOne({ macAddress });
    if (!device) {
      console.log('Устройство не найдено в базе данных');
      return;
    }

    // Добавляем новые данные
    device.data.push({
      steps,
    });

    device.lastSyncTime = new Date();

    await device.save();

    console.log('Данные устройства успешно обновлены');
  } catch (error) {
    console.error(error.message);
  }
};

// Запуск BLE-сканир
// ования
startBleScan();
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scopes = [
 'https://www.googleapis.com/auth/fitness.activity.read',
 'https://www.googleapis.com/auth/fitness.body.read',
];

app.get('/auth', (req, res) => {
   const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent' // Если нужен refresh token
   });

   res.send(`<a href="${authorizationUrl}">Авторизоваться через OpenAI Fit</a>`);
});

app.get('/callback', async (req, res) => {
   const { code } = req.query;

   try {
       const { tokens } = await oauth2Client.getToken(code);
       oauth2Client.setCredentials(tokens);
       
       const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
       
       const todayStart = new Date();
       todayStart.setHours(0,0,0,0);
       const todayEnd = new Date();
       todayEnd.setHours(23,59,59,999);
      
      const todayStartTimeMillis = todayStart.getTime();
      const todayEndTimeMillis = todayEnd.getTime();

      const response = await fitness.users.dataSources.datasets.get({
       userId: 'me',
       dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
       datasetId: `${todayStartTimeMillis * 1000000}-${todayEndTimeMillis * 1000000}`,
      })

      console.log(response.data);
      res.send('Данные получены, проверьте консоль');

   } catch (error) {
       console.error('Ошибка при получении токена:', error);
       res.send('Ошибка авторизации.');
   }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));