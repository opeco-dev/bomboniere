// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {

  console.log('🌱 Iniciando seed...')

  const senhaHash = await bcrypt.hash('admin123', 10)

  // =============================
  // ADMIN
  // =============================

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@bomboniere.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@bomboniere.com',
      senha: senhaHash,
      role: 'admin'
    }
  })

  // =============================
  // CLIENTE (usuario + cliente)
  // =============================

  const usuarioCliente = await prisma.usuario.upsert({
    where: { email: 'cliente@email.com' },
    update: {},
    create: {
      nome: 'João Silva',
      email: 'cliente@email.com',
      senha: senhaHash,
      role: 'cliente',

      cliente: {
        create: {
          nome: 'João Silva',
          telefone: '11987654321',
          limiteCredito: 1000,
          setor: 'Expedição'
        }
      }
    },
    include: {
      cliente: true
    }
  })

  // =============================
  // PRODUTOS
  // =============================

  const chocolate = await prisma.produto.create({
    data: {
      nome: 'Chocolate ao Leite',
      descricao: 'Chocolate ao leite 1kg',
      preco: 35,
      custoUnit: 20,
      estoqueMin: 10,
      categoria: 'Chocolates',
      unidade: 'kg',

      estoque: {
        create: {
          quantidade: 50
        }
      }
    }
  })

  const bala = await prisma.produto.create({
    data: {
      nome: 'Bala de Goma',
      descricao: 'Bala de goma sortida 500g',
      preco: 12,
      custoUnit: 6,
      estoqueMin: 20,
      categoria: 'Balas',
      unidade: 'pacote',

      imagens: {
        create: {
          url: "https://jscxuru740.ufs.sh/f/UaJpr1BGwMePseAc9IU0FOgM2iKU9V8HjAxlZtTWkhrX1qyR"
        }
      },

      estoque: {
        create: {
          quantidade: 100
        }
      }
    }
  })

  const redbull = await prisma.produto.create({

    data: {

      nome: 'Redbull',
      descricao: 'Energético Redbull 250ml',
      preco: 15,
      custoUnit: 9,
      estoqueMin: 10,
      categoria: 'Bebidas',
      unidade: 'un',

      imagens: {
        create: [
          {
            url: "https://jscxuru740.ufs.sh/f/UaJpr1BGwMePbta4XrecZODGuWHLEYIgziqaFeVhXlktp1UT"
          },
          {
            url: "https://jscxuru740.ufs.sh/f/UaJpr1BGwMePDICyztYWsIPST4zunCtf8GwcJXvHmRxAOMjZ"
          }
        ]
      },

      estoque: {
        create: {
          quantidade: 60
        }
      }

    }

  })


  console.log('✅ Seed concluído!')
  console.log('👤 Admin:', admin.email)
  console.log('🧍 Cliente:', usuarioCliente.email)
  console.log('📦 Produtos criados:', [chocolate.nome, bala.nome, redbull.nome])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
