import dotenv from 'dotenv';
dotenv.config();

const PORT = parseInt(`${process.env.PORT || 3001}`);
import app from './app';
app.listen(PORT, () => console.log(`Server is running on ${PORT}.`));