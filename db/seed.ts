import { createServicio } from './queries/servicios'

// al inicio de db/seed.ts
import 'dotenv/config'
console.log('DATABASE_URL:', process.env.DATABASE_URL)

async function seed() {
  const servicios = [
    {
      nombre: 'Soft Gel',
      tipo_servicio: 'unias',
      descripcion: 'Este servicio es ideal para quienes buscan una apariencia natural, Soft gel alarga tu uña dándole la forma y largo de preferencia. Es ideal para uñas muy cortas o con onicofagia pero las quieran más largas pero con mucha naturalidad Servicio incluye: limpieza, manicuria rusa,aplicación de soft gel, cortar y dar formar ,esmaltar con colores y diseños a gusto con aplicaciones de preferencia',
      precio: 21000,
      imagen_url: 'https://i.imgur.com/HHEpSQR.jpeg',
      duracion_min: 120,
    },
    {
      nombre: 'Capping Gel',
      tipo_servicio: 'unias',
      descripcion: 'Este tratamiento se realiza sobre uñas naturales, es ideal para quienes desean uñas más fuertes y duraderas, logra un crecimiento natural sano. Generalmente se les recomendó a aquellas clientas que tienen las uñas muy débiles y quebradizas o sufren de tiroides. El servico incluye: limpieza, manicuria rusa, cortado y limado, aplicación del capping gel y luego se realiza colores y diseños de preferencia',
      precio: 18000,
      imagen_url: 'https://i.imgur.com/NOGN8ef.jpeg',
      duracion_min: 120,
    },
    {
      nombre: 'Semipermanente',
      tipo_servicio: 'unias',
      descripcion: 'Este servicio se realiza sobre tus uñas naturales. Es un esmaltado sencillo que le da una apariencia natural y prolija a tu uñas sin brindarle ninguna propiedad más allá de un esmaltado clásico. Este servicio es ideal para quienes tienen uñas naturales saludables y sanas. El servicio incluye: limpieza, manicuria rusa, corte y limado a gusto, esmaltado semipermanente con colores y diseños de preferencia',
      precio: 15500,
      imagen_url: 'https://i.imgur.com/44bD2b4.jpeg',
      duracion_min: 120,
    }
  ]

  for (const servicio of servicios) {
    await createServicio(servicio)
  }

  console.log('✅ Seed ejecutado con éxito')
}

seed().catch((err) => {
  console.error('❌ Error al ejecutar seed:', err)
})