const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const fitbitRoutes = require('./routes/fitbitRoutes');

const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config();

mongoose.connect(
  `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`
).then(() => console.log('MongoDB Connected')).catch((err) => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/v1/fitbit', fitbitRoutes);

app.post('/register', async (req, res) => {
  try {
      // Получение данных из тела запроса
      const { username, email, password } = req.body;
      
      // Логика проверки и сохранения пользователя...
  } catch (error) {
      console.error(error);
      res.status(500).send("Произошла ошибка при регистрации");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));