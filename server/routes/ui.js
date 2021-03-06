import { Router } from 'express';

const uiRoutes = Router();
const root = 'frontend';

uiRoutes.get('/', (req, res) => {
  res.sendFile('index.html', { root })
})
uiRoutes.get('/profile', (req, res) => {
  res.sendFile('auth/user-profile.html', { root })
})
uiRoutes.get('/question/:id', (req, res) => {
  res.sendFile('question.html', { root })
})
uiRoutes.get('/questions/:id', (req, res) => {
  res.sendFile('auth/question.html', { root })
})



export default uiRoutes;
