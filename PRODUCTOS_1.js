/* ============================================================
   TBZ STREAMING SERVICES — CATÁLOGO DE PRODUCTOS
   ------------------------------------------------------------
   Generado desde el panel de administración (admin.html).
   Reemplazá el productos.js de tu sitio por este archivo.
   ============================================================ */
const PRODUCTOS = {
  "config": {
    "vendedores": [
      {
        "id": "vendedor tobiaz",
        "nombre": "Vendedor Tobiaz",
        "numero": "5492314408721"
      },
      {
        "id": "vendedor2",
        "nombre": "Vendedor vulpis",
        "numero": "5492634763377"
      }
    ],
    "mensaje": {
      "saludo": "Hola :)",
      "intro": "Quiero comprar:",
      "despedida": "Muchas gracias :D",
      "consulta": "Hola! Quiero más información sobre los productos de TBZ Streaming Services."
    }
  },
  "diamantes": {
    "ilimitado": {
      "etiqueta": "Recarga Ilimitada",
      "nota": "Cargas con bonus del 20%",
      "badge": "★ BONUS 20%",
      "items": [
        {
          "id": "d-120",
          "cantidad": 120,
          "precio": 1600
        },
        {
          "id": "d-372",
          "cantidad": 372,
          "precio": 4800
        },
        {
          "id": "d-624",
          "cantidad": 624,
          "precio": 6700,
          "destacado": true
        },
        {
          "id": "d-1166",
          "cantidad": 1166,
          "precio": 12000
        },
        {
          "id": "d-2596",
          "cantidad": 2596,
          "precio": 22200
        },
        {
          "id": "d-6720",
          "cantidad": 6720,
          "precio": 56100
        }
      ]
    },
    "limitado": {
      "etiqueta": "Recarga Limitada",
      "nota": "Cupos por ID · máximo 1 por usuario",
      "badge": "LIMITADO",
      "items": [
        {
          "id": "d-110",
          "cantidad": 110,
          "precio": 1300
        },
        {
          "id": "d-341",
          "cantidad": 341,
          "precio": 3500
        },
        {
          "id": "d-572",
          "cantidad": 572,
          "precio": 5000
        },
        {
          "id": "d-1166l",
          "cantidad": 1166,
          "precio": 8900
        },
        {
          "id": "d-2398",
          "cantidad": 2398,
          "precio": 18000
        },
        {
          "id": "d-6160",
          "cantidad": 6160,
          "precio": 42500
        }
      ]
    },
    "extras": [
      {
        "id": "x-fragmento",
        "nombre": "Fragmento",
        "detalle": "Cantidad mínima: 35 fragmentos",
        "precio": 100,
        "unidad": "c/u",
        "minimo": 35
      },
      {
        "id": "x-caja",
        "nombre": "Caja de Fragmentos",
        "detalle": "Cantidad mínima: 7 cajas",
        "precio": 500,
        "unidad": "c/caja",
        "minimo": 7
      },
      {
        "id": "x-booyah",
        "nombre": "Pase Booyah",
        "detalle": "Temporada actual",
        "precio": 2400,
        "unidad": "",
        "minimo": 1
      }
    ]
  },
  "streaming": [
    {
      "id": "netflix",
      "nombre": "Netflix",
      "tipo": "Cuenta de streaming",
      "icono": "fa-brands fa-n",
      "color": "#E50914",
      "planes": [
        {
          "nombre": "Perfil",
          "precio": 6400
        },
        {
          "nombre": "Perfil privado",
          "precio": 9900
        }
      ]
    },
    {
      "id": "hbomax",
      "nombre": "HBO Max",
      "tipo": "Cuenta de streaming",
      "icono": "fa-solid fa-clapperboard",
      "color": "#8B5CF6",
      "planes": [
        {
          "nombre": "Estándar",
          "precio": 3300
        },
        {
          "nombre": "Platino",
          "precio": 6600
        }
      ]
    },
    {
      "id": "disney",
      "nombre": "Disney+",
      "tipo": "Cuenta de streaming",
      "icono": "fa-solid fa-star",
      "color": "#0E3F8C",
      "planes": [
        {
          "nombre": "Estándar",
          "precio": 3800
        },
        {
          "nombre": "Premium",
          "precio": 7600
        }
      ]
    },
    {
      "id": "primevideo",
      "nombre": "Prime Video",
      "tipo": "Cuenta de streaming",
      "icono": "fa-brands fa-amazon",
      "color": "#00A8E1",
      "planes": [
        {
          "nombre": "Mensual",
          "precio": 2800
        }
      ]
    },
    {
      "id": "crunchyroll",
      "nombre": "Crunchyroll",
      "tipo": "Anime en streaming",
      "icono": "fa-solid fa-circle-play",
      "color": "#F47521",
      "planes": [
        {
          "nombre": "Mensual",
          "precio": 2200
        }
      ]
    },
    {
      "id": "spotify",
      "nombre": "Spotify",
      "tipo": "Música en streaming",
      "icono": "fa-brands fa-spotify",
      "color": "#1DB954",
      "planes": [
        {
          "nombre": "Mensual",
          "precio": 5500
        }
      ]
    },
    {
      "id": "chatgpt",
      "nombre": "ChatGPT",
      "tipo": "Inteligencia artificial",
      "icono": "fa-solid fa-robot",
      "color": "#74AA9C",
      "planes": [
        {
          "nombre": "Cuenta completa",
          "precio": null,
          "consultar": true
        }
      ]
    },
    {
      "id": "canva",
      "nombre": "Canva",
      "tipo": "Diseño gráfico",
      "icono": "fa-solid fa-palette",
      "color": "#00C4CC",
      "planes": [
        {
          "nombre": "Mensual",
          "precio": 3200
        },
        {
          "nombre": "Anual",
          "precio": 11400
        }
      ]
    },
    {
      "id": "capcut",
      "nombre": "CapCut",
      "tipo": "Edición de video",
      "icono": "fa-solid fa-film",
      "color": "#000000",
      "planes": [
        {
          "nombre": "Mensual",
          "precio": 7400
        }
      ]
    },
    {
      "id": "paramount",
      "nombre": "Paramount+",
      "tipo": "Cuenta de streaming",
      "icono": "fa-solid fa-mountain",
      "color": "#0064FF",
      "planes": [
        {
          "nombre": "Perfil",
          "precio": 2400
        },
        {
          "nombre": "Perfil privado",
          "precio": 4800
        }
      ]
    },
    {
      "id": "appletv",
      "nombre": "Apple TV",
      "tipo": "Cuenta de streaming",
      "icono": "fa-brands fa-apple",
      "color": "#A2AAAD",
      "planes": [
        {
          "nombre": "Perfil 3 meses (sin MLS)",
          "precio": 4100
        },
        {
          "nombre": "Cuenta 3 meses (sin MLS)",
          "precio": 8200
        }
      ]
    },
    {
      "id": "youtube",
      "nombre": "YouTube Premium",
      "tipo": "Video sin anuncios",
      "icono": "fa-brands fa-youtube",
      "color": "#FF0000",
      "planes": [
        {
          "nombre": "3 meses",
          "precio": 10200
        }
      ]
    },
    {
      "id": "xbox",
      "nombre": "Xbox Game Pass",
      "tipo": "Videojuegos",
      "icono": "fa-brands fa-xbox",
      "color": "#107C10",
      "planes": [
        {
          "nombre": "Mensual",
          "precio": 11600
        }
      ]
    }
  ],
 

  sectores: [

    {
  id: "seguidores-instagram",

  titulo: "Catálogo Seguidores Instagram",

  eyebrow: "Redes Sociales",

  descripcion:
    "Aumentá tu presencia en Instagram con packs de seguidores de alta calidad, entrega rápida y precios accesibles.",

  items: [
    {
      nombre: "Seguidores Instagram",
      tipo: "Crecimiento de Redes",
      icono: "fa-brands fa-instagram",
      color: "#E1306C",
      planes: [
        { nombre: "50 Seguidores", precio: 100 },
        { nombre: "100 Seguidores", precio: 190 },
        { nombre: "150 Seguidores", precio: 283 },
        { nombre: "250 Seguidores", precio: 475 },
        { nombre: "320 Seguidores", precio: 600 },
        { nombre: "500 Seguidores", precio: 1000 },
        { nombre: "610 Seguidores", precio: 1270 },
        { nombre: "800 Seguidores", precio: 1554 },
        { nombre: "1.000 Seguidores", precio: 2000 },
        { nombre: "1.500 Seguidores", precio: 2930 },
        { nombre: "2.000 Seguidores", precio: 3745 },
        { nombre: "2.500 Seguidores", precio: 4760 },
        { nombre: "3.000 Seguidores", precio: 5670 },
        { nombre: "4.000 Seguidores", precio: 7520 }
      ]
    }
  ]
}

  ]

}
        
      
    
  
;