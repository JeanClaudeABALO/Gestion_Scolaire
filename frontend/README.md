# Frontend - Gestion Scolaire

## Démarrage

### Option 1 : Chrome (par défaut)
```bash
npm run dev
```
Ouvre automatiquement dans Google Chrome.

### Option 2 : Cursor (navigateur intégré)
```bash
npm run dev:cursor
```
Ne s'ouvre pas automatiquement. Cliquez sur le lien dans le terminal de Cursor.

### Option 3 : Firefox
```bash
npm run dev:firefox
```
Ouvre dans Firefox.

## Configuration

Le navigateur par défaut peut être configuré dans `.env.local` :
```
BROWSER=google-chrome
```

## Dépannage

Si le navigateur ne s'ouvre pas automatiquement :
1. Vérifiez que le serveur démarre correctement
2. Le lien sera affiché dans le terminal (ex: http://localhost:3000)
3. Cliquez sur le lien ou copiez-le dans votre navigateur
