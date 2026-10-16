import { createServicio } from './queries/servicios'

// al inicio de db/seed.ts
import 'dotenv/config'
console.log('DATABASE_URL:', process.env.DATABASE_URL)

async function seed() {
  const servicios = [
    {
      nombre: 'Lifting',
      tipo_servicio: 'pestanas',
      descripcion: 'Es un tratamiento que realza y curva tus pestañas naturales desde la raíz, logrando un efecto visual de mayor longitud, curvatura y definición ¡sin necesidad de extensiones! Es ideal para quienes buscan un look natural aprovechando que natural mente ya tiene pestañas largas. El resultado es similar al de usar un arqueador y máscara, pero ¡todo el tiempo!',
      precio: 20000,
      imagen_url: 'https://i.imgur.com/oRljwDu.jpeg',
      duracion_min: 60,
    },
    {
        nombre: 'Extensión efecto Rimel',
        tipo_servicio: 'pestanas',
        descripcion: 'Imita el look de unas pestañas maquilladas con máscara: más densas, oscuras y marcadas. Se combinan diferentes largos y curvaturas para dar un acabado intenso pero no exagerado. Perfecto para quienes aman el efecto del maquillaje sin tener que aplicarlo todos los días.',
        precio: 21000,
        imagen_url: 'https://i.imgur.com/k66WTUj.jpeg',
        duracion_min: 60,
      },
      {
        nombre: 'Extensión Brasileras',
        tipo_servicio: 'pestanas',
        descripcion: 'Una técnica intermedia entre lo natural y lo glam. Se colocan pequeños abanicos de 2 a 3 pelitos por pestaña natural, lo que aporta más volumen que el pelo por pelo, pero sin llegar al efecto del volumen ruso. Ideal para un look más definido, sin ser tan cargado.',
        precio: 23000,
        imagen_url: 'https://i.imgur.com/DE4wQo4.jpeg',
        duracion_min: 60,
      },
      {
        nombre: 'Extensión pelo por pelo',
        tipo_servicio: 'pestanas',
        descripcion: 'La técnica más natural. Se coloca una extensión sobre cada pestaña natural, logrando un efecto sutil, prolijo y elegante. Ideal para quienes quieren más definición y longitud, sin exagerar.', 
        precio: 21000,
        imagen_url: 'https://i.imgur.com/JFnkRsJ.jpeg',
        duracion_min: 60,
      },
      {
        nombre: 'Extensión volumen 3D',
        tipo_servicio: 'pestanas',
        descripcion: 'Una mezcla entre la técnica clásica (pelo por pelo) y volumen. Combina la definición de las extensiones individuales con la densidad de los abanicos. Es perfecta si querés un look con más cuerpo pero que siga viéndose natural.',
        precio: 25000,
        imagen_url: 'https://i.imgur.com/Ixm0TpW.jpeg',
        duracion_min: 60,
      },
      {
        nombre: 'Extensión volumen Ruso',
        tipo_servicio: 'pestanas',
        descripcion: 'La técnica más llamativa y dramática. Se aplican abanicos de 4 a 6 extensiones ultrafinas en cada pestaña natural, creando un efecto súper tupido, con mucha presencia. Ideal para eventos, fotos, o simplemente si te gusta un estilo más glamoroso y destacado.',
        precio: 28000,
        imagen_url: 'https://i.imgur.com/XKw9gkm.jpeg',
        duracion_min: 60,
      },
      {
        nombre: 'Perfilado',
        tipo_servicio: 'cejas',
        descripcion: 'El perfilado de cejas es un servicio dedicado a realzar la forma natural de tus cejas, definiendo su contorno para armonizar tu rostro. Utilizo cera de alta calidad para retirar el vello no deseado de manera rápida y precisa, y luego realizo los detalles con pinza para un acabado perfecto y prolijo. Este método asegura una definición impecable, cuidando la piel y respetando tu estilo personal. Ideal para quienes quieren unas cejas limpias, bien formadas y naturales.',
        precio: 8000,
        imagen_url: 'https://i.imgur.com/Rcnb6fV.jpeg',
        duracion_min: 30,
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