// index.js (Versión Infalible)
import express from 'express';
const app = express();
const port = process.env.PORT || 8080;
app.get('/', (req, res) => {
  res.send('Servicio Nexus: Online y esperando órdenes.');
});
app.listen(port, () => {
  console.log(`🚀 Servidor de contingencia escuchando en el puerto ${port}`);
});
