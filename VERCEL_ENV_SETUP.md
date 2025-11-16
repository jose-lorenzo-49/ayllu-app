# 🔧 CONFIGURAR VARIABLES DE ENTORNO EN VERCEL

## 🚨 ERROR ACTUAL:
```
supabaseUrl is required
```

## ✅ SOLUCIÓN:

### **Opción 1: Dashboard Web (Más fácil)**

1. **Ve a:** https://vercel.com/dashboard
2. **Selecciona tu proyecto:** `ayllu-16-november`
3. **Settings → Environment Variables**
4. **Agregar:**
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://iwgnztlphuodjazeguup.supabase.co`
   - **Environments:** Production, Preview, Development

5. **Agregar:**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3Z256dGxwaHVvZGphemVndXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODc1MDAsImV4cCI6MjA3ODg2MzUwMH0.9AoOn1qJ82WUvpeEuKKGxkBHAscXvVm00kvPfr2Vl54`
   - **Environments:** Production, Preview, Development

6. **Save**

### **Opción 2: CLI**

```bash
# Agregar URL
vercel env add VITE_SUPABASE_URL
# Pegar: https://iwgnztlphuodjazeguup.supabase.co

# Agregar Key
vercel env add VITE_SUPABASE_ANON_KEY
# Pegar: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3Z256dGxwaHVvZGphemVndXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODc1MDAsImV4cCI6MjA3ODg2MzUwMH0.9AoOn1qJ82WUvpeEuKKGxkBHAscXvVm00kvPfr2Vl54

# Redeploy
vercel --prod
```

## 🎯 DESPUÉS DE CONFIGURAR:

1. **Redeploy automático** se ejecutará
2. **App funcionará** con Supabase conectado
3. **Login/registro** persistirá en base de datos
4. **Posts** se guardarán en Supabase

## 🔗 TU APP:
https://ayllu-app-tfoc.vercel.app

Una vez agregadas las variables, la app funcionará completamente!