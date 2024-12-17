const Device = require('../models/Device');

exports.addDevice = async (req, res) => {
  try {
    const { name, type, macAddress } = req.body;

    // Проверить наличие устройства с таким MAC-адресом
    let device = await Device.findOne({ macAddress });
    if (device) {
      return res.status(409).json({ message: 'Устройство с таким MAC-адресом уже зарегистрировано' });
    }

    // Создать новое устройство
    device = new Device({
      name,
      type,
      macAddress,
    });

    await device.save();

    res.status(201).json(device);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Ошибка при добавлении устройства');
  }
};

exports.getDevices = async (req, res) => {
    try {
      const devices = await Device.find();
      if (!devices || devices.length === 0) {
        return res.status(204).json({ message: 'Нет доступных устройств' }); // Отправляем статус 204 (No Content), если нет устройств
      }
      res.json(devices);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Ошибка при получении списка устройств');
    }
  };

exports.getDeviceByMacAddress = async (req, res) => {
  try {
    const device = await Device.findOne({ macAddress: req.params.macAddress });
    if (!device) {
      return res.status(404).json({ message: 'Устройство не найдено' });
    }
    res.json(device);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Ошибка при получении информации об устройстве');
  }
};

exports.updateDeviceData = async (req, res) => {
    try {
      const { steps, heartRate, caloriesBurned } = req.body;
      const macAddress = req.params.macAddress;
  
      const device = await Device.findOne({ macAddress });
      if (!device) {
        return res.status(404).json({ message: 'Устройство не найдено' });
      }
  
      // Добавляем новые данные
      device.data.push({
        steps,
        heartRate,
        caloriesBurned,
      });
  
      device.lastSyncTime = new Date();
  
      await device.save();
  
      res.json({ message: 'Данные устройства успешно обновлены' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Ошибка при обновлении данных устройства');
    }
  };