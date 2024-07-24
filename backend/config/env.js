PORT=process.env.PORT
DB_URL=process.env.DB_URL
SECRET_KEY=process.env.SECRET_KEY
EMAIL_USER = process.env.EMAIL_USER
EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
CLOUD_NAME = process.env.CLOUD_NAME
CLOUD_API_KEY = process.env.CLOUD_API_KEY
CLOUD_API_SECRET= process.env.CLOUD_API_SECRET



module.exports = {
    PORT,
    DB_URL,
    SECRET_KEY,
    EMAIL_PASSWORD,
    EMAIL_USER,
    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_API_SECRET
}