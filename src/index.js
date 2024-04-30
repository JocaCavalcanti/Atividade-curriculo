const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/curriculos', async (req, res) => {
  try {
    const curriculos = await prisma.curriculo.findMany({
      include: {
        endereco: true,
        educacao: true,
        experiencia: true,
        habilidades: true,
      },
    });
    res.json(curriculos);
  } catch (error) {
    console.error('Erro ao obter currículos:', error);
    res.status(500).json({ error: 'Erro ao obter currículos' });
  }
});

app.post('/curriculos', async (req, res) => {
  const { nomeCompleto, email, telefone, endereco, educacao, experiencia, habilidades, tecnologiasFavoritas } = req.body;
  
  try {
    const newCurriculo = await prisma.curriculo.create({
      data: {
        nomeCompleto,
        email,
        telefone,
        endereco: {
          create: endereco,
        },
        educacao: {
          createMany: {
            data: educacao,
          },
        },
        experiencia: {
          createMany: {
            data: experiencia,
          },
        },
        habilidades: {
          createMany: {
            data: habilidades,
          },
        },
        tecnologiasFavoritas,
      },
      include: {
        endereco: true,
        educacao: true,
        experiencia: true,
        habilidades: true,
      },
    });
    res.json(newCurriculo);
  } catch (error) {
    console.error('Erro ao criar currículo:', error);
    res.status(500).json({ error: 'Erro ao criar currículo' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
