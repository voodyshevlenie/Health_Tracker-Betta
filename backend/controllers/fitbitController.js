const FitbitClient = require('fitbit-node');
const FitbitData = require('../models/FitbitData');

class FitbitController {
  constructor() {
    this.client = new FitbitClient({
      clientId: process.env.FITBIT_CLIENT_ID,
      clientSecret: process.env.FITBIT_CLIENT_SECRET,
      apiVersion: '1.2',
    });
  }

  async syncData(req, res) {
    try {
      const { userId, accessToken } = req.body; // Предполагаем, что accessToken уже получен ранее

      // Получаем данные о шагах
      const stepsResponse = await this.client.get(`/1/user/${userId}/activities/steps/date/today.json`, accessToken);
      const steps = stepsResponse['activities-steps'][0].value;

      // Получаем данные о частоте сердечных сокращений
      const heartRateResponse = await this.client.get(`/1/user/${userId}/activities/heart/date/today/1d.json`, accessToken);
      const heartRate = heartRateResponse['activities-heart'][0]['value']['restingHeartRate'];

      // Получаем данные о сне
      const sleepResponse = await this.client.get(`/1.2/user/${userId}/sleep/date/today.json`, accessToken);
      const sleepDuration = sleepResponse.sleep[0].duration / 3600000; // Переводим миллисекунды в часы

      // Сохраняем данные в базу данных
      const fitbitData = new FitbitData({
        userId,
        steps,
        heartRate,
        sleepDuration,
      });
      await fitbitData.save();

      return res.status(200).json({ message: 'Данные успешно синхронизированы!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Произошла ошибка при синхронизации данных.' });
    }
  }
}

module.exports = new FitbitController();