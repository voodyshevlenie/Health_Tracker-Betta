const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Проверить существование пользователя
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Хеширование пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создание нового пользователя
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        // Сохранение пользователя в БД
        await user.save();

        // Генерация JWT токена
        const token = generateJwtToken(user._id);

        // Ответ клиенту
        res.json({ token });
    } catch (err) {
        console.error("Error registering user:", err.message);
        res.status(500).send("HUI SOSI");
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Найти пользователя по email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Проверить совпадение паролей
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Генерация JWT токена
        const token = generateJwtToken(user._id);

        // Ответ клиенту
        res.status(200).json({ token });
    } catch (err) {
        console.error("Error logging in user:", err.message);
        res.status(500).send("Server Error");
    }
};

function generateJwtToken(userId) {
    const payload = {
        user: {
            id: userId,
        },
    };
    return jwt.sign(payload, "jwtSecret", { expiresIn: 3600 });
}