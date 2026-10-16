import { createServicio } from './queries/servicios'

// al inicio de db/seed.ts
import 'dotenv/config'
console.log('DATABASE_URL:', process.env.DATABASE_URL)

async function seed() {
  const servicios = [
    {
      nombre: 'Bozo',
      tipo_servicio: 'zonas-individuales',
      descripcion: 'Depilación del bozo con láser soprano ice platinum, ideal para eliminar el vello facial de forma definitiva.',
      precio: 4000,
      imagen_url: 'https://i.imgur.com/w94hIsO.png',
      duracion_min: 15,
    },
    {
        nombre: 'Rostro Completo',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación completa del rostro.',
        precio: 5000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Cuello',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación del cuello con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 3000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Cabeza',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación de la cabeza con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 5000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Axilas',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación de las axilas con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 5000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Brazos',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación de los brazos con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 8000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Manos',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación de las manos con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 1000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Medio brazo',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación del medio brazo con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 5000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Abdomen',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación del abdomen con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 6000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Espalda entera',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación de la espalda completa con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 12000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },



      {
        nombre: 'Bajo espalda',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación del bajo espalda con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 6000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Pecho',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación del pecho con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 6000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Gluteos',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación de los glúteos con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 6000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Media pierna',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación de la media pierna con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 6000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Pierna entera',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación de la pierna completa con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 10000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Empeine y dedos',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación del empeine y dedos con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 1000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Cavado/pelvis completo',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación del cavado o pelvis completa con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 8000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      {
        nombre: 'Cavado/pelvis profundo',
        tipo_servicio: 'zonas-individuales',
        descripcion: 'Depilación del cavado o pelvis profunda con láser soprano ice platinum, ideal para eliminar el vello en esta zona.',
        precio: 5000,
        imagen_url: 'https://i.imgur.com/w94hIsO.png',
        duracion_min: 15,
      },
      //COMBOS HOMBRE
      {
        nombre: 'Combo 1',
        tipo_servicio: 'combos-hombre',
        descripcion: 'Incluye: rostro completo, axilas, brazos, espalda, abdomen, pecho, pelvis completa, glúteos, pierna entera.(Ahorro del 20% respecto a las zonas individuales)',
        precio: 52000,
        imagen_url: 'https://i.imgur.com/aHtML7E.png',
        duracion_min: 60,
      },
      {
        nombre: 'Combo 2',
        tipo_servicio: 'combos-hombre',
        descripcion: 'Incluye: rostro completo, axilas, pelvis completa, pierna entera y 2 zonas más a elección.(Ahorro del 15% respecto a las zonas individuales)',
        precio: 40500,
        imagen_url: 'https://i.imgur.com/aHtML7E.png',
        duracion_min: 60,
      },
      {
        nombre: 'Combo 3',
        tipo_servicio: 'combos-hombre',
        descripcion: 'Incluye: pecho, abdomen, espalda entera y 1 zona a elección.(Ahorro del 15% respecto a las zonas individuales)',
        precio: 28500,
        imagen_url: 'https://i.imgur.com/aHtML7E.png',
        duracion_min: 60,
      },


      
      {
        nombre: 'Combo 4',
        tipo_servicio: 'combos-hombre',
        descripcion: 'Incluye: rostro, axilas, pecho, abdomen, espalda, brazos.(Ahorro del 10% respecto a las zonas individuales)',
        precio: 30500,
        imagen_url: 'https://i.imgur.com/aHtML7E.png',
        duracion_min: 60,
      },
      {
        nombre: 'Combo 5',
        tipo_servicio: 'combos-hombre',
        descripcion: 'Incluye: axilas, pelvis completa, pierna entera.(Ahorro del 10% respecto a las zonas individuales)',
        precio: 20500,
        imagen_url: 'https://i.imgur.com/aHtML7E.png',
        duracion_min: 60,
      },
      {
        nombre: 'Combo 6',
        tipo_servicio: 'combos-hombre',
        descripcion: 'Incluye: pecho, abdomen, espalda entera. (Ahorro del 10% respecto a las zonas individuales)',
        precio: 21500,
        imagen_url: 'https://i.imgur.com/aHtML7E.png',
        duracion_min: 60,
      },
      
      //COMBOS MUJER

      {
        nombre: 'Combo 1',
        tipo_servicio: 'combos-mujer',
        descripcion: 'Incluye: rostro completo, axilas, brazos, abdomen, espalda baja, cavado completo, glúteos, pierna entera.(Ahorro del 20% respecto a las zonas individuales)',
        precio: 43000,
        imagen_url: 'https://i.imgur.com/7drfumZ.png',
        duracion_min: 60,
      },
      {
        nombre: 'Combo 2',
        tipo_servicio: 'combos-mujer',
        descripcion: 'Incluye: rostro completo, axilas, medio brazo, abdomen, espalda baja, glúteos, cavado completo, media pierna.(Ahorro del 15% respecto a las zonas individuales)',
        precio: 40000,
        imagen_url: 'https://i.imgur.com/7drfumZ.png',
        duracion_min: 60,
      },
      {
        nombre: 'Combo 3',
        tipo_servicio: 'combos-mujer',
        descripcion: 'Incluye: rostro completo, axilas, cavado completo, pierna entera, y 2 zonas a elección.(Ahorro del 15% respecto a las zonas individuales)',
        precio: 35000,
        imagen_url: 'https://i.imgur.com/7drfumZ.png',
        duracion_min: 60,
      },
      {
        nombre: 'Combo 4',
        tipo_servicio: 'combos-mujer',
        descripcion: 'Incluye: rostro completo, axilas, cavado completo, pierna entera.(Ahorro del 10% respecto a las zonas individuales)',
        precio: 25000,
        imagen_url: 'https://i.imgur.com/7drfumZ.png',
        duracion_min: 60,
      },
      {
        nombre: 'Combo 5',
        tipo_servicio: 'combos-mujer',
        descripcion: 'Incluye: axilas, cavado completo, pierna entera.(Ahorro del 10% respecto a las zonas individuales)',
        precio: 20500,
        imagen_url: 'https://i.imgur.com/7drfumZ.png',
        duracion_min: 60,
      },
      {
        nombre: 'Combo 6',
        tipo_servicio: 'combos-mujer',
        descripcion: 'Incluye: axilas, cavado completo, media pierna.(Ahorro del 10% respecto a las zonas individuales)',
        precio: 17000,
        imagen_url: 'https://i.imgur.com/7drfumZ.png',
        duracion_min: 60,
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